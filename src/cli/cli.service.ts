import { Command, CommandRunner, InquirerService } from 'nest-commander';
import axios, { AxiosError } from 'axios';

@Command({
  name: 'pinger',
})
export class CliService extends CommandRunner {
  constructor(private readonly inquirer: InquirerService) {
    super();
  }

  async run(): Promise<void> {
    const answers = await this.inquirer.ask<{
      readUrl: string;
      timeout: number;
      numberOfRetry: number;
    }>('pinger-questions', undefined);

    const { readUrl, timeout, numberOfRetry } = answers;

    console.log('\n--- Pinging Info ---');
    console.log(`🌐 URL: ${readUrl}`);
    console.log(`⏱️ Timeout: ${timeout}ms`);
    console.log(`🔁 Retries: ${numberOfRetry}`);

    const totalStart = Date.now();
    let lastStatus: number | null = null;
    let successCount = 0;

    for (let i = 1; i <= numberOfRetry; i++) {
      console.log(`\n🔄 Attempt ${i} of ${numberOfRetry}`);
      const attemptStart = Date.now();

      try {
        const response = await axios.get(readUrl, {
          timeout,
          maxRedirects: 5,
          validateStatus: () => true,
        });

        const duration = Date.now() - attemptStart;
        lastStatus = response.status;

        console.log(
          `✅ Success: ${response.status} ${response.statusText} (${duration}ms)`,
        );
        successCount++;
      } catch (error) {
        const duration = Date.now() - attemptStart;
        const axiosError = error as AxiosError;

        if (axiosError.code === 'ECONNABORTED') {
          console.error(`❌ Timeout after ${duration}ms.`);
        } else if (axiosError.response) {
          lastStatus = axiosError.response.status;
          console.error(`❌ HTTP Error: ${lastStatus}`);
        } else {
          console.error(`❌ Error: ${axiosError.message}`);
        }
      }

      if (i < numberOfRetry) {
        console.log('⏳ Waiting before next attempt...');
        await new Promise((res) => setTimeout(res, timeout));
      }
    }

    const totalDuration = Date.now() - totalStart;

    console.log('\n📊 Final Summary');
    console.log(`URL: ${readUrl}`);
    console.log(`Status Code: ${lastStatus ?? 'unknown'}`);
    console.log(`Total Time: ${totalDuration}ms`);
    console.log(`✅ Successes: ${successCount}`);
    console.log(`❌ Failures: ${numberOfRetry - successCount}`);
  }
}
