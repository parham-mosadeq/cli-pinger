import { Question, QuestionSet } from 'nest-commander';

@QuestionSet({ name: 'pinger-questions' })
export class TaskQuestions {
  @Question({
    message: 'Enter a URL (for example: https://google.com) : ',
    name: 'readUrl',
    type: 'input',
  })
  parseUrl(val: string) {
    return val;
  }

  @Question({
    message: 'Enter a timeout value (in ms): ',
    name: 'timeout',
    type: 'number',
  })
  parseTimeout(val: number) {
    return val;
  }

  @Question({
    message: 'Number of tries?',
    name: 'numberOfRetry',
    type: 'number',
    default: 1,
  })
  parseNumberOfRetry(val: number) {
    return val;
  }
}
