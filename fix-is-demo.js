require('dotenv').config();
const { createPgClient, isDemoFromTitle } = require('./lib/test-import-helpers');

async function run() {
  const client = createPgClient();
  await client.connect();

  const { rows } = await client.query('select id, title, is_demo from tests order by id');
  let updated = 0;

  for (const row of rows) {
    const is_demo = isDemoFromTitle(row.title);
    if (row.is_demo !== is_demo) {
      await client.query('update tests set is_demo = $1 where id = $2', [is_demo, row.id]);
      updated += 1;
    }
  }

  const summary = await client.query(
    `select is_demo, count(*)::int as cnt from tests group by is_demo order by is_demo`,
  );

  console.log(JSON.stringify({ total: rows.length, updated, byFlag: summary.rows }, null, 2));
  await client.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
