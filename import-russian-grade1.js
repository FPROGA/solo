require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

/** Вариант 1 — демо. Ответы: Б, А, Б, Б, Б, В, А, Б, В, Б */
const variantDemo = [
  {
    question_text: 'Укажи, сколько букв в русском алфавите.',
    option_a: '30',
    option_b: '33',
    option_c: '31',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Выбери слово, которое состоит из двух слогов.',
    option_a: 'Школа',
    option_b: 'Слон',
    option_c: 'Карандаш',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'В каком слове пропущена буква А?',
    option_a: 'Ч..до',
    option_b: 'Ч..йка',
    option_c: 'Щ..ка',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Выбери верную схему для слова «Ёжик».',
    option_a: '4 буквы, 4 звука',
    option_b: '4 буквы, 3 звука',
    option_c: '4 буквы, 5 звуков',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Укажи слово, которое пишется с большой буквы.',
    option_a: '(Р, р)ека',
    option_b: '(В, в)олга',
    option_c: '(Г, г)ород',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какое слово нельзя переносить с одной строки на другую?',
    option_a: 'Оса',
    option_b: 'Урок',
    option_c: 'Оба варианта верны',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Укажи слово, в котором все согласные звуки твёрдые.',
    option_a: 'Лыжи',
    option_b: 'Река',
    option_c: 'Мяч',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'Какая буква не обозначает звука?',
    option_a: 'Й',
    option_b: 'Ь',
    option_c: 'У',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Найди «лишнее» слово (отличается по смыслу).',
    option_a: 'Бежать',
    option_b: 'Прыгать',
    option_c: 'Красивый',
    option_d: '',
    correct_answer: 'C',
  },
  {
    question_text: 'Укажи правильный конец предложения: «В лесу весело пели...»',
    option_a: 'грибы.',
    option_b: 'птицы.',
    option_c: 'деревья.',
    option_d: '',
    correct_answer: 'B',
  },
];

/** Вариант 2 — контрольная. Ответы: Б, Б, А, Б, Б, Б, Б, Б, Б, Б */
const variantControl = [
  {
    question_text: 'Найди слово, которое отвечает на вопрос КТО?',
    option_a: 'Книга',
    option_b: 'Собака',
    option_c: 'Трава',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какая буква всегда обозначает мягкий согласный звук?',
    option_a: 'Ш',
    option_b: 'Й',
    option_c: 'Ц',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Выбери слово с ударением на последнем слоге.',
    option_a: 'Алфавит',
    option_b: 'Садик',
    option_c: 'Яблоко',
    option_d: '',
    correct_answer: 'A',
  },
  {
    question_text: 'В каком слове допущена ошибка?',
    option_a: 'Жизнь',
    option_b: 'Щука',
    option_c: 'Чашка',
    option_d: 'Машына',
    correct_answer: 'B',
  },
  {
    question_text: 'Укажи количество слогов в слове «Учительница».',
    option_a: '4',
    option_b: '5',
    option_c: '6',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Какое слово является проверочным для слова «Г..ра»?',
    option_a: 'Горный',
    option_b: 'Горы',
    option_c: 'Оба вышеперечисленных варианта',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Выбери слово, которое разделено для переноса правильно.',
    option_a: 'Ко-ньки',
    option_b: 'Конь-ки',
    option_c: 'Ко-нь-ки',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text:
      'Сколько предложений в тексте: «Наступила весна светит солнце прилетели грачи»?',
    option_a: '2',
    option_b: '3',
    option_c: '4',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Укажи слово, где букв больше, чем звуков.',
    option_a: 'Яма',
    option_b: 'Пальто',
    option_c: 'Стул',
    option_d: '',
    correct_answer: 'B',
  },
  {
    question_text: 'Как называются слова, которые обозначают действия предметов?',
    option_a: 'Имена существительные',
    option_b: 'Глаголы',
    option_c: 'Имена прилагательные',
    option_d: '',
    correct_answer: 'B',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 1;
  const classNum = 1;

  const demoTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Демотест по русскому языку',
    isDemo: true,
  });

  const controlTestId = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Контрольная работа по русскому языку',
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
