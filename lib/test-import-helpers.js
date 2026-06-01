function isDemoFromTitle(title) {
  return /демо/i.test(title);
}

async function ensureTest(client, { subjectId, classNum, title, isDemo }) {
  const is_demo = isDemo !== undefined ? isDemo : isDemoFromTitle(title);

  const existing = await client.query(
    'select id from tests where subject_id = $1 and class = $2 and title = $3 limit 1',
    [subjectId, classNum, title],
  );

  if (existing.rows.length > 0) {
    await client.query('update tests set is_demo = $1 where id = $2', [
      is_demo,
      existing.rows[0].id,
    ]);
    return existing.rows[0].id;
  }

  const inserted = await client.query(
    'insert into tests(subject_id, class, title, is_demo) values ($1, $2, $3, $4) returning id',
    [subjectId, classNum, title, is_demo],
  );
  return inserted.rows[0].id;
}

async function insertQuestions(client, testId, questions) {
  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    const exists = await client.query(
      'select id from questions where test_id = $1 and question_text = $2 limit 1',
      [testId, q.question_text],
    );

    if (exists.rows.length > 0) {
      skipped += 1;
      continue;
    }

    await client.query(
      `insert into questions
      (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer)
      values ($1, $2, $3, $4, $5, $6, $7)`,
      [
        testId,
        q.question_text,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d || '',
        q.correct_answer,
      ],
    );
    inserted += 1;
  }

  return { inserted, skipped };
}

function createPgClient() {
  const { Client } = require('pg');
  return new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
}

module.exports = {
  ensureTest,
  insertQuestions,
  createPgClient,
  isDemoFromTitle,
};
