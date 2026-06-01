require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

const variant1 = [
  {
    question_text:
      'Как называется жанр изобразительного искусства, в котором изображают природу?',
    option_a: 'портрет',
    option_b: 'натюрморт',
    option_c: 'пейзаж',
    option_d: 'батальный жанр',
    correct_answer: 'C',
  },
  {
    question_text:
      'Какие цвета называются основными (их нельзя получить смешиванием других цветов)?',
    option_a: 'красный, жёлтый, синий',
    option_b: 'зелёный, оранжевый, фиолетовый',
    option_c: 'белый, чёрный, серый',
    option_d: 'розовый, голубой, коричневый',
    correct_answer: 'A',
  },
  {
    question_text: 'Какой русский народный промысел узнают по белому фону и синим узорам?',
    option_a: 'Хохлома',
    option_b: 'Гжель',
    option_c: 'Дымковская игрушка',
    option_d: 'Жостово',
    correct_answer: 'B',
  },
  {
    question_text: 'Что такое живопись?',
    option_a: 'рисование карандашом',
    option_b: 'создание изображений с помощью красок',
    option_c: 'вырезание из бумаги',
    option_d: 'лепка из глины',
    correct_answer: 'B',
  },
  {
    question_text: 'Какие цвета называются холодными?',
    option_a: 'красный, оранжевый, жёлтый',
    option_b: 'синий, голубой, фиолетовый',
    option_c: 'зелёный, коричневый, серый',
    option_d: 'чёрный, белый, розовый',
    correct_answer: 'B',
  },
  {
    question_text: 'Как называется изображение одного человека или группы людей?',
    option_a: 'пейзаж',
    option_b: 'натюрморт',
    option_c: 'портрет',
    option_d: 'анималистический жанр',
    correct_answer: 'C',
  },
  {
    question_text: 'Какой материал использует художник для рисования пастелью?',
    option_a: 'масляные краски',
    option_b: 'акварель',
    option_c: 'сухие мягкие цветные мелки',
    option_d: 'тушь и перо',
    correct_answer: 'C',
  },
  {
    question_text: 'Что изображают в натюрморте?',
    option_a: 'природу',
    option_b: 'человека',
    option_c: 'неживые предметы (фрукты, вазы, цветы)',
    option_d: 'животных',
    correct_answer: 'C',
  },
  {
    question_text:
      'Как называется вид искусства, в котором создают объёмные фигуры из глины, камня или металла?',
    option_a: 'живопись',
    option_b: 'графика',
    option_c: 'архитектура',
    option_d: 'скульптура',
    correct_answer: 'D',
  },
  {
    question_text: 'Какой цвет получится при смешивании красной и жёлтой красок?',
    option_a: 'синий',
    option_b: 'зелёный',
    option_c: 'оранжевый',
    option_d: 'фиолетовый',
    correct_answer: 'C',
  },
];

const variant2 = [
  {
    question_text: 'Как называется жанр, в котором изображают животных?',
    option_a: 'портрет',
    option_b: 'пейзаж',
    option_c: 'натюрморт',
    option_d: 'анималистический жанр',
    correct_answer: 'D',
  },
  {
    question_text: 'Какие цвета называются составными (их получают смешиванием основных)?',
    option_a: 'красный, жёлтый, синий',
    option_b: 'зелёный, оранжевый, фиолетовый',
    option_c: 'белый, чёрный, серый',
    option_d: 'розовый, голубой, коричневый',
    correct_answer: 'B',
  },
  {
    question_text:
      'Какой русский народный промысел узнают по золотистым узорам на чёрном или красном фоне?',
    option_a: 'Гжель',
    option_b: 'Хохлома',
    option_c: 'Дымковская игрушка',
    option_d: 'Палех',
    correct_answer: 'B',
  },
  {
    question_text: 'Что такое графика?',
    option_a: 'рисование красками',
    option_b: 'рисование карандашом, углём, тушью',
    option_c: 'лепка из пластилина',
    option_d: 'создание узоров на ткани',
    correct_answer: 'B',
  },
  {
    question_text: 'Какие цвета называются тёплыми?',
    option_a: 'красный, оранжевый, жёлтый',
    option_b: 'синий, голубой, фиолетовый',
    option_c: 'чёрный, белый, серый',
    option_d: 'зелёный, коричневый, розовый',
    correct_answer: 'A',
  },
  {
    question_text: 'Как называется художник, который рисует животных?',
    option_a: 'портретист',
    option_b: 'пейзажист',
    option_c: 'анималист',
    option_d: 'маринист',
    correct_answer: 'C',
  },
  {
    question_text: 'Какой инструмент нужен для рисования акварелью?',
    option_a: 'кисть',
    option_b: 'мел',
    option_c: 'уголь',
    option_d: 'пастель',
    correct_answer: 'A',
  },
  {
    question_text: 'Какого цвета не существует в природе (его нельзя увидеть в радуге)?',
    option_a: 'красный',
    option_b: 'синий',
    option_c: 'коричневый',
    option_d: 'жёлтый',
    correct_answer: 'C',
  },
  {
    question_text: 'Что такое архитектура?',
    option_a: 'искусство строить здания',
    option_b: 'искусство лепить из глины',
    option_c: 'искусство вырезать из дерева',
    option_d: 'искусство рисовать на стенах',
    correct_answer: 'A',
  },
  {
    question_text: 'Какой цвет получится при смешивании синего и красного?',
    option_a: 'оранжевый',
    option_b: 'зелёный',
    option_c: 'фиолетовый',
    option_d: 'жёлтый',
    correct_answer: 'C',
  },
];

