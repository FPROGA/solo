import { Injectable } from '@nestjs/common';
import knex from 'knex';
import {
  MAX_TEST_ATTEMPTS,
  TEST_COOLDOWN_MS,
  TEST_DURATION_MS,
} from './test-session.constants';

type SessionAnswers = Record<string, string>;

export interface SubjectWithStatus {
  id: number;
  subject: string;
  test_id: number | null;
  attemptsUsed: number;
  maxAttempts: number;
  canStart: boolean;
  reason: string | null;
  cooldownUntil: string | null;
  isActive?: boolean;
}

export interface TestResultRow {
  id: number;
  subject_id: number;
  subject: string;
  grade: number;
  total: number;
  percentage: number;
  mark: number;
  created_at: string;
}

@Injectable()
export class TestService {
  private knex: any;

  /** PostgreSQL/knex часто отдаёт id как string — сравниваем численно */
  private sameNum(a: unknown, b: unknown): boolean {
    return Number(a) === Number(b);
  }

  private markFromPercent(percentage: number): number {
    if (percentage >= 85) return 5;
    if (percentage >= 60) return 4;
    if (percentage >= 40) return 3;
    return 2;
  }

  constructor() {
    this.knex = knex({
      client: 'pg',
      connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: String(process.env.DB_PASSWORD || 'TemaiSofaBF1!'),
        database: process.env.DB_DATABASE || 'solo',
      },
    });
    console.log('✅ KNEX В SERVISE СОЗДАН!');
  }

  async getSubjects(clas: number) {
    try {
      const subjects = await this.knex
        .select('subjects.id', 'subjects.subject')
        .from('class_subjects')
        .join('subjects', 'class_subjects.subject_id', 'subjects.id')
        .where('class_subjects.class', clas);
      return { subjects };
    } catch (error) {
      console.error('Ошибка:', error);
      return { error: 'Ошибка сохранения' };
    }
  }

  async getTest(subject_id: number, clas: number, user_id?: number, session_id?: number) {
    try {
      if (user_id) {
        await this.expireStaleSessions(user_id);
        const access = await this.assertTestAccess(user_id, subject_id, clas, session_id);
        if (access.error) {
          return { error: access.error };
        }
      }

      const test = await this.findRealTest(subject_id, clas);
      if (!test) {
        return { error: 'Тест не найден' };
      }

      const questions = await this.knex('questions').where({ test_id: test.id });
      const session =
        user_id != null
          ? await this.getActiveSessionForSubject(user_id, subject_id, clas)
          : null;

      return {
        questions,
        test,
        session: session
          ? {
              id: session.id,
              ends_at: session.ends_at,
              started_at: session.started_at,
              answers: session.answers ?? {},
            }
          : null,
      };
    } catch (e) {
      console.error('Ошибка:', e);
      return { error: 'Ошибка сохранения' };
    }
  }

  async getSubjectsStatus(user_id: number, clas: number) {
    try {
      await this.expireStaleSessions(user_id);
      const { subjects } = await this.getSubjects(clas);
      if (!subjects) {
        return { error: 'Не удалось загрузить предметы' };
      }

      const activeSession = await this.getActiveSession(user_id);
      const enriched: SubjectWithStatus[] = [];

      for (const sub of subjects) {
        const test = await this.findRealTest(sub.id, clas);
        const status = await this.getSubjectAttemptStatus(
          user_id,
          sub.id,
          clas,
          test?.id ?? null,
          activeSession,
        );
        enriched.push({
          id: sub.id,
          subject: sub.subject,
          test_id: test?.id ?? null,
          ...status,
        });
      }

      const results = await this.getUserResultsForClass(user_id, clas);

      return {
        subjects: enriched,
        results,
        activeSession: activeSession
          ? await this.mapActiveSessionInfo(activeSession)
          : null,
        maxAttempts: MAX_TEST_ATTEMPTS,
        testDurationMs: TEST_DURATION_MS,
        cooldownMs: TEST_COOLDOWN_MS,
      };
    } catch (e) {
      console.error('Ошибка:', e);
      return { error: 'Ошибка загрузки статуса тестов' };
    }
  }

  async getUserResultsForClass(
    user_id: number,
    clas: number,
  ): Promise<TestResultRow[]> {
    const rows = await this.knex('results')
      .select(
        'results.id',
        'results.grade',
        'results.created_at',
        'results.test_id',
        'results.subject_id',
        'subjects.subject',
      )
      .join('tests', 'results.test_id', 'tests.id')
      .join('subjects', 'results.subject_id', 'subjects.id')
      .where('results.user_id', user_id)
      .where('tests.class', clas)
      .where('tests.is_demo', false)
      .orderBy('results.created_at', 'desc');

    if (rows.length === 0) {
      return [];
    }

    const testIds = [...new Set(rows.map((r: { test_id: number }) => Number(r.test_id)))];
    const countRows = await this.knex('questions')
      .select('test_id')
      .count('* as total')
      .whereIn('test_id', testIds)
      .groupBy('test_id');

    const totalByTest: Record<number, number> = {};
    for (const c of countRows) {
      totalByTest[Number(c.test_id)] = Number(c.total);
    }

    return rows.map((row: any) => {
      const total = totalByTest[Number(row.test_id)] ?? 0;
      const grade = Number(row.grade);
      const percentage =
        total > 0 ? Math.round((grade / total) * 100) : 0;
      return {
        id: Number(row.id),
        subject_id: Number(row.subject_id),
        subject: row.subject,
        grade,
        total,
        percentage,
        mark: this.markFromPercent(percentage),
        created_at: row.created_at,
      };
    });
  }

  async startSession(user_id: number, subject_id: number, clas: number) {
    try {
      await this.expireStaleSessions(user_id);

      const active = await this.getActiveSession(user_id);
      if (active) {
        if (
          this.sameNum(active.subject_id, subject_id) &&
          this.sameNum(active.class, clas)
        ) {
          return {
            session: this.mapSession(active),
            resumed: true,
          };
        }
        return {
          error:
            'У вас уже идёт другой тест. Дождитесь окончания таймера или завершите текущий тест.',
          activeSession: this.mapSession(active),
        };
      }

      const test = await this.findRealTest(subject_id, clas);
      if (!test) {
        return { error: 'Тест не найден' };
      }

      const block = await this.getStartBlockReason(user_id, test.id);
      if (block) {
        return { error: block };
      }

      const startedAt = new Date();
      const endsAt = new Date(startedAt.getTime() + TEST_DURATION_MS);

      const [session] = await this.knex('test_sessions')
        .insert({
          user_id,
          test_id: test.id,
          subject_id,
          class: clas,
          started_at: startedAt,
          ends_at: endsAt,
          status: 'active',
          answers: {},
        })
        .returning('*');

      return { session: this.mapSession(session), resumed: false };
    } catch (e) {
      console.error('Ошибка:', e);
      return { error: 'Не удалось начать тест' };
    }
  }

  async getSessionById(session_id: number, user_id: number) {
    try {
      await this.expireStaleSessions(user_id);
      const session = await this.knex('test_sessions')
        .where({ id: session_id, user_id })
        .first();
      if (!session) {
        return { error: 'Сессия не найдена' };
      }
      if (session.status !== 'active') {
        return { error: 'Сессия уже завершена', session: this.mapSession(session) };
      }
      if (new Date(session.ends_at).getTime() <= Date.now()) {
        await this.finalizeSession(session, 'expired');
        return { error: 'Время теста истекло', expired: true };
      }
      return { session: this.mapSession(session) };
    } catch (e) {
      console.error('Ошибка:', e);
      return { error: 'Ошибка загрузки сессии' };
    }
  }

  async saveSessionAnswers(
    session_id: number,
    user_id: number,
    answers: SessionAnswers,
  ) {
    try {
      await this.expireStaleSessions(user_id);
      const session = await this.knex('test_sessions')
        .where({ id: session_id, user_id, status: 'active' })
        .first();
      if (!session) {
        return { error: 'Активная сессия не найдена' };
      }
      if (new Date(session.ends_at).getTime() <= Date.now()) {
        await this.finalizeSession(session, 'expired');
        return { error: 'Время теста истекло', expired: true };
      }
      await this.knex('test_sessions')
        .where({ id: session_id })
        .update({ answers });
      return { ok: true };
    } catch (e) {
      console.error('Ошибка:', e);
      return { error: 'Не удалось сохранить ответы' };
    }
  }

  async completeSession(
    session_id: number,
    user_id: number,
    grade?: number,
    answers?: SessionAnswers,
  ) {
    try {
      await this.expireStaleSessions(user_id);
      const session = await this.knex('test_sessions')
        .where({ id: session_id, user_id })
        .first();
      if (!session) {
        return { error: 'Сессия не найдена' };
      }
      if (session.status !== 'active') {
        return {
          result: 'Уже завершено',
          grade: session.grade,
          total: await this.countQuestions(session.test_id),
        };
      }

      if (answers) {
        await this.knex('test_sessions')
          .where({ id: session_id })
          .update({ answers });
        session.answers = answers;
      }

      const finalGrade =
        grade ?? (await this.computeGrade(session.test_id, session.answers ?? {}));

      await this.finalizeSession(session, 'completed', finalGrade);
      const total = await this.countQuestions(session.test_id);

      return {
        result: 'Результат сохранен',
        grade: finalGrade,
        total,
        test_id: session.test_id,
        subject_id: session.subject_id,
      };
    } catch (e) {
      console.error('Ошибка:', e);
      return { error: 'Ошибка сохранения' };
    }
  }

  async saveResult(
    grade: number,
    user_id: number,
    test_id: number,
    subject_id: number,
    session_id?: number,
  ) {
    try {
      if (session_id) {
        return await this.completeSession(session_id, user_id, grade);
      }
      await this.knex('results').insert({
        user_id,
        subject_id,
        test_id,
        grade,
        created_at: new Date(),
      });
      return { result: 'Результат сохранен' };
    } catch (e) {
      console.error('Ошибка:', e);
      return { error: 'Ошибка сохранения' };
    }
  }

  async getDemoTest(clas: number) {
    try {
      const subjects = await this.knex
        .select('subjects.id', 'subjects.subject')
        .from('tests')
        .join('subjects', 'tests.subject_id', 'subjects.id')
        .where({
          'tests.class': clas,
          'tests.is_demo': true,
        })
        .groupBy('subjects.id', 'subjects.subject')
        .orderBy('subjects.subject');
      return { subjects };
    } catch (e) {
      console.error('Ошибка:', e);
      return { error: 'Ошибка сохранения' };
    }
  }

  async getDemoTestQuestions(subject_id: number, clas: number) {
    try {
      const test = await this.knex('tests')
        .where({
          subject_id,
          class: clas,
          is_demo: true,
        })
        .first();
      if (!test) {
        return { error: 'Демоверсия не найдена' };
      }
      const questions = await this.knex('questions').where({
        test_id: test.id,
      });
      return { questions, test };
    } catch (e) {
      console.error('Ошибка:', e);
      return { error: 'Ошибка сохранения' };
    }
  }

  private async mapActiveSessionInfo(session: any) {
    const subjectRow = await this.knex('subjects')
      .where('id', session.subject_id)
      .first();
    return {
      id: Number(session.id),
      subject_id: Number(session.subject_id),
      class: Number(session.class),
      subject: subjectRow?.subject ?? null,
      ends_at: session.ends_at,
      started_at: session.started_at,
    };
  }

  private mapSession(session: any) {
    return {
      id: session.id,
      user_id: session.user_id,
      test_id: session.test_id,
      subject_id: session.subject_id,
      class: session.class,
      started_at: session.started_at,
      ends_at: session.ends_at,
      status: session.status,
      answers:
        typeof session.answers === 'string'
          ? JSON.parse(session.answers)
          : session.answers ?? {},
    };
  }

  private async findRealTest(subject_id: number, clas: number) {
    return this.knex('tests')
      .where({ subject_id, class: clas, is_demo: false })
      .first();
  }

  private async countAttempts(user_id: number, test_id: number) {
    const row = await this.knex('results')
      .where({ user_id, test_id })
      .count('* as count')
      .first();
    return Number(row?.count ?? 0);
  }

  private async getLastResult(user_id: number, test_id: number) {
    return this.knex('results')
      .where({ user_id, test_id })
      .orderBy('created_at', 'desc')
      .first();
  }

  private async countQuestions(test_id: number) {
    const row = await this.knex('questions')
      .where({ test_id })
      .count('* as count')
      .first();
    return Number(row?.count ?? 0);
  }

  private async computeGrade(test_id: number, answers: SessionAnswers) {
    const questions = await this.knex('questions').where({ test_id });
    let count = 0;
    for (const q of questions) {
      const key = String(q.id);
      if (answers[key] === q.correct_answer) {
        count++;
      }
    }
    return count;
  }

  private async getActiveSession(user_id: number) {
    return this.knex('test_sessions')
      .where({ user_id, status: 'active' })
      .orderBy('started_at', 'desc')
      .first();
  }

  private async getActiveSessionForSubject(
    user_id: number,
    subject_id: number,
    clas: number,
  ) {
    return this.knex('test_sessions')
      .where({ user_id, subject_id, class: clas, status: 'active' })
      .first();
  }

  private async getStartBlockReason(user_id: number, test_id: number) {
    const attempts = await this.countAttempts(user_id, test_id);
    if (attempts >= MAX_TEST_ATTEMPTS) {
      return `Исчерпаны все попытки (${MAX_TEST_ATTEMPTS} из ${MAX_TEST_ATTEMPTS}).`;
    }
    const last = await this.getLastResult(user_id, test_id);
    if (last?.created_at) {
      const elapsed = Date.now() - new Date(last.created_at).getTime();
      if (elapsed < TEST_COOLDOWN_MS) {
        const hoursLeft = Math.ceil((TEST_COOLDOWN_MS - elapsed) / (60 * 60 * 1000));
        return `Повторная попытка будет доступна через ~${hoursLeft} ч. (пауза 24 часа после прохождения).`;
      }
    }
    return null;
  }

  private async getSubjectAttemptStatus(
    user_id: number,
    subject_id: number,
    clas: number,
    test_id: number | null,
    activeSession: any,
  ) {
    const maxAttempts = MAX_TEST_ATTEMPTS;
    if (!test_id) {
      return {
        attemptsUsed: 0,
        maxAttempts,
        canStart: false,
        reason: 'Тест для предмета не найден',
        cooldownUntil: null as string | null,
      };
    }

    const attemptsUsed = await this.countAttempts(user_id, test_id);
    const last = await this.getLastResult(user_id, test_id);
    let cooldownUntil: string | null = null;
    if (last?.created_at) {
      const unlockAt = new Date(last.created_at).getTime() + TEST_COOLDOWN_MS;
      if (unlockAt > Date.now()) {
        cooldownUntil = new Date(unlockAt).toISOString();
      }
    }

    if (activeSession) {
      if (
        this.sameNum(activeSession.subject_id, subject_id) &&
        this.sameNum(activeSession.class, clas)
      ) {
        return {
          attemptsUsed,
          maxAttempts,
          canStart: true,
          reason: 'continue',
          cooldownUntil,
          isActive: true,
        };
      }
      return {
        attemptsUsed,
        maxAttempts,
        canStart: false,
        reason: 'other_test_active',
        cooldownUntil,
        isActive: false,
      };
    }

    if (attemptsUsed >= maxAttempts) {
      return {
        attemptsUsed,
        maxAttempts,
        canStart: false,
        reason: 'no_attempts',
        cooldownUntil,
        isActive: false,
      };
    }

    if (cooldownUntil) {
      return {
        attemptsUsed,
        maxAttempts,
        canStart: false,
        reason: 'cooldown',
        cooldownUntil,
        isActive: false,
      };
    }

    return {
      attemptsUsed,
      maxAttempts,
      canStart: true,
      reason: null as string | null,
      cooldownUntil,
      isActive: false,
    };
  }

  private async assertTestAccess(
    user_id: number,
    subject_id: number,
    clas: number,
    session_id?: number,
  ) {
    const active = await this.getActiveSession(user_id);
    if (!active) {
      return { error: 'Сначала начните тест со страницы выбора предмета.' };
    }
    if (
      !this.sameNum(active.subject_id, subject_id) ||
      !this.sameNum(active.class, clas)
    ) {
      return { error: 'Сейчас активен другой тест.' };
    }
    if (session_id && !this.sameNum(active.id, session_id)) {
      return { error: 'Неверная сессия теста.' };
    }
    return { ok: true };
  }

  async expireStaleSessions(user_id?: number) {
    let query = this.knex('test_sessions').where('status', 'active').where(
      'ends_at',
      '<',
      new Date(),
    );
    if (user_id) {
      query = query.andWhere('user_id', user_id);
    }
    const stale = await query;
    for (const session of stale) {
      await this.finalizeSession(session, 'expired');
    }
  }

  private async finalizeSession(
    session: any,
    status: 'completed' | 'expired',
    grade?: number,
  ) {
    const fresh = await this.knex('test_sessions').where({ id: session.id }).first();
    if (!fresh || fresh.status !== 'active') {
      return;
    }
    session = fresh;

    const answers =
      typeof session.answers === 'string'
        ? JSON.parse(session.answers || '{}')
        : session.answers ?? {};

    const finalGrade =
      grade ?? (await this.computeGrade(session.test_id, answers));

    await this.knex('test_sessions')
      .where({ id: session.id })
      .update({
        status,
        grade: finalGrade,
        completed_at: new Date(),
        answers,
      });

    await this.knex('results').insert({
      user_id: session.user_id,
      subject_id: session.subject_id,
      test_id: session.test_id,
      grade: finalGrade,
      created_at: new Date(),
    });
  }
}
