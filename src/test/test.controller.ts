import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get('tests')
  async getClasses(@Query('clas') clas: number) {
    return await this.testService.getSubjects(clas);
  }

  @Get('tests/status')
  async getTestsStatus(
    @Query('user_id') user_id: number,
    @Query('clas') clas: number,
  ) {
    return await this.testService.getSubjectsStatus(user_id, clas);
  }

  @Get('test')
  async getTest(
    @Query('id') id: number,
    @Query('clas') clas: number,
    @Query('user_id') user_id?: number,
    @Query('session') session?: number,
  ) {
    return await this.testService.getTest(id, clas, user_id, session);
  }

  @Post('test/session/start')
  async startSession(
    @Body() body: { user_id: number; subject_id: number; clas: number },
  ) {
    return await this.testService.startSession(
      body.user_id,
      body.subject_id,
      body.clas,
    );
  }

  @Get('test/session/:id')
  async getSession(
    @Param('id') id: number,
    @Query('user_id') user_id: number,
  ) {
    return await this.testService.getSessionById(id, user_id);
  }

  @Post('test/session/:id/answers')
  async saveAnswers(
    @Param('id') id: number,
    @Body() body: { user_id: number; answers: Record<string, string> },
  ) {
    return await this.testService.saveSessionAnswers(
      id,
      body.user_id,
      body.answers,
    );
  }

  @Post('test/session/:id/complete')
  async completeSession(
    @Param('id') id: number,
    @Body()
    body: {
      user_id: number;
      grade?: number;
      answers?: Record<string, string>;
    },
  ) {
    return await this.testService.completeSession(
      id,
      body.user_id,
      body.grade,
      body.answers,
    );
  }

  @Get('demo-tests')
  async getDemoTest(@Query('clas') clas: number) {
    return await this.testService.getDemoTest(clas);
  }

  @Get('demo-test')
  async getDemoTestQuestions(
    @Query('id') id: number,
    @Query('clas') clas: number,
  ) {
    return await this.testService.getDemoTestQuestions(id, clas);
  }

  @Post('test/result')
  async saveResult(
    @Body()
    body: {
      grade: number;
      user_id: number;
      test_id: number;
      subject_id: number;
      session_id?: number;
    },
  ) {
    return await this.testService.saveResult(
      body.grade,
      body.user_id,
      body.test_id,
      body.subject_id,
      body.session_id,
    );
  }
}
