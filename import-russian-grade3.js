require('dotenv').config();
const { ensureTest, insertQuestions, createPgClient } = require('./lib/test-import-helpers');

/** Вариант 1 */
const variant1 = [
  {
    question_text: 'В какой строке оба слова являются однокоренными (родственными)?',
    option_a: 'гора – город',
    option_b: 'лес – лесник',
    option_c: 'вода – водитель',
    option_d: 'дом – дым',
    correct_answer: 'B',
  },
  {
    question_text: 'Укажи слово, которое заканчивается на парный согласный, требующий проверки:',
    option_a: 'дуб',
    option_b: 'дом',
    option_c: 'стол',
    option_d: 'сон',
    correct_answer: 'A',
  },
  {
    question_text: 'Вставь пропущенную букву в слово «скво…чник»:',
    option_a: 'р',
    option_b: 'з',
    option_c: 'с',
    option_d: 'ш',
    correct_answer: 'A',
  },
  {
    question_text: 'Укажи слово с приставкой «по»:',
    option_a: '(по)ле',
    option_b: '(по)бежал',
    option_c: '(по)дарок',
    option_d: '(по)док',
    correct_answer: 'B',
  },
  {
    question_text: 'В какой строке все слова имена существительные?',
    option_a: 'белый, белить, белизна',
    option_b: 'радость, ветер, игрушка',
    option_c: 'три, третий, тройка',
    option_d: 'ходьба, ходить, переход',
    correct_answer: 'B',
  },
  {
    question_text:
      'Определи падеж имени существительного в предложении: «Котёнок играл с клубком ниток» (слово клубком).',
    option_a: 'Именительный',
    option_b: 'Родительный',
    option_c: 'Дательный',
    option_d: 'Творительный',
    correct_answer: 'D',
  },
  {
    question_text: 'Укажи глагол в прошедшем времени:',
    option_a: 'рисует',
    option_b: 'нарисовал',
    option_c: 'нарисует',
    option_d: 'рисовать',
    correct_answer: 'B',
  },
  {
    question_text: 'Найди слово, которое пишется с мягким знаком (Ь) на конце:',
    option_a: 'луч',
    option_b: 'доч',
    option_c: 'мяч',
    option_d: 'грач',
    correct_answer: 'B',
  },
  {
    question_text: 'В каком предложении допущена ошибка?',
    option_a: 'У нас красивая школа.',
    option_b: 'Маша купила в магазини хлеб.',
    option_c: 'Дети играют во дворе.',
    option_d: 'Солнце светит ярко.',
    correct_answer: 'B',
  },
  {
    question_text: 'Какое проверочное слово для слова «л…сник» (буква Е)?',
    option_a: 'лес',
    option_b: 'лезть',
    option_c: 'леска',
    option_d: 'лесной',
    correct_answer: 'A',
  },
];

/** Вариант 2 */
const variant2 = [
  {
    question_text: 'В какой строке оба слова являются однокоренными?',
    option_a: 'вода – подводник',
    option_b: 'носить – нос',
    option_c: 'гора – гореть',
    option_d: 'рис – рисунок',
    correct_answer: 'A',
  },
  {
    question_text: 'Укажи слово, в котором нужно проверить парный согласный в корне:',
    option_a: 'зубки',
    option_b: 'котик',
    option_c: 'лампы',
    option_d: 'ноги',
    correct_answer: 'A',
  },
  {
    question_text: 'Вставь пропущенную букву в слово «сне…»:',
    option_a: 'г',
    option_b: 'к',
    option_c: 'п',
    option_d: 'д',
    correct_answer: 'A',
  },
  {
    question_text: 'Укажи слово с предлогом «за»:',
    option_a: '(за)городный',
    option_b: '(за)ходить',
    option_c: '(за)домом',
    option_d: '(за)бежать',
    correct_answer: 'C',
  },
  {
    question_text: 'В какой строке все слова имена прилагательные?',
    option_a: 'красный, краснеть, краснота',
    option_b: 'весёлый, умная, глубокое',
    option_c: 'бег, бегун, беговая',
    option_d: 'дерево, деревянный, деревня',
    correct_answer: 'B',
  },
  {
    question_text:
      'Определи падеж существительного в предложении: «Бабушка рассказала внуку сказку» (слово внуку).',
    option_a: 'Именительный',
    option_b: 'Родительный',
    option_c: 'Дательный',
    option_d: 'Винительный',
    correct_answer: 'C',
  },
  {
    question_text: 'Укажи глагол в будущем времени:',
    option_a: 'читал',
    option_b: 'читает',
    option_c: 'прочитает',
    option_d: 'читать',
    correct_answer: 'C',
  },
  {
    question_text: 'Найди слово, которое пишется без мягкого знака (Ь) на конце:',
    option_a: 'вещь',
    option_b: 'рожь',
    option_c: 'нож',
    option_d: 'дочь',
    correct_answer: 'C',
  },
  {
    question_text: 'В каком предложении допущена ошибка?',
    option_a: 'Летом мы поедем на дачу.',
    option_b: 'Вчера был дождливый день.',
    option_c: 'Увидимся в воскресениe.',
    option_d: 'На столе лежит книга.',
    correct_answer: 'C',
  },
  {
    question_text: 'Какое проверочное слово для слова «в…сенний» (буква Е)?',
    option_a: 'вёсла',
    option_b: 'весна',
    option_c: 'весло',
    option_d: 'висеть',
    correct_answer: 'B',
  },
];

async function run() {
  const client = createPgClient();
  await client.connect();

  const subjectId = 1;
  const classNum = 3;

  const test1Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по русскому языку. 3 класс «Школа России» (вариант 1)',
    isDemo: true,
  });

  const test2Id = await ensureTest(client, {
    subjectId,
    classNum,
    title: 'Тест по русскому языку. 3 класс «Школа России» (вариант 2)',
    isDemo: false,
  });

  const r1 = await insertQuestions(client, test1Id, variant1);
  const r2 = await insertQuestions(client, test2Id, variant2);

  console.log(
    JSON.stringify(
      {
        subjectId,
        classNum,
        test1Id,
        test2Id,
        variant1: r1,
        variant2: r2,
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
