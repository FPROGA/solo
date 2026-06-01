require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

const variant1 = [
  {
    question_text: 'Какое физическое качество развивает бег на короткие дистанции?',
    option_a: 'выносливость',
    option_b: 'гибкость',
    option_c: 'быстроту',
    option_d: 'силу',
    correct_answer: 'C',
  },
  {
    question_text: 'Какой вид спорта называют «королевой спорта»?',
    option_a: 'футбол',
    option_b: 'лёгкая атлетика',
    option_c: 'гимнастика',
    option_d: 'плавание',
    correct_answer: 'B',
  },
  {
    question_text: 'Что нужно сделать перед началом урока физкультуры?',
    option_a: 'сразу бежать в спортивный зал',
    option_b: 'переодеться в спортивную форму и снять украшения',
    option_c: 'взять мяч и начать играть',
    option_d: 'позавтракать прямо перед уроком',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой инвентарь нужен для игры в баскетбол?',
    option_a: 'клюшка и шайба',
    option_b: 'ракетка и волан',
    option_c: 'мяч и кольцо (корзина)',
    option_d: 'ворота и мяч',
    correct_answer: 'C',
  },
  {
    question_text: 'Как называется построение учеников в затылок друг за другом?',
    option_a: 'шеренга',
    option_b: 'колонна',
    option_c: 'круг',
    option_d: 'рассыпной строй',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой вид закаливания самый доступный и простой?',
    option_a: 'купание в проруби',
    option_b: 'обливание холодной водой',
    option_c: 'хождение босиком',
    option_d: 'воздушные ванны',
    correct_answer: 'D',
  },
  {
    question_text: 'Как часто нужно проветривать спортивный зал?',
    option_a: 'один раз в день',
    option_b: 'перед каждым уроком и после него',
    option_c: 'раз в неделю',
    option_d: 'только зимой',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой вид спорта развивает координацию движений больше всего?',
    option_a: 'бег',
    option_b: 'прыжки в длину',
    option_c: 'гимнастика',
    option_d: 'лыжные гонки',
    correct_answer: 'C',
  },
  {
    question_text: 'Какое упражнение развивает гибкость?',
    option_a: 'приседания',
    option_b: 'наклоны вперёд',
    option_c: 'бег на месте',
    option_d: 'прыжки на скакалке',
    correct_answer: 'B',
  },
  {
    question_text: 'Что такое режим дня?',
    option_a: 'расписание уроков в школе',
    option_b: 'план тренировок спортсмена',
    option_c: 'правильное чередование работы, отдыха, сна и питания',
    option_d: 'список продуктов на неделю',
    correct_answer: 'C',
  },
];

const variant2 = [
  {
    question_text: 'Какое физическое качество развивает бег на длинные дистанции?',
    option_a: 'быстроту',
    option_b: 'выносливость',
    option_c: 'силу',
    option_d: 'ловкость',
    correct_answer: 'B',
  },
  {
    question_text: 'Как называется спортивный снаряд для прыжков в высоту?',
    option_a: 'планка',
    option_b: 'мат',
    option_c: 'брус',
    option_d: 'канат',
    correct_answer: 'A',
  },
  {
    question_text: 'Что запрещено делать на уроке физкультуры?',
    option_a: 'выполнять упражнения по команде учителя',
    option_b: 'жевать жвачку',
    option_c: 'надевать спортивную обувь',
    option_d: 'строиться в шеренгу',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой инвентарь нужен для игры в волейбол?',
    option_a: 'мяч и сетка',
    option_b: 'ракетка и мячик',
    option_c: 'клюшка и шайба',
    option_d: 'мяч и кольцо',
    correct_answer: 'A',
  },
  {
    question_text:
      'Как называется поворот на месте, при котором ученики поворачиваются в направлении правой руки?',
    option_a: 'направо',
    option_b: 'налево',
    option_c: 'кругом',
    option_d: 'шагом марш',
    correct_answer: 'A',
  },
  {
    question_text: 'Что такое закаливание?',
    option_a: 'тренировка мышц',
    option_b: 'повышение устойчивости организма к холоду, жаре и болезням',
    option_c: 'приём витаминов',
    option_d: 'сон при открытой форточке',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой вид спорта относится к зимним?',
    option_a: 'плавание',
    option_b: 'футбол',
    option_c: 'лыжные гонки',
    option_d: 'лёгкая атлетика',
    correct_answer: 'C',
  },
  {
    question_text: 'В какой стране зародились Олимпийские игры?',
    option_a: 'в Египте',
    option_b: 'в Риме',
    option_c: 'в Греции',
    option_d: 'в России',
    correct_answer: 'C',
  },
  {
    question_text: 'Какое упражнение развивает силу рук?',
    option_a: 'бег',
    option_b: 'отжимания',
    option_c: 'наклоны',
    option_d: 'прыжки',
    correct_answer: 'B',
  },
  {
    question_text: 'Как часто нужно чистить спортивную обувь и форму?',
    option_a: 'раз в месяц',
    option_b: 'раз в год',
    option_c: 'после каждой тренировки',
    option_d: 'никогда',
    correct_answer: 'C',
  },
];

