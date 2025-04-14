import { Module } from '@nestjs/common';
import { TaskQuestions } from './cli.questions';
import { CliService } from './cli.service';

@Module({
  providers: [CliService, TaskQuestions],
})
export class CliModule {}
