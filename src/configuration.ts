import { ILifeCycle } from '@midwayjs/core';
import { App, Configuration } from '@midwayjs/decorator';
import * as orm from '@midwayjs/orm';
import { Application } from 'egg';
import { join } from 'path';

@Configuration({
  importConfigs: [join(__dirname, './config')],
  imports: [orm],
  conflictCheck: true,
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  async onReady() {}
}
