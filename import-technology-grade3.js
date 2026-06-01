require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

const variant1 = [
  {
    question_text: 'Какой инструмент используют для резания бумаги и картона?',
    option_a: 'игла',
    option_b: 'ножницы',
    option_c: 'линейка',
    option_d: 'клей',
    correct_answer: 'B',
  },
  {
    question_text: 'Как называется вид работы с бумагой, при котором детали приклеиваются на основу?',
    option_a: 'лепка',
    option_b: 'вышивка',
    option_c: 'аппликация',
    option_d: 'плетение',
    correct_answer: 'C',
  },
  {
    question_text: 'Что нужно сделать в первую очередь перед началом работы с иглой?',
    option_a: 'вдеть нитку в иглу',
    option_b: 'воткнуть иглу в игольницу',
    option_c: 'посчитать количество игл',
    option_d: 'проверить остроту иглы',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой материал не пропускает воду и используется для защиты поделок?',
    option_a: 'картон',
    option_b: 'клей ПВА',
    option_c: 'бумага',
    option_d: 'лак',
    correct_answer: 'D',
  },
  {
    question_text: 'Какое свойство бумаги используют при создании аппликации?',
    option_a: 'прозрачность',
    option_b: 'намокает',
    option_c: 'легко режется и приклеивается',
    option_d: 'электропроводность',
    correct_answer: 'C',
  },
  {
    question_text: 'Что такое шаблон?',
    option_a: 'образец для вырезания одинаковых деталей',
    option_b: 'краска для ткани',
    option_c: 'клей для бумаги',
    option_d: 'инструмент для лепки',
    correct_answer: 'A',
  },
  {
    question_text: 'Какой вид работы относится к работе с тканью?',
    option_a: 'оригами',
    option_b: 'вышивка',
    option_c: 'коллаж',
    option_d: 'мозаика',
    correct_answer: 'B',
  },
  {
    question_text: 'Как правильно передавать ножницы?',
    option_a: 'лезвиями вперёд',
    option_b: 'кольцами вперёд',
    option_c: 'в раскрытом виде',
    option_d: 'бросить на стол',
    correct_answer: 'B',
  },
  {
    question_text: 'Что нужно сделать с пластилином, чтобы он стал мягким?',
    option_a: 'нагреть его в руках',
    option_b: 'положить в холодильник',
    option_c: 'замочить в воде',
    option_d: 'положить под пресс',
    correct_answer: 'A',
  },
  {
    question_text: 'Какой вид бумаги используют для оригами?',
    option_a: 'газетная',
    option_b: 'офисная',
    option_c: 'специальная цветная (квадратной формы)',
    option_d: 'калька',
    correct_answer: 'C',
  },
];

const variant2 = [
  {
    question_text: 'Какой инструмент используют для измерения длины и черчения прямых линий?',
    option_a: 'ножницы',
    option_b: 'циркуль',
    option_c: 'линейка',
    option_d: 'транспортир',
    correct_answer: 'C',
  },
  {
    question_text: 'Как называется искусство складывания фигурок из бумаги?',
    option_a: 'аппликация',
    option_b: 'оригами',
    option_c: 'папье-маше',
    option_d: 'квиллинг',
    correct_answer: 'B',
  },
  {
    question_text: 'Как нужно хранить иглы?',
    option_a: 'в столе россыпью',
    option_b: 'в игольнице или подушечке',
    option_c: 'в кармане одежды',
    option_d: 'в коробке с нитками',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой природный материал используют для плетения корзин?',
    option_a: 'бумага',
    option_b: 'береста или ивовый прут',
    option_c: 'ткань',
    option_d: 'пластилин',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой материал используют для лепки?',
    option_a: 'пластилин или глина',
    option_b: 'бумага',
    option_c: 'картон',
    option_d: 'клей',
    correct_answer: 'A',
  },
  {
    question_text: 'Что нельзя делать с ножницами?',
    option_a: 'резать бумагу',
    option_b: 'резать нитки',
    option_c: 'оставлять их раскрытыми на столе',
    option_d: 'передавать кольцами вперёд',
    correct_answer: 'C',
  },
  {
    question_text: 'Как называется инструмент для вышивания?',
    option_a: 'ножницы',
    option_b: 'крючок',
    option_c: 'игла',
    option_d: 'спицы',
    correct_answer: 'C',
  },
  {
    question_text: 'Какую форму имеет лист бумаги для оригами в самом начале?',
    option_a: 'круг',
    option_b: 'треугольник',
    option_c: 'квадрат',
    option_d: 'прямоугольник',
    correct_answer: 'C',
  },
  {
    question_text: 'Что такое разметка детали?',
    option_a: 'нанесение линий контура на материал',
    option_b: 'склеивание деталей',
    option_c: 'вырезание детали',
    option_d: 'украшение поделки',
    correct_answer: 'A',
  },
  {
    question_text: 'Какой клей безопасен для работы с бумагой в школе?',
    option_a: 'эпоксидный',
    option_b: 'ПВА',
    option_c: '«Момент»',
    option_d: 'суперклей',
    correct_answer: 'B',
  },
];

