import { Module } from '@nestjs/common';
import { CliService } from './cli/cli.service';
import { CliModule } from './cli/cli.module';

@Module({
  providers: [CliService],
  imports: [CliModule],
  exports: [CliModule],
})
export class AppModule {}
