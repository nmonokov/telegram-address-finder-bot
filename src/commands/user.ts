import { ParentCommand } from './parentCommand';
import TelegramBot from 'node-telegram-bot-api';
import { getUserData } from '../user/users';

/**
 * /user - returns user data alongside with user location pinned on a map.
 */
export class UserDataCommand extends ParentCommand {
  constructor(bot: TelegramBot) {
    super(bot);
  }

  execute(message: TelegramBot.Message): void {
    const chatId = message.chat.id;
    const username = message.from?.username;
    if (!username) {
      this.bot.sendMessage(chatId, 'Can\'t find the user.');
      return;
    }
    const user = getUserData(username);
    if (!user) {
      this.bot.sendMessage(chatId, `${username}'s data not found. Probably not registered.`);
      return;
    }
    this.bot.sendMessage(chatId, '<b>User Data</b>\n' +
      `city: <code>${user.city}</code>\n` +
      `threshold: <code>${user.proximityThreshold} meters</code>\n`,
      {
      parse_mode: 'HTML',
      });
    this.bot.sendLocation(chatId, user.coordinates.lat, user.coordinates.lng)
  }
}
