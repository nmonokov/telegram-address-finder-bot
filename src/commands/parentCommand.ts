import TelegramBot, { Message } from 'node-telegram-bot-api';

/**
 * Class for defining possible bot commands.
 */
export abstract class ParentCommand {
  protected readonly bot: TelegramBot;

  protected constructor(bot: TelegramBot) {
    this.bot = bot;
  }

  abstract execute(message: Message, match?: RegExpExecArray | null): void;
}
