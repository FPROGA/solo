require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

/** Вариант 1 — демо */
const variantDemo = [
  {
    question_text: 'Что относится к неживой природе?',
    option_a: 'Птицы',
    option_b: 'Солнце',
    option_c: 'Деревья',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Укажи столицу России.',
    option_a: 'Санкт-Петербург',
    option_b: 'Москва',
    option_c: 'Новосибирск',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Как называется группа животных, тело которых покрыто перьями?',
    option_a: 'Рыбы',
    option_b: 'Птицы',
    option_c: 'Звери',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какую форму имеет наша планета Земля?',
    option_a: 'Круг',
    option_b: 'Квадрат',
    option_c: 'Шар',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Укажи хвойное дерево.',
    option_a: 'Берёза',
    option_b: 'Ель',
    option_c: 'Клён',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какая часть растения находится под землёй?',
    option_a: 'Стебель',
    option_b: 'Лист',
    option_c: 'Корень',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Сколько ног у насекомых?',
    option_a: '4',
    option_b: '6',
    option_c: '8',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Каким цветом на глобусе обозначают воду?',
    option_a: 'Зелёным',
    option_b: 'Коричневым',
    option_c: 'Синим',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Что нужно делать перед едой, чтобы быть здоровым?',
    option_a: 'Почитать книгу',
    option_b: 'Помыть руки',
    option_c: 'Посмотреть телевизор',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text:
      'Как называются животные, которые живут рядом с человеком и за которыми он ухаживает?',
    option_a: 'Дикие',
    option_b: 'Лесные',
    option_c: 'Домашние',
    option_d: '',
    correct_answer: 'C',
  },
];

/** Вариант 2 — контрольная */
const variantControl = [
  {
    question_text: 'Что относится к живой природе?',
    option_a: 'Камень',
    option_b: 'Гриб',
    option_c: 'Звезда',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Кто является главой (президентом) нашего государства?',
    option_a: 'Король',
    option_b: 'Президент',
    option_c: 'Мэр',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Чем звери отличаются от других животных?',
    option_a: 'Умеют летать',
    option_b: 'Тело покрыто шерстью',
    option_c: 'Живут в воде',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Как называется дерево, которое на зиму сбрасывает свои хвоинки?',
    option_a: 'Сосна',
    option_b: 'Лиственница',
    option_c: 'Ель',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Солнце — это...',
    option_a: 'Планета',
    option_b: 'Спутник',
    option_c: 'Звезда',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Укажи зимующую птицу.',
    option_a: 'Ласточка',
    option_b: 'Поползень (или воробей)',
    option_c: 'Аист',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Во что превращается снег в теплом помещении?',
    option_a: 'В лед',
    option_b: 'В воду',
    option_c: 'В пар',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какое время года наступает после зимы?',
    option_a: 'Осень',
    option_b: 'Лето',
    option_c: 'Весна',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'В каком возрасте можно выезжать на велосипеде на проезжую часть дороги?',
    option_a: 'В 10 лет',
    option_b: 'В 14 лет',
    option_c: 'В 7 лет',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Что из перечисленного НЕЛЬЗЯ делать в лесу?',
    option_a: 'Слушать пение птиц',
    option_b: 'Разорять гнезда и муравейники',
    option_c: 'Фотографировать цветы',
    option_d: '',
    correct_answer: 'B',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 5;
  const classNum = 1;

  const demoTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Демотест по окружающему миру',
    isDemo: true,
  });

  const controlTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Контрольная работа по окружающему миру',
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
