require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

/** Вариант 1 — демо */
const variantDemo = [
  {
    question_text:
      'Кто написал сказку «Телефон», которая начинается словами: «У меня зазвонил телефон...»?',
    option_a: 'С. Маршак',
    option_b: 'К. Чуковский',
    option_c: 'А. Барто',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text:
      'Как звали девочку, которая пошла в лес, заблудилась и попала в домик к медведям?',
    option_a: 'Алёнушка',
    option_b: 'Маша',
    option_c: 'Красная Шапочка',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Продолжи пословицу: «Делу время — потехе ...»',
    option_a: 'минута',
    option_b: 'час',
    option_c: 'день',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Из какой сказки эти слова: «Ловись, рыбка, и мала, и велика!»?',
    option_a: '«Лисичка-сестричка и серый волк»',
    option_b: '«По щучьему велению»',
    option_c: '«Зимовье зверей»',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Укажи жанр произведения: «У Сени и Сани в сетях сомы с усами».',
    option_a: 'Сказка',
    option_b: 'Скороговорка',
    option_c: 'Стихотворение',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Кто из героев сказки «Теремок» пришёл и разрушил его?',
    option_a: 'Лиса',
    option_b: 'Волк',
    option_c: 'Медведь',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Кто автор стихотворения «Идёт бычок, качается...»?',
    option_a: 'С. Михалков',
    option_b: 'А. Барто',
    option_c: 'К. Чуковский',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'В какой сказке герой укатился от дедушки и от бабушки?',
    option_a: '«Колобок»',
    option_b: '«Репка»',
    option_c: '«Гуси-лебеди»',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Что такое загадка?',
    option_a: 'Краткий рассказ о жизни',
    option_b: 'Иносказательное описание предмета, который нужно узнать',
    option_c: 'Смешная история',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Как звали собаку в сказке «Репка»?',
    option_a: 'Шарик',
    option_b: 'Жучка',
    option_c: 'Дружок',
    option_d: '',
    correct_answer: 'B',
  },
];

/** Вариант 2 — контрольная */
const variantControl = [
  {
    question_text: 'Кто написал стихотворение «Дядя Стёпа»?',
    option_a: 'С. Маршак',
    option_b: 'С. Михалков',
    option_c: 'Л. Толстой',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какой герой сказки предлагал всем «жить дружно»?',
    option_a: 'Кот Леопольд',
    option_b: 'Кот Матроскин',
    option_c: 'Кот в сапогах',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Укажи, что НЕ является устным народным творчеством.',
    option_a: 'Пословица',
    option_b: 'Потешка',
    option_c: 'Рассказ писателя',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'В сказке «Гуси-лебеди» кто помог девочке спрятаться от погони в самый первый раз?',
    option_a: 'Речка',
    option_b: 'Печка',
    option_c: 'Яблоня',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Кто из персонажей сказки «Репка» был самым маленьким и помог её вытянуть?',
    option_a: 'Внучка',
    option_b: 'Кошка',
    option_c: 'Мышка',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Из какого произведения эти строки: «Одеяло убежало, улетела простыня...»?',
    option_a: '«Мойдодыр»',
    option_b: '«Федорино горе»',
    option_c: '«Айболит»',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Как называют человека, который пишет стихи?',
    option_a: 'Писатель',
    option_b: 'Поэт',
    option_c: 'Художник',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Кто в сказке «Морозко» был добрым и трудолюбивым?',
    option_a: 'Мачеха',
    option_b: 'Падчерица',
    option_c: 'Родная дочка',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text:
      'В стихотворении С. Маршака «Где обедал воробей?» в гостях у какого зверя воробью стало опасно?',
    option_a: 'У льва',
    option_b: 'У слона',
    option_c: 'У крокодила',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Чем закончилась сказка «Колобок»?',
    option_a: 'Колобок убежал от Лисы',
    option_b: 'Лиса съела Колобка',
    option_c: 'Колобок вернулся к бабушке',
    option_d: '',
    correct_answer: 'B',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 2;
  const classNum = 1;

  const demoTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Демотест по литературному чтению',
    isDemo: true,
  });

  const controlTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Контрольная работа по литературному чтению',
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
