require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

/** Вариант 1 — демо */
const variantDemo = [
  {
    question_text: 'Из чего получают бумагу?',
    option_a: 'Из камня',
    option_b: 'Из дерева',
    option_c: 'Из песка',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Как правильно передавать ножницы другому человеку?',
    option_a: 'Лезвиями вперёд',
    option_b: 'Кольцами вперёд',
    option_c: 'Просто бросить',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text:
      'Как называется искусство складывания фигурок из бумаги без клея и ножниц?',
    option_a: 'Аппликация',
    option_b: 'Лепка',
    option_c: 'Оригами',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Какой материал становится мягким от тепла рук?',
    option_a: 'Картон',
    option_b: 'Пластилин',
    option_c: 'Клей',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Что такое «аппликация»?',
    option_a: 'Наклеивание деталей на основу',
    option_b: 'Складывание бумаги гармошкой',
    option_c: 'Рисование карандашом',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Для чего нужен шаблон в работе?',
    option_a: 'Чтобы резать бумагу',
    option_b: 'Чтобы обводить и получать одинаковые детали',
    option_c: 'Чтобы склеивать части',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какие материалы дарит нам природа для поделок?',
    option_a: 'Пластилин и клей',
    option_b: 'Шишки, листья, желуди',
    option_c: 'Бумагу и картон',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Где должны лежать ножницы во время работы?',
    option_a: 'В кармане',
    option_b: 'На краю стола в открытом виде',
    option_c: 'Справа с сомкнутыми лезвиями',
    option_d: '',
    correct_answer: 'C',
  },
];

/** Вариант 2 — контрольная */
const variantControl = [
  {
    question_text: 'Какой инструмент используется для разметки деталей на бумаге?',
    option_a: 'Ластик',
    option_b: 'Карандаш и линейка',
    option_c: 'Клей-карандаш',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Как правильно резать бумагу ножницами?',
    option_a: 'Серединой лезвий, широко раскрывая их',
    option_b: 'Кончиками ножниц',
    option_c: 'Рвать руками',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Какой материал лишний при работе с пластилином?',
    option_a: 'Стека (ножичек)',
    option_b: 'Подкладная доска',
    option_c: 'Иголка',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Что такое «развёртка»?',
    option_a: 'Плоская заготовка, из которой получится объемная фигура',
    option_b: 'Кусочек пластилина',
    option_c: 'Обрезки бумаги',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Как нужно наносить клей на деталь?',
    option_a: 'На середину жирным пятном',
    option_b: 'Равномерно от середины к краям',
    option_c: 'На пальцы, а потом на бумагу',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Для чего нужна подкладная доска при лепке?',
    option_a: 'Чтобы не испачкать стол',
    option_b: 'Чтобы на ней сидеть',
    option_c: 'Чтобы резать бумагу',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'В какую сторону должны смотреть лезвия ножниц, когда они лежат на столе?',
    option_a: 'На соседа',
    option_b: 'От себя',
    option_c: 'Вверх',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Из чего сделан пластилин?',
    option_a: 'Из теста и воды',
    option_b: 'Из глины, воска и красок',
    option_c: 'Из песка и клея',
    option_d: '',
    correct_answer: 'B',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 9;
  const classNum = 1;

  const demoTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Демотест по технологии',
    isDemo: true,
  });

  const controlTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Контрольная работа по технологии',
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
