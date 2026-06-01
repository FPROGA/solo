require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

/** Вариант 1 */
const variant1 = [
  {
    question_text: 'Какое число является результатом умножения 7 × 8?',
    option_a: '48',
    option_b: '54',
    option_c: '56',
    option_d: '64',
    correct_answer: 'C',
  },
  {
    question_text: 'Укажи правильный порядок действий в выражении:\n40 – 15 : 5 + 3',
    option_a: 'сначала деление, потом вычитание, потом сложение',
    option_b: 'сначала вычитание, потом деление, потом сложение',
    option_c: 'сначала сложение, потом деление, потом вычитание',
    option_d: 'сначала деление, потом сложение, потом вычитание',
    correct_answer: 'A',
  },
  {
    question_text: 'Реши уравнение: х × 6 = 42',
    option_a: 'х = 7',
    option_b: 'х = 8',
    option_c: 'х = 36',
    option_d: 'х = 48',
    correct_answer: 'A',
  },
  {
    question_text: 'Чему равна площадь прямоугольника со сторонами 5 см и 4 см?',
    option_a: '9 см²',
    option_b: '18 см²',
    option_c: '20 см²',
    option_d: '20 см',
    correct_answer: 'C',
  },
  {
    question_text: 'Какая дробь соответствует половине?',
    option_a: '1/3',
    option_b: '1/4',
    option_c: '1/2',
    option_d: '2/2',
    correct_answer: 'C',
  },
  {
    question_text: 'Сколько минут в 3 часах?',
    option_a: '120 минут',
    option_b: '150 минут',
    option_c: '180 минут',
    option_d: '200 минут',
    correct_answer: 'C',
  },
  {
    question_text: 'Найди значение выражения: 54 : 9 × 3',
    option_a: '2',
    option_b: '18',
    option_c: '27',
    option_d: '24',
    correct_answer: 'B',
  },
  {
    question_text:
      'Какое число надо вставить в окошко, чтобы равенство стало верным:\n□ : 8 = 7 (ост. 3)',
    option_a: '56',
    option_b: '59',
    option_c: '53',
    option_d: '60',
    correct_answer: 'B',
  },
  {
    question_text:
      'В магазине было 80 кг яблок. Продали 1/4 часть всех яблок. Сколько килограммов яблок продали?',
    option_a: '20 кг',
    option_b: '40 кг',
    option_c: '60 кг',
    option_d: '10 кг',
    correct_answer: 'A',
  },
  {
    question_text: 'Чему равен периметр квадрата со стороной 6 см?',
    option_a: '12 см',
    option_b: '24 см',
    option_c: '36 см',
    option_d: '24 см²',
    correct_answer: 'B',
  },
];

/** Вариант 2 */
const variant2 = [
  {
    question_text: 'Какое число является результатом умножения 9 × 6?',
    option_a: '54',
    option_b: '56',
    option_c: '63',
    option_d: '48',
    correct_answer: 'A',
  },
  {
    question_text: 'Укажи правильный порядок действий в выражении:\n24 + 18 : 3 – 5',
    option_a: 'сначала сложение, потом деление, потом вычитание',
    option_b: 'сначала деление, потом сложение, потом вычитание',
    option_c: 'сначала вычитание, потом деление, потом сложение',
    option_d: 'сначала деление, потом вычитание, потом сложение',
    correct_answer: 'B',
  },
  {
    question_text: 'Реши уравнение: 48 : х = 8',
    option_a: 'х = 6',
    option_b: 'х = 7',
    option_c: 'х = 8',
    option_d: 'х = 384',
    correct_answer: 'A',
  },
  {
    question_text: 'Чему равна длина стороны квадрата, если его площадь равна 36 см²?',
    option_a: '4 см',
    option_b: '6 см',
    option_c: '9 см',
    option_d: '18 см',
    correct_answer: 'B',
  },
  {
    question_text: 'Какая дробь соответствует трети?',
    option_a: '1/2',
    option_b: '1/3',
    option_c: '1/4',
    option_d: '3/3',
    correct_answer: 'B',
  },
  {
    question_text: 'Сколько секунд в 5 минутах?',
    option_a: '50 секунд',
    option_b: '250 секунд',
    option_c: '300 секунд',
    option_d: '500 секунд',
    correct_answer: 'C',
  },
  {
    question_text: 'Найди значение выражения: 63 : 7 × 4',
    option_a: '9',
    option_b: '28',
    option_c: '36',
    option_d: '32',
    correct_answer: 'C',
  },
  {
    question_text:
      'Какое число надо вставить в окошко, чтобы равенство стало верным:\n45 : □ = 6 (ост. 3)',
    option_a: '6',
    option_b: '7',
    option_c: '8',
    option_d: '9',
    correct_answer: 'B',
  },
  {
    question_text:
      'В классе 24 ученика. 3/4 всех учеников занимаются в спортивных секциях. Сколько учеников занимается в секциях?',
    option_a: '6',
    option_b: '8',
    option_c: '18',
    option_d: '16',
    correct_answer: 'C',
  },
  {
    question_text: 'Чему равен периметр прямоугольника со сторонами 5 см и 3 см?',
    option_a: '8 см',
    option_b: '15 см',
    option_c: '16 см',
    option_d: '16 см²',
    correct_answer: 'C',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 4;
  const classNum = 3;

  const test1Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по математике. 3 класс «Школа России» (вариант 1)',
    isDemo: true,
  });

  const test2Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по математике. 3 класс «Школа России» (вариант 2)',
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
