require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');
const subjects = require('./data/grade4');

const CLASS_NUM = 4;

async function run() {
  const client = createPgClient();
  await client.connect();
  const summary = [];

  for (const sub of subjects) {
    const variantResults = [];

    for (let i = 0; i < sub.variants.length; i++) {
      const variant = sub.variants[i];
      const variantNum = i + 1;
      const isDemo = variant.isDemo ?? variantNum === 1;
      const title = `Тест по ${sub.subjectLabel}. 4 класс «${sub.topic}» (вариант ${variantNum})`;

      const testId = await ensureTest(client, {
        subjectId: sub.subjectId,
        classNum: CLASS_NUM,
        title,
        isDemo,
      });

      const stats = await insertQuestions(client, testId, variant.questions);
      variantResults.push({ variant: variantNum, isDemo, testId, title, ...stats });
    }

    summary.push({
      subjectId: sub.subjectId,
      subjectLabel: sub.subjectLabel,
      topic: sub.topic,
      variants: variantResults,
    });
  }

  console.log(JSON.stringify({ classNum: CLASS_NUM, subjects: summary }, null, 2));
  await client.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
