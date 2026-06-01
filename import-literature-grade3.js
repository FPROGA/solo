require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

/** Вариант 1 */
const variant1 = [
  {
    question_text: 'Какой жанр литературы относится к устному народному творчеству?',
    option_a: 'рассказ',
    option_b: 'повесть',
    option_c: 'сказка',
    option_d: 'стихотворение',
    correct_answer: 'C',
  },
  {
    question_text: 'Кто написал стихотворение «Зимнее утро»?',
    option_a: 'Ф.И. Тютчев',
    option_b: 'А.С. Пушкин',
    option_c: 'С.А. Есенин',
    option_d: 'И.А. Крылов',
    correct_answer: 'B',
  },
  {
    question_text: 'Какая пословица о труде?',
    option_a: 'Семь раз отмерь, один раз отрежь',
    option_b: 'Без труда не выловишь и рыбку из пруда',
    option_c: 'Волков бояться — в лес не ходить',
    option_d: 'Делу время, потехе час',
    correct_answer: 'B',
  },
  {
    question_text: 'Из какой сказки эти слова: «Тепло ли тебе, девица? Тепло ли тебе, красная?»',
    option_a: '«Царевна-лягушка»',
    option_b: '«Мороз Иванович»',
    option_c: '«Снегурочка»',
    option_d: '«По щучьему веленью»',
    correct_answer: 'B',
  },
  {
    question_text: 'Кто является автором басни «Стрекоза и Муравей»?',
    option_a: 'Л.Н. Толстой',
    option_b: 'И.А. Крылов',
    option_c: 'А.С. Пушкин',
    option_d: 'С.В. Михалков',
    correct_answer: 'B',
  },
  {
    question_text: 'Какое из этих произведений написал Л.Н. Толстой?',
    option_a: '«Филипок»',
    option_b: '«Ворона и Лисица»',
    option_c: '«Белая берёза»',
    option_d: '«Кот в сапогах»',
    correct_answer: 'A',
  },
  {
    question_text: 'Какая главная мысль сказки «Сестрица Алёнушка и братец Иванушка»?',
    option_a: 'Нельзя пить из незнакомого источника',
    option_b: 'Надо слушаться старших',
    option_c: 'Добро побеждает зло',
    option_d: 'Не хвастайся',
    correct_answer: 'B',
  },
  {
    question_text:
      'Определи жанр произведения: «Жили-были старик со старухой. Была у них курочка Ряба».',
    option_a: 'рассказ',
    option_b: 'былина',
    option_c: 'сказка',
    option_d: 'загадка',
    correct_answer: 'C',
  },
  {
    question_text: 'Какое стихотворение написал С.А. Есенин?',
    option_a: '«Осень»',
    option_b: '«Уж небо осенью дышало»',
    option_c: '«Белая берёза»',
    option_d: '«Вот север, тучи нагоняя…»',
    correct_answer: 'C',
  },
  {
    question_text: 'Отгадай загадку: «Кто зимой холодной бродит злой, голодный?»',
    option_a: 'заяц',
    option_b: 'медведь',
    option_c: 'волк',
    option_d: 'лиса',
    correct_answer: 'C',
  },
];

/** Вариант 2 */
const variant2 = [
  {
    question_text: 'Что такое былина?',
    option_a: 'короткий рассказ о животных',
    option_b: 'народная песня-сказание о богатырях',
    option_c: 'стихотворение о природе',
    option_d: 'поучительный короткий рассказ',
    correct_answer: 'B',
  },
  {
    question_text: 'Кто написал рассказ «Ребята и утята»?',
    option_a: 'В.В. Бианки',
    option_b: 'М.М. Пришвин',
    option_c: 'К.Г. Паустовский',
    option_d: 'Н.Н. Носов',
    correct_answer: 'B',
  },
  {
    question_text: 'Отгадай загадку: «В воде купался, а сухим остался».',
    option_a: 'лёд',
    option_b: 'песок',
    option_c: 'гусь',
    option_d: 'рыба',
    correct_answer: 'C',
  },
  {
    question_text: 'Из какой сказки эти слова: «Не садись на пенёк, не ешь пирожок»?',
    option_a: '«Гуси-лебеди»',
    option_b: '«Маша и медведь»',
    option_c: '«Колобок»',
    option_d: '«Теремок»',
    correct_answer: 'B',
  },
  {
    question_text: 'Чем прославился И.А. Крылов?',
    option_a: 'писал сказки',
    option_b: 'писал стихи о природе',
    option_c: 'писал басни',
    option_d: 'писал рассказы о детях',
    correct_answer: 'C',
  },
  {
    question_text: 'Какое из этих произведений написал Н.Н. Носов?',
    option_a: '«Фантазёры»',
    option_b: '«Ежовый сарафан»',
    option_c: '«Стальное колечко»',
    option_d: '«Про обезьянку»',
    correct_answer: 'A',
  },
  {
    question_text: 'Чему учит сказка «Лиса и Журавль»?',
    option_a: 'быть добрым',
    option_b: 'быть честным',
    option_c: 'не обижать слабых',
    option_d: 'как аукнется, так и откликнется',
    correct_answer: 'D',
  },
  {
    question_text: 'Определи жанр произведения: «Илья Муромец победил Соловья-разбойника».',
    option_a: 'сказка',
    option_b: 'былина',
    option_c: 'басня',
    option_d: 'рассказ',
    correct_answer: 'B',
  },
  {
    question_text: 'Какое стихотворение написал Ф.И. Тютчев?',
    option_a: '«Весенняя гроза»',
    option_b: '«Черёмуха»',
    option_c: '«Зима недаром злится»',
    option_d: '«Бабушкины сказки»',
    correct_answer: 'A',
  },
  {
    question_text: 'Отгадай загадку: «Не лает, не кусает, а в дом не пускает».',
    option_a: 'собака',
    option_b: 'замок',
    option_c: 'сторож',
    option_d: 'мороз',
    correct_answer: 'B',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 2;
  const classNum = 3;

  const test1Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по литературному чтению. 3 класс «Школа России» (вариант 1)',
    isDemo: true,
  });

  const test2Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по литературному чтению. 3 класс «Школа России» (вариант 2)',
    isDemo: false,
  });

  const r1 = await insertQuestions(client, test1Id, variant1);
  const r2 = await insertQuestions(client, test2Id, variant2);

  console.log(
    JSON.stringify(
      {
        subjectId,
        classNum,
        test1Id,
        test2Id,
        variant1: r1,
        variant2: r2,
      },
      null,
      2,
    ),
  );

  await client.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