const variant3 = [
  {
    question_text: 'Как называется жанр, в котором изображают море?',
    option_a: 'портрет',
    option_b: 'пейзаж',
    option_c: 'натюрморт',
    option_d: 'марина',
    correct_answer: 'D',
  },
  {
    question_text: 'Какие цвета являются ахроматическими (бесцветными)?',
    option_a: 'красный, жёлтый, синий',
    option_b: 'зелёный, оранжевый, фиолетовый',
    option_c: 'белый, чёрный, серый',
    option_d: 'голубой, розовый, коричневый',
    correct_answer: 'C',
  },
  {
    question_text:
      'Какую игрушку лепят из глины и расписывают яркими узорами (часто изображают барыню, коня, индюка)?',
    option_a: 'Гжель',
    option_b: 'Хохлома',
    option_c: 'Дымковская игрушка',
    option_d: 'Филимоновская игрушка',
    correct_answer: 'C',
  },
  {
    question_text: 'Что нужно добавить к краске, чтобы сделать её светлее?',
    option_a: 'чёрный цвет',
    option_b: 'синий цвет',
    option_c: 'белый цвет',
    option_d: 'коричневый цвет',
    correct_answer: 'C',
  },
  {
    question_text: 'Как называется рисунок самого себя?',
    option_a: 'портрет',
    option_b: 'автопортрет',
    option_c: 'шарж',
    option_d: 'набросок',
    correct_answer: 'B',
  },
  {
    question_text: 'Как называются три основных цвета в живописи?',
    option_a: 'зелёный, оранжевый, фиолетовый',
    option_b: 'красный, жёлтый, синий',
    option_c: 'белый, чёрный, серый',
    option_d: 'розовый, голубой, коричневый',
    correct_answer: 'B',
  },
  {
    question_text: 'Что изготавливают в Жостово?',
    option_a: 'расписные деревянные ложки',
    option_b: 'фарфоровую посуду',
    option_c: 'расписные металлические подносы',
    option_d: 'глиняные игрушки',
    correct_answer: 'C',
  },
  {
    question_text: 'Как называется художник, который рисует море?',
    option_a: 'анималист',
    option_b: 'пейзажист',
    option_c: 'маринист',
    option_d: 'портретист',
    correct_answer: 'C',
  },
  {
    question_text: 'Какие краски нужно смешать, чтобы получить зелёный цвет?',
    option_a: 'красный + жёлтый',
    option_b: 'синий + жёлтый',
    option_c: 'красный + синий',
    option_d: 'белый + чёрный',
    correct_answer: 'B',
  },
  {
    question_text: 'Что такое набросок?',
    option_a: 'большая законченная картина',
    option_b: 'быстрый рисунок, передающий идею',
    option_c: 'скульптура из глины',
    option_d: 'узор на ткани',
    correct_answer: 'B',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 7;
  const classNum = 3;

  const demoTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по ИЗО. 3 класс (вариант 1)',
    isDemo: true,
  });

  const control2Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по ИЗО. 3 класс (вариант 2)',
    isDemo: false,
  });

  const control3Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по ИЗО. 3 класс (вариант 3)',
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
