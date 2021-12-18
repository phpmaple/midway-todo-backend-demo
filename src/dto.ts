import { Rule, RuleType } from '@midwayjs/decorator';

export class TaskDTO {
  @Rule(RuleType.string().required())
  content: string;
}
