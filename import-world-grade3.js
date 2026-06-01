require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

const variant1 = [
  {
    question_text: 'Какой орган является главным в системе кровообращения человека?',
    option_a: 'лёгкие',
    option_b: 'сердце',
    option_c: 'желудок',
    option_d: 'печень',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой орган чувств отвечает за обоняние?',
    option_a: 'глаза',
    option_b: 'уши',
    option_c: 'нос',
    option_d: 'кожа',
    correct_answer: 'C',
  },
  {
    question_text: 'Какое животное относится к млекопитающим?',
    option_a: 'воробей',
    option_b: 'щука',
    option_c: 'медведь',
    option_d: 'лягушка',
    correct_answer: 'C',
  },
  {
    question_text:
      'Как называется природная зона, где растут пальмы, обезьяны и очень жарко?',
    option_a: 'пустыня',
    option_b: 'тундра',
    option_c: 'тайга',
    option_d: 'тропический лес',
    correct_answer: 'D',
  },
  {
    question_text: 'Что является полезным ископаемым?',
    option_a: 'вода',
    option_b: 'песок',
    option_c: 'воздух',
    option_d: 'дерево',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой газ необходим для дыхания человека и животных?',
    option_a: 'углекислый газ',
    option_b: 'азот',
    option_c: 'кислород',
    option_d: 'водород',
    correct_answer: 'C',
  },
  {
    question_text: 'Как называется профессия человека, который лечит животных?',
    option_a: 'врач',
    option_b: 'ветеринар',
    option_c: 'медсестра',
    option_d: 'фармацевт',
    correct_answer: 'B',
  },
  {
    question_text: 'Какого цвета флаг России (последовательность сверху вниз)?',
    option_a: 'белый, синий, красный',
    option_b: 'красный, синий, белый',
    option_c: 'белый, красный, синий',
    option_d: 'синий, белый, красный',
    correct_answer: 'A',
  },
  {
    question_text: 'Как называется столица России?',
    option_a: 'Санкт-Петербург',
    option_b: 'Новосибирск',
    option_c: 'Москва',
    option_d: 'Казань',
    correct_answer: 'C',
  },
  {
    question_text: 'Как нужно правильно поступить при пожаре?',
    option_a: 'спрятаться под кровать',
    option_b: 'сразу позвонить 101 или 112',
    option_c: 'открыть окна и двери',
    option_d: 'потушить водой электроприборы',
    correct_answer: 'B',
  },
];

const variant2 = [
  {
    question_text:
      'Какой орган отвечает за обработку информации, поступающей от органов чувств?',
    option_a: 'сердце',
    option_b: 'желудок',
    option_c: 'головной мозг',
    option_d: 'позвоночник',
    correct_answer: 'C',
  },
  {
    question_text: 'Какой орган чувств отвечает за осязание?',
    option_a: 'глаза',
    option_b: 'уши',
    option_c: 'нос',
    option_d: 'кожа',
    correct_answer: 'D',
  },
  {
    question_text: 'Какое растение относится к хвойным?',
    option_a: 'берёза',
    option_b: 'дуб',
    option_c: 'ель',
    option_d: 'клён',
    correct_answer: 'C',
  },
  {
    question_text:
      'Как называется природная зона, где очень холодно, есть белые медведи и моржи?',
    option_a: 'пустыня',
    option_b: 'тундра',
    option_c: 'Арктика (ледяная зона)',
    option_d: 'степь',
    correct_answer: 'C',
  },
  {
    question_text: 'Что добывают из нефти?',
    option_a: 'хлеб',
    option_b: 'бензин',
    option_c: 'железо',
    option_d: 'сахар',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой цвет света на светофоре означает «можно идти»?',
    option_a: 'красный',
    option_b: 'жёлтый',
    option_c: 'зелёный',
    option_d: 'синий',
    correct_answer: 'C',
  },
  {
    question_text: 'Как называется профессия человека, который управляет самолётом?',
    option_a: 'водитель',
    option_b: 'капитан',
    option_c: 'пилот',
    option_d: 'машинист',
    correct_answer: 'C',
  },
  {
    question_text: 'Какой зверь изображён на гербе Российской Федерации?',
    option_a: 'медведь',
    option_b: 'орёл',
    option_c: 'двуглавый орёл',
    option_d: 'лев',
    correct_answer: 'C',
  },
  {
    question_text: 'Какое дерево является символом России?',
    option_a: 'дуб',
    option_b: 'берёза',
    option_c: 'сосна',
    option_d: 'клён',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой номер телефона нужно набрать при вызове скорой помощи?',
    option_a: '101',
    option_b: '102',
    option_c: '103',
    option_d: '104',
    correct_answer: 'C',
  },
];

const variant3 = [
  {
    question_text: 'Сколько органов чувств у человека?',
    option_a: '3',
    option_b: '4',
    option_c: '5',
    option_d: '6',
    correct_answer: 'C',
  },
  {
    question_text: 'Какой орган чувств отвечает за слух?',
    option_a: 'глаза',
    option_b: 'уши',
    option_c: 'нос',
    option_d: 'язык',
    correct_answer: 'B',
  },
  {
    question_text: 'Какое животное впадает в зимнюю спячку?',
    option_a: 'заяц',
    option_b: 'волк',
    option_c: 'медведь',
    option_d: 'лиса',
    correct_answer: 'C',
  },
  {
    question_text: 'Как называется самый большой океан на Земле?',
    option_a: 'Атлантический',
    option_b: 'Индийский',
    option_c: 'Северный Ледовитый',
    option_d: 'Тихий',
    correct_answer: 'D',
  },
  {
    question_text: 'Что относится к полезным ископаемым?',
    option_a: 'гранит',
    option_b: 'хлеб',
    option_c: 'молоко',
    option_d: 'книга',
    correct_answer: 'A',
  },
  {
    question_text: 'Какое растение является ядовитым?',
    option_a: 'крапива',
    option_b: 'подорожник',
    option_c: 'ландыш',
    option_d: 'одуванчик',
    correct_answer: 'C',
  },
  {
    question_text: 'Как называется профессия человека, который учит детей в школе?',
    option_a: 'воспитатель',
    option_b: 'учитель',
    option_c: 'преподаватель вуза',
    option_d: 'тренер',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой материк является самым жарким?',
    option_a: 'Евразия',
    option_b: 'Африка',
    option_c: 'Австралия',
    option_d: 'Южная Америка',
    correct_answer: 'B',
  },
  {
    question_text: 'Какое животное занесено в Красную книгу России?',
    option_a: 'волк',
    option_b: 'заяц',
    option_c: 'амурский тигр',
    option_d: 'лось',
    correct_answer: 'C',
  },
  {
    question_text: 'Что нельзя делать, если ты потерялся в лесу?',
    option_a: 'оставаться на месте',
    option_b: 'громко кричать',
    option_c: 'уходить далеко от того места, где потерялся',
    option_d: 'слушать звуки (поезд, голоса)',
    correct_answer: 'C',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 5;
  const classNum = 3;

  const demoTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по окружающему миру. 3 класс (вариант 1)',
    isDemo: true,
  });

  const control2Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по окружающему миру. 3 класс (вариант 2)',
    isDemo: false,
  });

  const control3Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по окружающему миру. 3 класс (вариант 3)',
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
