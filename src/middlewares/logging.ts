// src/middlewares/logging.middleware.ts
import Chalk from 'chalk';

export default class Logging {
  public static info = (args: any): void => {
    // eslint-disable-next-line no-console
    console.log(
      Chalk.blue(`
[${new Date().toLocaleString()}]
[Log]:`),
      typeof args === 'string' ? Chalk.blueBright(args) : args,
    );
  };

  public static warn = (args: any): void => {
    // eslint-disable-next-line no-console
    console.log(
      Chalk.yellow(`
[${new Date().toLocaleString()}]
[Info]:`),
      typeof args === 'string' ? Chalk.yellowBright(args) : args,
    );
  };

  public static error = (args: any): void => {
    // eslint-disable-next-line no-console
    console.log(
      Chalk.red(`
[${new Date().toLocaleString()}]
[Warn]:`),
      typeof args === 'string' ? Chalk.redBright(args) : args,
    );
  };

  public static log = (args: any): void => {
    // eslint-disable-next-line no-console
    console.log(
      Chalk.green(`
[${new Date().toLocaleString()}]
[Error]:`),
      typeof args === 'string' ? Chalk.greenBright(args) : args,
    );
  };
}
