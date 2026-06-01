import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import knex from 'knex';

/** Данные формы «Купить аттестацию» — регистрация аккаунта */
export interface PurchaseDto {
  childFirstName: string;
  childLastName: string;
  payerFullName: string;
  phone: string;
  email: string;
  password: string;
  /** id карточки 1…11 = номер класса */
  attestationId: number;
}

function normalizePhone(phone: string): string {
  const d = String(phone).replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('8')) return `7${d.slice(1)}`;
  if (d.length === 10) return `7${d}`;
  return d;
}

function toPublicUser(row: Record<string, unknown>) {
  let classes: number[] = [];
  const raw = row.purchased_classes;
  if (Array.isArray(raw)) classes = raw.map((n) => Number(n)).filter((n) => Number.isFinite(n));
  else if (typeof raw === 'string') {
    try {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) classes = p.map((n) => Number(n));
    } catch {
      /* ignore */
    }
  }
  return {
    id: String(row.id),
    username: String(row.username ?? ''),
    phoneNumber: String(row.phoneNumber ?? ''),
    email: row.email != null ? String(row.email) : '',
    childFirstName: row.child_first_name != null ? String(row.child_first_name) : '',
    childLastName: row.child_last_name != null ? String(row.child_last_name) : '',
    payerFullName: row.payer_full_name != null ? String(row.payer_full_name) : '',
    purchasedClasses: classes,
  };
}

@Injectable()
export class AuthActiveService {
  private knex: ReturnType<typeof knex>;

  constructor() {
    // Тот же формат, что в TestService — иначе при пустом DB_PASSWORD pg выдаёт
    // SASL: client password must be a string (SCRAM не принимает '' как у вас в .env).
    this.knex = knex({
      client: 'pg',
      connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER || 'postgres',
        password: String(process.env.DB_PASSWORD || 'TemaiSofaBF1!'),
        database: process.env.DB_DATABASE || 'solo',
      },
    });
  }

  async registerPurchase(dto: PurchaseDto) {
    const phoneNumber = normalizePhone(dto.phone);
    if (phoneNumber.length < 11) {
      throw new BadRequestException('Укажите корректный номер телефона');
    }
    if (!dto.password || dto.password.length < 6) {
      throw new BadRequestException('Пароль не короче 6 символов');
    }
    const classNum = Number(dto.attestationId);
    if (!Number.isFinite(classNum) || classNum < 1 || classNum > 11) {
      throw new BadRequestException('Некорректный класс');
    }

    const exists = await this.knex('users').where({ phoneNumber }).first();
    if (exists) {
      throw new ConflictException(
        'Этот номер уже зарегистрирован. Войдите в личный кабинет или используйте другой телефон.',
      );
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const username = `${dto.childFirstName} ${dto.childLastName}`.trim() || 'Ученик';

    const purchased_classes = JSON.stringify([classNum]);

    await this.knex('users').insert({
      username,
      phoneNumber,
      password: hash,
      email: dto.email?.trim() ?? '',
      child_first_name: dto.childFirstName?.trim() ?? '',
      child_last_name: dto.childLastName?.trim() ?? '',
      payer_full_name: dto.payerFullName?.trim() ?? '',
      purchased_classes: this.knex.raw('?::jsonb', [purchased_classes]),
    });

    const row = await this.knex('users').where({ phoneNumber }).first();
    if (!row) throw new BadRequestException('Не удалось создать пользователя');
    return { user: toPublicUser(row) };
  }

  async addPurchasedClass(userId: string, attestationId: number) {
    const classNum = Number(attestationId);
    if (!Number.isFinite(classNum) || classNum < 1 || classNum > 11) {
      throw new BadRequestException('Некорректный класс');
    }

    const row = await this.knex('users').where({ id: userId }).first();
    if (!row) {
      throw new BadRequestException('Пользователь не найден');
    }

    let classes: number[] = [];
    const raw = row.purchased_classes;
    if (Array.isArray(raw)) {
      classes = raw.map((n) => Number(n)).filter((n) => Number.isFinite(n));
    } else if (typeof raw === 'string') {
      try {
        const p = JSON.parse(raw);
        if (Array.isArray(p)) classes = p.map((n) => Number(n));
      } catch {
        /* ignore */
      }
    }

    if (classes.includes(classNum)) {
      throw new BadRequestException('Этот класс уже добавлен в ваш аккаунт');
    }

    classes.push(classNum);
    classes.sort((a, b) => a - b);

    await this.knex('users')
      .where({ id: userId })
      .update({
        purchased_classes: this.knex.raw('?::jsonb', [JSON.stringify(classes)]),
      });

    const updated = await this.knex('users').where({ id: userId }).first();
    if (!updated) throw new BadRequestException('Не удалось обновить профиль');
    return { user: toPublicUser(updated) };
  }

  async login(phoneNumberRaw: string, password: string) {
    const phoneNumber = normalizePhone(phoneNumberRaw);
    const row = await this.knex('users').where({ phoneNumber }).first();
    if (!row || !row.password) {
      throw new UnauthorizedException('Неверный телефон или пароль');
    }
    const ok = await bcrypt.compare(password, String(row.password));
    if (!ok) {
      throw new UnauthorizedException('Неверный телефон или пароль');
    }
    return { user: toPublicUser(row) };
  }
}
