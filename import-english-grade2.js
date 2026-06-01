require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 3;
  const classNum = 2;

  const test1Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по английскому языку',
    isDemo: false,
  });

  const test2Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Демотест по английскому языку',
    isDemo: true,
  });

  const variant1 = [
    {
      question_text: 'Выбери правильный перевод слова "Hello":',
      option_a: 'Пока',
      option_b: 'Привет',
      option_c: 'Спасибо',
      option_d: '',
      correct_answer: 'B',
    },
    {
      question_text: 'Какая буква стоит в алфавите после буквы "B"?',
      option_a: 'A',
      option_b: 'D',
      option_c: 'C',
      option_d: '',
      correct_answer: 'C',
    },
    {
      question_text: 'Как по-английски будет число "5"?',
      option_a: 'Four',
      option_b: 'Five',
      option_c: 'Six',
      option_d: '',
      correct_answer: 'B',
    },
    {
      question_text: 'Выбери перевод слова "Green":',
      option_a: 'Синий',
      option_b: 'Зелёный',
      option_c: 'Красный',
      option_d: '',
      correct_answer: 'B',
    },
    {
      question_text: 'Какое слово лишнее? (найди лишнее животное):',
      option_a: 'Cat (кошка)',
      option_b: 'Dog (собака)',
      option_c: 'Apple (яблоко)',
      option_d: '',
      correct_answer: 'C',
    },
    {
      question_text: 'Как переводится фраза "My name is...":',
      option_a: 'Меня зовут...',
      option_b: 'Я живу в...',
      option_c: 'Мне нравится...',
      option_d: '',
      correct_answer: 'A',
    },
    {
      question_text: 'Выбери название цвета "Синий":',
      option_a: 'Red',
      option_b: 'Blue',
      option_c: 'Yellow',
      option_d: '',
      correct_answer: 'B',
    },
    {
      question_text: 'Найди слово, которое начинается на букву "F":',
      option_a: 'Frog (лягушка)',
      option_b: 'Ant (муравей)',
      option_c: 'Ball (мяч)',
      option_d: '',
      correct_answer: 'A',
    },
    {
      question_text: 'Как сказать по-английски "Мама"?',
      option_a: 'Father',
      option_b: 'Mother',
      option_c: 'Brother',
      option_d: '',
      correct_answer: 'B',
    },
    {
      question_text: 'Выбери правильный ответ на вопрос "How are you?":',
      option_a: 'I am fine.',
      option_b: 'I am seven.',
      option_c: 'Goodbye.',
      option_d: '',
      correct_answer: 'A',
    },
  ];

  const variant2 = [
    {
      question_text: 'Как попрощаться по-английски?',
      option_a: 'Hello',
      option_b: 'Hi',
      option_c: 'Goodbye',
      option_d: '',
      correct_answer: 'C',
    },
    {
      question_text: 'На какую букву начинается слово "Apple"?',
      option_a: 'B',
      option_b: 'A',
      option_c: 'C',
      option_d: '',
      correct_answer: 'B',
    },
    {
      question_text: 'Сколько будет "Two" + "Three"?',
      option_a: 'Four',
      option_b: 'Five',
      option_c: 'One',
      option_d: '',
      correct_answer: 'B',
    },
    {
      question_text: 'Выбери перевод слова "Red":',
      option_a: 'Жёлтый',
      option_b: 'Красный',
      option_c: 'Чёрный',
      option_d: '',
      correct_answer: 'B',
    },
    {
      question_text: 'Найди слово, означающее "Собака":',
      option_a: 'Pig',
      option_b: 'Dog',
      option_c: 'Duck',
      option_d: '',
      correct_answer: 'B',
    },
    {
      question_text: 'Как сказать "Я вижу кошку"?',
      option_a: 'I see a cat',
      option_b: 'I like a cat',
      option_c: 'It is a cat',
      option_d: '',
      correct_answer: 'A',
    },
    {
      question_text: 'Какое слово означает "Семья"?',
      option_a: 'Friends',
      option_b: 'School',
      option_c: 'Family',
      option_d: '',
      correct_answer: 'C',
    },
    {
      question_text: 'Выбери перевод слова "Yellow":',
      option_a: 'Белый',
      option_b: 'Жёлтый',
      option_c: 'Оранжевый',
      option_d: '',
      correct_answer: 'B',
    },
    {
      question_text: 'Найди "лишнее" слово в группе "Цвета":',
      option_a: 'Blue',
      option_b: 'One',
      option_c: 'Pink',
      option_d: '',
      correct_answer: 'B',
    },
    {
      question_text: 'Как переводится вопрос "How old are you?":',
      option_a: 'Как тебя зовут?',
      option_b: 'Сколько тебе лет?',
      option_c: 'Откуда ты?',
      option_d: '',
      correct_answer: 'B',
    },
  ];

  const result1 = await insertQuestions(client, test1Id, variant1);
  const result2 = await insertQuestions(client, test2Id, variant2);

  const totals = await client.query(
    `select test_id, count(*)::int as cnt
     from questions
     where test_id in ($1, $2)
     group by test_id
     order by test_id`,
    [test1Id, test2Id],
  );

  console.log(
    JSON.stringify(
      {
        test1Id,
        test2Id,
        variant1: result1,
        variant2: result2,
        totals: totals.rows,
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
