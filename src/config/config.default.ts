import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { join } from 'path';
import { EntityNotFoundError } from 'typeorm';
export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1639796348205_4286';

  // add your config here
  config.middleware = [];

  config.midwayFeature = {
    // true 代表使用 midway logger
    // false 或者为空代表使用 egg-logger
    replaceEggLogger: true,
  };

  config.orm = {
    type: 'sqlite',
    database: join(__dirname, '../../test.sqlite'),
    synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true
    logging: true,
  };

  config.onerror = {
    all(err, ctx) {
      if (err instanceof EntityNotFoundError) {
        ctx.status = 404;
      } else if (err.name === 'ValidationError') {
        ctx.status = 400;
      } else {
        ctx.status = 500;
      }
      ctx.body = err.message;
    },
  };
  // config.security = {
  //   csrf: false,
  // };

  return config;
};
