require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

/** Вариант 1 — демо (8 вопросов) */
const variantDemo = [
  {
    question_text: 'Назови три основных цвета, которые нельзя получить при смешивании других.',
    option_a: 'Зелёный, жёлтый, синий',
    option_b: 'Красный, жёлтый, синий',
    option_c: 'Красный, белый, чёрный',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Как называется картина, на которой изображена природа?',
    option_a: 'Натюрморт',
    option_b: 'Портрет',
    option_c: 'Пейзаж',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Что получится, если смешать красную и синюю краску?',
    option_a: 'Зелёный цвет',
    option_b: 'Фиолетовый цвет',
    option_c: 'Оранжевый цвет',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Как называют человека, который рисует картины?',
    option_a: 'Строитель',
    option_b: 'Художник',
    option_c: 'Композитор',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой инструмент не нужен художнику для рисования красками?',
    option_a: 'Кисть',
    option_b: 'Палитра',
    option_c: 'Молоток',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Как называется изображение человека на картине?',
    option_a: 'Пейзаж',
    option_b: 'Портрет',
    option_c: 'Натюрморт',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Для чего нужна палитра?',
    option_a: 'Чтобы на ней рисовать',
    option_b: 'Чтобы смешивать краски',
    option_c: 'Чтобы хранить кисточки',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какое из этих цветов относится к «тёплым»?',
    option_a: 'Синий',
    option_b: 'Голубой',
    option_c: 'Оранжевый',
    option_d: '',
    correct_answer: 'C',
  },
];

/** Вариант 2 — контрольная (8 вопросов) */
const variantControl = [
  {
    question_text: 'Какие цвета получатся, если смешать основные? (составные цвета)',
    option_a: 'Золотой и серебряный',
    option_b: 'Оранжевый, зеленый, фиолетовый',
    option_c: 'Белый и серый',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text:
      'Как называется картина, на которой изображены сорванные цветы, фрукты или овощи?',
    option_a: 'Натюрморт',
    option_b: 'Портрет',
    option_c: 'Пейзаж',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Как называется художник, который рисует животных?',
    option_a: 'Портретист',
    option_b: 'Анималист',
    option_c: 'Пейзажист',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой цвет нужно добавить в красный, чтобы получить розовый?',
    option_a: 'Чёрный',
    option_b: 'Жёлтый',
    option_c: 'Белый',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Как называется краска, которую нужно разводить водой?',
    option_a: 'Пластилин',
    option_b: 'Акварель',
    option_c: 'Фломастер',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какое из этих цветов относится к «холодным»?',
    option_a: 'Жёлтый',
    option_b: 'Красный',
    option_c: 'Синий',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Что такое графика?',
    option_a:
      'Рисунок, выполненный линиями, штрихами, пятнами (часто карандашом)',
    option_b: 'Лепка из глины',
    option_c: 'Строительство зданий',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Какое настроение обычно передают яркие, светлые цвета?',
    option_a: 'Грустное',
    option_b: 'Радостное',
    option_c: 'Сонное',
    option_d: '',
    correct_answer: 'B',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 7;
  const classNum = 1;

  const demoTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Демотест по ИЗО',
    isDemo: true,
  });

  const controlTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Контрольная работа по ИЗО',
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
