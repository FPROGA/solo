require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

const variantDemo = [
  {
    question_text: 'Укажи число, в котором 1 десяток и 5 единиц.',
    option_a: '1',
    option_b: '5',
    option_c: '15',
    option_d: '51',
    correct_answer: 'C',
  },
  {
    question_text: 'Укажи разность чисел 13 и 3.',
    option_a: '16',
    option_b: '10',
    option_c: '3',
    option_d: '1',
    correct_answer: 'B',
  },
  {
    question_text: 'Укажи сумму чисел 9 и 8.',
    option_a: '17',
    option_b: '18',
    option_c: '15',
    option_d: '16',
    correct_answer: 'A',
  },
  {
    question_text: 'Выбери числовое выражение, значение которого равно 9.',
    option_a: '10 - 2',
    option_b: '4 + 4',
    option_c: '15 - 6',
    option_d: '7 + 3',
    correct_answer: 'C',
  },
  {
    question_text: 'Укажи верную запись чисел в порядке убывания (от большего к меньшему).',
    option_a: '1, 5, 9, 10',
    option_b: '10, 9, 5, 1',
    option_c: '9, 10, 1, 5',
    option_d: '10, 1, 5, 9',
    correct_answer: 'B',
  },
  {
    question_text: 'Укажи правильный ответ: 17 - 7 + 1 = ...',
    option_a: '9',
    option_b: '10',
    option_c: '11',
    option_d: '12',
    correct_answer: 'C',
  },
  {
    question_text: 'Какая фигура лишняя?',
    option_a: 'Круг',
    option_b: 'Треугольник',
    option_c: 'Квадрат',
    option_d: 'Прямоугольник',
    correct_answer: 'A',
  },
  {
    question_text: 'Укажи правильный ответ: 5 + 5 + 4 = ...',
    option_a: '10',
    option_b: '12',
    option_c: '14',
    option_d: '15',
    correct_answer: 'C',
  },
  {
    question_text:
      'В коробке было 10 карандашей. 2 карандаша сломались. Сколько целых карандашей осталось?',
    option_a: '12',
    option_b: '8',
    option_c: '9',
    option_d: '7',
    correct_answer: 'B',
  },
  {
    question_text: 'Укажи число, которое больше 11, но меньше 13.',
    option_a: '10',
    option_b: '12',
    option_c: '14',
    option_d: '15',
    correct_answer: 'B',
  },
];

const variantRegular = [
  {
    question_text: 'Как цифрами записывается число «четырнадцать»?',
    option_a: '41',
    option_b: '10',
    option_c: '14',
    option_d: '4',
    correct_answer: 'C',
  },
  {
    question_text: 'Укажи правильный результат выражения: 15 - 5 + 4 =',
    option_a: '6',
    option_b: '14',
    option_c: '10',
    option_d: '15',
    correct_answer: 'B',
  },
  {
    question_text: 'Какое число нужно вставить, чтобы равенство стало верным: ___ + 7 = 10',
    option_a: '2',
    option_b: '4',
    option_c: '3',
    option_d: '5',
    correct_answer: 'C',
  },
  {
    question_text: 'Выбери верную запись: 1 дм 2 см — это...',
    option_a: '10 см',
    option_b: '21 см',
    option_c: '12 см',
    option_d: '3 см',
    correct_answer: 'C',
  },
  {
    question_text: 'Какое число стоит между 11 и 13?',
    option_a: '10',
    option_b: '14',
    option_c: '12',
    option_d: '15',
    correct_answer: 'C',
  },
  {
    question_text: 'Укажи правильный знак для сравнения: 8 + 6 … 9 + 7',
    option_a: '>',
    option_b: '<',
    option_c: '=',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text:
      'У Димы было 10 машинок, а роботов на 3 меньше. Сколько роботов было у Димы?',
    option_a: '13',
    option_b: '7',
    option_c: '8',
    option_d: '6',
    correct_answer: 'B',
  },
  {
    question_text:
      'Укажи группу чисел, записанных в порядке возрастания (от меньшего к большему).',
    option_a: '20, 15, 10, 5',
    option_b: '2, 5, 9, 13, 17',
    option_c: '10, 1, 5, 9',
    option_d: '13, 16, 19, 2',
    correct_answer: 'B',
  },
  {
    question_text: 'Какое из этих чисел является самым большим?',
    option_a: '19',
    option_b: '20',
    option_c: '11',
    option_d: '9',
    correct_answer: 'B',
  },
  {
    question_text:
      'В вазе лежало 7 яблок и 3 груши. Сколько всего фруктов было в вазе?',
    option_a: '4',
    option_b: '11',
    option_c: '10',
    option_d: '9',
    correct_answer: 'C',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 4;
  const classNum = 1;

  const demoTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Демотест по математике',
    isDemo: true,
  });

  const testId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по математике',
    isDemo: false,
  });

  const rDemo = await insertQuestions(client, demoTestId, variantDemo);
  const rRegular = await insertQuestions(client, testId, variantRegular);

  console.log(
    JSON.stringify(
      {
        subjectId,
        classNum,
        demoTestId,
        testId,
        demo: rDemo,
        regular: rRegular,
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
