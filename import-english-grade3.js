require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

const variant1 = [
  {
    question_text: 'Вставь правильную форму глагола to be:\nI ___ a student.',
    option_a: 'am',
    option_b: 'is',
    option_c: 'are',
    option_d: 'be',
    correct_answer: 'A',
  },
  {
    question_text: 'Вставь правильную форму глагола to be:\nMy sister ___ kind.',
    option_a: 'am',
    option_b: 'is',
    option_c: 'are',
    option_d: 'be',
    correct_answer: 'B',
  },
  {
    question_text: 'Выбери правильное притяжательное местоимение:\nThis is ___ book. (моя)',
    option_a: 'your',
    option_b: 'his',
    option_c: 'her',
    option_d: 'my',
    correct_answer: 'D',
  },
  {
    question_text: 'Образуй множественное число слова: cat',
    option_a: 'cat',
    option_b: 'cats',
    option_c: 'cates',
    option_d: 'caties',
    correct_answer: 'B',
  },
  {
    question_text: 'Выбери правильный перевод: яблоко',
    option_a: 'apple',
    option_b: 'orange',
    option_c: 'banana',
    option_d: 'lemon',
    correct_answer: 'A',
  },
  {
    question_text: 'Какой цвет переводится как «жёлтый»?',
    option_a: 'red',
    option_b: 'blue',
    option_c: 'yellow',
    option_d: 'green',
    correct_answer: 'C',
  },
  {
    question_text: 'Выбери правильное слово для животного: корова',
    option_a: 'cow',
    option_b: 'horse',
    option_c: 'pig',
    option_d: 'sheep',
    correct_answer: 'A',
  },
  {
    question_text: 'Вставь правильную форму глагола:\nShe ___ to school every day.',
    option_a: 'go',
    option_b: 'goes',
    option_c: 'going',
    option_d: 'went',
    correct_answer: 'B',
  },
  {
    question_text: 'Выбери правильный перевод: моя семья',
    option_a: 'my house',
    option_b: 'my friend',
    option_c: 'my family',
    option_d: 'my mother',
    correct_answer: 'C',
  },
  {
    question_text: 'Составь правильное предложение:\nlike / I / apples',
    option_a: 'I like apples',
    option_b: 'Like I apples',
    option_c: 'Apples I like',
    option_d: 'I apples like',
    correct_answer: 'A',
  },
];

const variant2 = [
  {
    question_text: 'Вставь правильную форму глагола to be:\nThey ___ happy.',
    option_a: 'am',
    option_b: 'is',
    option_c: 'are',
    option_d: 'be',
    correct_answer: 'C',
  },
  {
    question_text: 'Вставь правильную форму глагола to be:\nHe ___ a doctor.',
    option_a: 'am',
    option_b: 'is',
    option_c: 'are',
    option_d: 'be',
    correct_answer: 'B',
  },
  {
    question_text: 'Выбери правильное притяжательное местоимение:\nThis is ___ pen. (его)',
    option_a: 'my',
    option_b: 'your',
    option_c: 'her',
    option_d: 'his',
    correct_answer: 'D',
  },
  {
    question_text: 'Образуй множественное число слова: dog',
    option_a: 'dog',
    option_b: 'doges',
    option_c: 'dogs',
    option_d: 'dogies',
    correct_answer: 'C',
  },
  {
    question_text: 'Выбери правильный перевод: банан',
    option_a: 'apple',
    option_b: 'orange',
    option_c: 'banana',
    option_d: 'grape',
    correct_answer: 'C',
  },
  {
    question_text: 'Какой цвет переводится как «синий»?',
    option_a: 'red',
    option_b: 'blue',
    option_c: 'green',
    option_d: 'black',
    correct_answer: 'B',
  },
  {
    question_text: 'Выбери правильное слово для животного: лошадь',
    option_a: 'cow',
    option_b: 'horse',
    option_c: 'pig',
    option_d: 'chicken',
    correct_answer: 'B',
  },
  {
    question_text: 'Вставь правильную форму глагола:\nHe ___ football on Sundays.',
    option_a: 'play',
    option_b: 'plays',
    option_c: 'playing',
    option_d: 'played',
    correct_answer: 'B',
  },
  {
    question_text: 'Выбери правильный перевод: мой друг',
    option_a: 'my sister',
    option_b: 'my brother',
    option_c: 'my friend',
    option_d: 'my mother',
    correct_answer: 'C',
  },
  {
    question_text: 'Составь правильное предложение:\nplays / She / tennis',
    option_a: 'She tennis plays',
    option_b: 'Plays she tennis',
    option_c: 'Tennis she plays',
    option_d: 'She plays tennis',
    correct_answer: 'D',
  },
];

const variant3 = [
  {
    question_text: 'Вставь правильную форму глагола to be:\nWe ___ friends.',
    option_a: 'am',
    option_b: 'is',
    option_c: 'are',
    option_d: 'be',
    correct_answer: 'C',
  },
  {
    question_text: 'Вставь правильную форму глагола to be:\nMy parents ___ at home.',
    option_a: 'am',
    option_b: 'is',
    option_c: 'are',
    option_d: 'be',
    correct_answer: 'C',
  },
  {
    question_text: 'Выбери правильное притяжательное местоимение:\nThis is ___ toy. (её)',
    option_a: 'my',
    option_b: 'your',
    option_c: 'her',
    option_d: 'his',
    correct_answer: 'C',
  },
  {
    question_text: 'Образуй множественное число слова: fox',
    option_a: 'fox',
    option_b: 'foxes',
    option_c: 'foxs',
    option_d: 'foxies',
    correct_answer: 'B',
  },
  {
    question_text: 'Выбери правильный перевод: апельсин',
    option_a: 'apple',
    option_b: 'orange',
    option_c: 'banana',
    option_d: 'lemon',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой цвет переводится как «красный»?',
    option_a: 'red',
    option_b: 'blue',
    option_c: 'yellow',
    option_d: 'white',
    correct_answer: 'A',
  },
  {
    question_text: 'Выбери правильное слово для животного: свинья',
    option_a: 'cow',
    option_b: 'horse',
    option_c: 'pig',
    option_d: 'duck',
    correct_answer: 'C',
  },
  {
    question_text: 'Вставь правильную форму глагола:\nI ___ milk every morning.',
    option_a: 'drink',
    option_b: 'drinks',
    option_c: 'drinking',
    option_d: 'drank',
    correct_answer: 'A',
  },
  {
    question_text: 'Выбери правильный перевод: моя мама',
    option_a: 'my father',
    option_b: 'my mother',
    option_c: 'my sister',
    option_d: 'my brother',
    correct_answer: 'B',
  },
  {
    question_text: 'Составь правильное предложение:\nread / They / books',
    option_a: 'They read books',
    option_b: 'Read they books',
    option_c: 'Books they read',
    option_d: 'They books read',
    correct_answer: 'A',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 3;
  const classNum = 3;

  const demoTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по английскому языку. 3 класс (вариант 1)',
    isDemo: true,
  });

  const control2Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по английскому языку. 3 класс (вариант 2)',
    isDemo: false,
  });

  const control3Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по английскому языку. 3 класс (вариант 3)',
    isDemo: false,
  });

  const r1 = await insertQuestions(client, demoTestId, variant1);
  const r2 = await insertQuestions(client, control2Id, variant2);
  const r3 = await insertQuestions(client, control3Id, variant3);

  console.log(
    JSON.stringify(
      {
        subjectId,
        classNum,
        demoTestId,
        control2Id,
        control3Id,
        variant1: r1,
        variant2: r2,
        variant3: r3,
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
