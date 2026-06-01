require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

/** Вариант 1 — демо */
const variantDemo = [
  {
    question_text: 'Как называют человека, который пишет (сочиняет) музыку?',
    option_a: 'Исполнитель',
    option_b: 'Композитор',
    option_c: 'Слушатель',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Назови «три кита» в музыке, о которых рассказывал композитор Д. Кабалевский.',
    option_a: 'Песня, танец, марш',
    option_b: 'Скрипка, пианино, труба',
    option_c: 'Громко, тихо, быстро',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Как называют человека, который управляет оркестром или хором?',
    option_a: 'Солист',
    option_b: 'Дирижёр',
    option_c: 'Музыкант',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой музыкальный инструмент звучит в сказке «Петя и волк», изображая птичку?',
    option_a: 'Флейта',
    option_b: 'Барабан',
    option_c: 'Дедушка',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Музыкальный инструмент, у которого есть клавиши и педали.',
    option_a: 'Барабан',
    option_b: 'Гитара',
    option_c: 'Пианино (фортепиано)',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text:
      'Как называется большой коллектив музыкантов, играющих на разных инструментах?',
    option_a: 'Хор',
    option_b: 'Оркестр',
    option_c: 'Группа',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какое из этих слов означает «тихо» в музыке?',
    option_a: 'Форте',
    option_b: 'Пиано',
    option_c: 'Темп',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Как называется музыка, под которую удобно шагать?',
    option_a: 'Полька',
    option_b: 'Вальс',
    option_c: 'Марш',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Кто поёт в хоре мальчиков?',
    option_a: 'Только взрослые мужчины',
    option_b: 'Только мальчики',
    option_c: 'Мальчики и девочки',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Как называется торжественная государственная песня страны?',
    option_a: 'Былина',
    option_b: 'Гимн',
    option_c: 'Колыбельная',
    option_d: '',
    correct_answer: 'B',
  },
];

/** Вариант 2 — контрольная */
const variantControl = [
  {
    question_text: 'Как называют человека, который поёт музыку или играет на инструменте?',
    option_a: 'Исполнитель',
    option_b: 'Композитор',
    option_c: 'Писатель',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Какой танец всегда танцуют плавно и по кругу?',
    option_a: 'Марш',
    option_b: 'Вальс',
    option_c: 'Твист',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой русский народный инструмент имеет три струны и треугольную форму?',
    option_a: 'Скрипка',
    option_b: 'Гусли',
    option_c: 'Балалайка',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Как называется перерыв между отделениями концерта или спектакля?',
    option_a: 'Антракт',
    option_b: 'Репетиция',
    option_c: 'Финал',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Скорость исполнения музыки — это...',
    option_a: 'Ритм',
    option_b: 'Темп',
    option_c: 'Тембр',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Назови инструмент, на котором играл былинный герой Садко.',
    option_a: 'Дудочка',
    option_b: 'Гармонь',
    option_c: 'Гусли',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Как называется коллектив людей, которые вместе поют?',
    option_a: 'Оркестр',
    option_b: 'Хор',
    option_c: 'Трио',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Что из этого относится к музыкальным звукам?',
    option_a: 'Стук молотка',
    option_b: 'Пение скрипки',
    option_c: 'Гром во время грозы',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какое из этих слов означает «громко» в музыке?',
    option_a: 'Пиано',
    option_b: 'Мелодия',
    option_c: 'Форте',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Колыбельная песня — это...',
    option_a: 'Веселая песня для танцев',
    option_b: 'Спокойная песня, под которую убаюкивают ребенка',
    option_c: 'Громкая музыка для парада',
    option_d: '',
    correct_answer: 'B',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 8;
  const classNum = 1;

  const demoTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Демотест по музыке',
    isDemo: true,
  });

  const controlTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Контрольная работа по музыке',
    isDemo: false,
  });

  const rDemo = await insertQuestions(client, demoTestId, variantDemo);
  const rControl = await insertQuestions(client, controlTestId, variantControl);

  console.log(
    JSON.stringify(
      {
        subjectId,
        classNum,
        demoTestId,
        controlTestId,
        demo: rDemo,
        control: rControl,
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
