import { ParentCommand } from './parentCommand';
import TelegramBot from 'node-telegram-bot-api';
import { removeUserData } from '../user/users';

/**
 * /remove - Remove user data
 */
export class RemoveCommand extends ParentCommand {
  constructor(bot: TelegramBot) {
    super(bot);
  }

  execute(message: TelegramBot.Message): void {
    const chatId = message.chat.id;
    const username = message.from?.username;
    if (!username) {
      this.bot.sendMessage(chatId, 'Can\'t find the user data.');
      return;
    }
    const isRemoved = removeUserData(username);
    if (isRemoved) {
      this.bot.sendMessage(chatId, `${username}'s data was removed.`);
    }
  }
}
