/*exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('child_name').notNullable();
    table.string('child_surname').notNullable();
    table.string('parent_name').notNullable();
    table.string('phoneNumber').notNullable().unique();
    table.string('email').notNullable();
    table.number('class', { array: true }).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
*/