const variant3 = [
  {
    question_text: 'Какой инструмент используют для прокалывания отверстий в ткани или бумаге?',
    option_a: 'шило',
    option_b: 'игла',
    option_c: 'ножницы',
    option_d: 'линейка',
    correct_answer: 'A',
  },
  {
    question_text: 'Как называется заготовка, по которой вырезают несколько одинаковых деталей?',
    option_a: 'выкройка или шаблон',
    option_b: 'рисунок',
    option_c: 'схема',
    option_d: 'эскиз',
    correct_answer: 'A',
  },
  {
    question_text: 'Что нужно сделать после окончания работы с иглой?',
    option_a: 'положить иглу в коробку',
    option_b: 'воткнуть иглу в игольницу',
    option_c: 'оставить иглу в ткани',
    option_d: 'положить иглу на стол',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой материал получают из древесины и используют для письма, печати и поделок?',
    option_a: 'ткань',
    option_b: 'бумага',
    option_c: 'металл',
    option_d: 'стекло',
    correct_answer: 'B',
  },
  {
    question_text: 'Что изготавливают из глины?',
    option_a: 'бумагу',
    option_b: 'керамическую посуду и игрушки',
    option_c: 'ткань',
    option_d: 'стекло',
    correct_answer: 'B',
  },
  {
    question_text: 'Какое правило нужно соблюдать при работе с клеем?',
    option_a: 'пробовать клей на вкус',
    option_b: 'наносить клей кисточкой и не допускать попадания в глаза',
    option_c: 'тереть глаза руками',
    option_d: 'оставлять клей открытым',
    correct_answer: 'B',
  },
  {
    question_text: 'Что такое папье-маше?',
    option_a: 'лепка из пластилина',
    option_b: 'складывание бумаги',
    option_c: 'создание объёмных предметов из кусочков бумаги и клея',
    option_d: 'вышивка крестиком',
    correct_answer: 'C',
  },
  {
    question_text: 'Какой инструмент используют для вырезания деталей из ткани?',
    option_a: 'ножницы для бумаги',
    option_b: 'портновские ножницы',
    option_c: 'канцелярский нож',
    option_d: 'шило',
    correct_answer: 'B',
  },
  {
    question_text: 'Что такое изнаночная сторона ткани?',
    option_a: 'лицевая сторона с рисунком',
    option_b: 'сторона, которая не видна в готовом изделии',
    option_c: 'край ткани',
    option_d: 'сгиб ткани',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой природный материал можно использовать для аппликации?',
    option_a: 'сухие листья',
    option_b: 'пластилин',
    option_c: 'клей',
    option_d: 'краски',
    correct_answer: 'A',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 9;
  const classNum = 3;

  const demoTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по технологии. 3 класс (вариант 1)',
    isDemo: true,
  });

  const control2Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по технологии. 3 класс (вариант 2)',
    isDemo: false,
  });

  const control3Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по технологии. 3 класс (вариант 3)',
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
