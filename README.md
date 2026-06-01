

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).



## Описание структуры бд 
Таблица class_subjects - хранит список всех классов и предметов которые в этих классах
- **id** → integer (PK)
- **subject_id** → text (id предмета)
- **class** → integer (класс)

Таблица subjects - хранит список всех предметов 
- **id** → integer (PK)
- **subject** → text (название предмета / дисциплины)


Таблица tests - хранит все тесты для этого класса
- **id** → integer (PK)
- **subject_id** → integer (внешний ключ к таблице предметов)
- **class** → integer
- **title** → character varying (200)
- **is_demo** -> boolean

Таблица questions 
хранит все вопросы тестов и правильные ответы
- **id** → integer (PK)
- **test_id** → integer (внешний ключ к таблице тестов)
- **question_text** → character varying (текст)
- **option_a** → character varying (500) 
- **option_b** → character varying (500)
- **option_c** → character varying (500) (например "A")
- **option_d** → character varying (500)
- **correct_answer** → character (1)


добавь тесты для второго класса 
помнишь ты уже добавлял 
ТАблица назвыаеттся тест @backend/README.md:90-95 

2 класс 
Название 1 варианта Тест по английскому языку 
Название 2 варианта Демотест по английскому языку subject_id = 3