const variant3 = [
  {
    question_text:
      'Какое физическое качество помогает человеку быстро менять положение тела и сохранять равновесие?',
    option_a: 'сила',
    option_b: 'выносливость',
    option_c: 'ловкость',
    option_d: 'гибкость',
    correct_answer: 'C',
  },
  {
    question_text: 'Какой вид спорта использует клюшку и шайбу?',
    option_a: 'футбол',
    option_b: 'хоккей',
    option_c: 'теннис',
    option_d: 'баскетбол',
    correct_answer: 'B',
  },
  {
    question_text: 'Почему нельзя заниматься на физкультуре в школьной форме (брюках, рубашке)?',
    option_a: 'это некрасиво',
    option_b: 'одежда сковывает движения и может порваться',
    option_c: 'учитель запрещает',
    option_d: 'модно быть в спортивной форме',
    correct_answer: 'B',
  },
  {
    question_text: 'Что означает команда «Равняйсь!»?',
    option_a: 'сесть на скамейку',
    option_b: 'повернуть голову налево, чтобы видеть грудь направляющего',
    option_c: 'закрыть глаза',
    option_d: 'начать бег',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой вид спорта называют спортивной королевой?',
    option_a: 'футбол',
    option_b: 'гимнастика',
    option_c: 'лёгкая атлетика',
    option_d: 'волейбол',
    correct_answer: 'C',
  },
  {
    question_text: 'Какое упражнение не относится к лёгкой атлетике?',
    option_a: 'бег',
    option_b: 'прыжки в длину',
    option_c: 'метание мяча',
    option_d: 'лазание по канату',
    correct_answer: 'D',
  },
  {
    question_text: 'Какую пользу приносит утренняя зарядка?',
    option_a: 'заменяет завтрак',
    option_b: 'помогает проснуться и зарядиться энергией',
    option_c: 'укорачивает сон',
    option_d: 'развивает агрессию',
    correct_answer: 'B',
  },
  {
    question_text: 'Что такое гигиена тела?',
    option_a: 'мытьё рук и тела, уход за кожей',
    option_b: 'стирка одежды',
    option_c: 'уборка в доме',
    option_d: 'чистка обуви',
    correct_answer: 'A',
  },
  {
    question_text: 'Как часто в неделю рекомендуется проводить уроки физкультуры в школе?',
    option_a: '1 раз',
    option_b: '2 раза',
    option_c: '3 раза',
    option_d: 'каждый день',
    correct_answer: 'C',
  },
  {
    question_text: 'Что нужно сделать при получении травмы на уроке?',
    option_a: 'бежать дальше',
    option_b: 'сразу сказать учителю',
    option_c: 'заплакать',
    option_d: 'спрятаться',
    correct_answer: 'B',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 10;
  const classNum = 3;

  const demoTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по физкультуре. 3 класс (вариант 1)',
    isDemo: true,
  });

  const control2Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по физкультуре. 3 класс (вариант 2)',
    isDemo: false,
  });

  const control3Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по физкультуре. 3 класс (вариант 3)',
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
