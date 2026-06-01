require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

/** Вариант 1 — демо */
const variantDemo = [
  {
    question_text: 'С чего должен начинаться каждый день здорового человека?',
    option_a: 'С плотного обеда',
    option_b: 'С утренней зарядки',
    option_c: 'С просмотра мультфильмов',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Как называется начало бега в соревнованиях?',
    option_a: 'Финиш',
    option_b: 'Старт',
    option_c: 'Прыжок',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Что нужно обязательно сделать перед основной тренировкой или игрой?',
    option_a: 'Отдохнуть и полежать',
    option_b: 'Попить побольше воды',
    option_c: 'Сделать разминку',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'В какой игре используется самый большой мяч?',
    option_a: 'В теннисе',
    option_b: 'В баскетболе',
    option_c: 'В футболе',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Что из перечисленного является зимним видом спорта?',
    option_a: 'Плавание',
    option_b: 'Бег на лыжах',
    option_c: 'Езда на велосипеде',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Как называется строй, в котором ученики стоят плечом к плечу в одну линию?',
    option_a: 'Колонна',
    option_b: 'Шеренга',
    option_c: 'Круг',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какую обувь нужно надевать на уроки физкультуры в зал?',
    option_a: 'Сапоги',
    option_b: 'Сандалии',
    option_c: 'Кроссовки или кеды',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Зачем нужно соблюдать правила в спортивных играх?',
    option_a: 'Чтобы было нескучно',
    option_b: 'Чтобы избежать травм и играть честно',
    option_c: 'Чтобы быстрее закончить игру',
    option_d: '',
    correct_answer: 'B',
  },
];

/** Вариант 2 — контрольная */
const variantControl = [
  {
    question_text: 'Какое положение тела называют «осанкой»?',
    option_a: 'Умение красиво танцевать',
    option_b: 'Привычное положение тела человека при стоянии, сидении и ходьбе',
    option_c: 'Быстрый бег',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Как называется конец беговой дистанции?',
    option_a: 'Старт',
    option_b: 'Финиш',
    option_c: 'Поворот',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Сколько раз в день нужно чистить зубы?',
    option_a: '1 раз в неделю',
    option_b: '2 раза (утром и вечером)',
    option_c: 'Можно вообще не чистить',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'В какой игре мяч отбивают не руками, а ногами?',
    option_a: 'Волейбол',
    option_b: 'Баскетбол',
    option_c: 'Футбол',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text:
      'Как называются самые главные спортивные соревнования в мире, которые проходят раз в 4 года?',
    option_a: 'Чемпионат школы',
    option_b: 'Олимпийские игры',
    option_c: 'Весёлые старты',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Что из этого относится к гимнастическим упражнениям?',
    option_a: 'Кувырок',
    option_b: 'Забивание гола',
    option_c: 'Прыжок в воду',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Как называется строй, в котором ученики стоят в затылок друг другу?',
    option_a: 'Колонна',
    option_b: 'Шеренга',
    option_c: 'Ряд',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Какое состояние организма наступает после длительных физических нагрузок?',
    option_a: 'Голод',
    option_b: 'Утомление (усталость)',
    option_c: 'Рост',
    option_d: '',
    correct_answer: 'B',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 10;
  const classNum = 1;

  const demoTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Демотест по физкультуре',
    isDemo: true,
  });

  const controlTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Контрольная работа по физкультуре',
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
