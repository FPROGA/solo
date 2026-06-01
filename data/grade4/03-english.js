const { Q } = require('../../lib/grade4-q');

const v1 = [
  Q('Как будет по-английски «я завтракаю»?', 'I have dinner', 'I have breakfast', 'I have lunch', 'I have supper', 'B'),
  Q('Как переводится слово «кошка»?', 'dog', 'cat', 'mouse', 'bird', 'B'),
  Q('Выбери лишнее слово:', 'apple', 'banana', 'carrot', 'horse', 'D'),
  Q('Вставь правильную форму: «He … to school every day.»', 'go', 'goes', 'going', 'went', 'B'),
  Q('Как сказать «я люблю пиццу»?', 'I like pizza', 'I love pizza', 'I want pizza', 'I eat pizza', 'A'),
  Q('Выбери правильный перевод: «доброе утро»', 'good afternoon', 'good evening', 'good morning', 'good night', 'C'),
  Q('Какой цвет «blue»?', 'красный', 'синий', 'зелёный', 'жёлтый', 'B'),
  Q('Найди правильную форму: «She … playing now.»', 'am', 'is', 'are', 'be', 'B'),
  Q('Как будет «играть» по-английски?', 'run', 'jump', 'play', 'sing', 'C'),
  Q('Выбери правильный вопрос: «Ты любишь молоко?»', 'You like milk?', 'Do you like milk?', 'Are you like milk?', 'Is you like milk?', 'B'),
];

const v2 = [
  Q('Как будет «собака» по-английски?', 'cat', 'dog', 'pig', 'cow', 'B'),
  Q('Как сказать «я обедаю»?', 'have breakfast', 'have lunch', 'have dinner', 'have supper', 'B'),
  Q('Выбери правильную форму: «They … to the park yesterday.»', 'go', 'goes', 'went', 'going', 'C'),
  Q('Какой цвет «yellow»?', 'красный', 'зелёный', 'жёлтый', 'синий', 'C'),
  Q('Как переводится «школа»?', 'home', 'school', 'park', 'shop', 'B'),
  Q('Вставь глагол: «My sister … reading a book.»', 'am', 'is', 'are', 'be', 'B'),
  Q('Как будет «молоко»?', 'bread', 'milk', 'water', 'juice', 'B'),
  Q('Найди правильный перевод: «Я встаю в 7 часов.»', 'I get up at 7 o\'clock', 'I go to bed at 7 o\'clock', 'I have breakfast at 7 o\'clock', 'I go to school at 7 o\'clock', 'A'),
  Q('Выбери лишнее слово:', 'Monday', 'Tuesday', 'January', 'Friday', 'C'),
  Q('Как спросить «Сколько тебе лет?»', 'How are you?', 'How old are you?', 'Where are you?', 'What is your name?', 'B'),
];

const v3 = [
  Q('Как будет «мама» по-английски?', 'father', 'mother', 'sister', 'brother', 'B'),
  Q('Как сказать «я иду в школу»?', 'I go to home', 'I go to school', 'I go to park', 'I go to shop', 'B'),
  Q('Какой цвет «green»?', 'зелёный', 'красный', 'синий', 'жёлтый', 'A'),
  Q('Вставь глагол: «I … a student.»', 'am', 'is', 'are', 'be', 'A'),
  Q('Как будет «хлеб»?', 'milk', 'water', 'bread', 'juice', 'C'),
  Q('Выбери правильную форму: «We … playing football now.»', 'am', 'is', 'are', 'be', 'C'),
  Q('Как переводится «учитель»?', 'student', 'teacher', 'doctor', 'driver', 'B'),
  Q('Найди правильный перевод: «Спокойной ночи»', 'good morning', 'good afternoon', 'good evening', 'good night', 'D'),
  Q('Как будет «бегать»?', 'walk', 'run', 'jump', 'sit', 'B'),
  Q('Выбери правильный ответ на вопрос «What is your name?»', 'I am fine', 'I am 10', 'My name is Ann', 'I am from Russia', 'C'),
];

module.exports = {
  subjectId: 3,
  subjectLabel: 'английскому языку',
  topic: 'Мой день. Еда. Животные. Глаголы',
  variants: [
    { questions: v1, isDemo: true },
    { questions: v2 },
    { questions: v3 },
  ],
};
