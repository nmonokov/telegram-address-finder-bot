import TelegramBot, { Message } from 'node-telegram-bot-api';
import { getUserData, updateThreshold } from '../user/users';
import { ParentCommand } from './parentCommand';

/**
 * /threshold - change user's proximity threshold
 */
export class ThresholdCommand extends ParentCommand {
  constructor(bot: TelegramBot) {
    super(bot);
  }

  execute(message: Message, match: RegExpExecArray | null): void {
    const chatId = message.chat.id;
    if (!match) {
      this.bot.sendMessage(chatId, 'Please provide your threshold.');
      return;
    }
    const username = message.from?.username;
    if (!username) {
      this.bot.sendMessage(chatId, 'Can\'t find the user. It is possible you\'re not registered.');
      return;
    }
    const newThreshold = match[1];
    if (!ThresholdCommand.isNumber(newThreshold)) {
      this.bot.sendMessage(chatId, 'Threshold value is not a number.');
      return;
    }
    updateThreshold(username, Number(newThreshold));
    this.bot.sendMessage(chatId,
      `Threshold value is updated to a new value: ${getUserData(username).proximityThreshold}.`);
  }

  private static isNumber(value: string): boolean {
    return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
  }
}
