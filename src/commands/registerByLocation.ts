import TelegramBot, { Message } from 'node-telegram-bot-api';
import { Coordinates } from '../models';
import { registerUserData } from '../user/users';
import { ParentCommand } from './parentCommand';

/**
 * /register - registers user's address
 */
export class RegisterByLocationCommand extends ParentCommand {
  readonly defaultThreshold;
  readonly googleMapsToken;
  constructor(bot: TelegramBot, threshold: number, googleMapsToken: string) {
    super(bot);
    this.defaultThreshold = threshold;
    this.googleMapsToken = googleMapsToken;
  }

  execute(message: Message) {
    const chatId = message.chat.id;
    const username = message.from?.username;
    if (!username) {
      this.bot.sendMessage(chatId, 'Can\'t find the user. Skipping registration.');
      return;
    }
    const location = message.location;
    if (!location) {
      this.bot.sendMessage(chatId, 'Can\'t find the location. Skipping registration.');
      return;
    }
    const currentCoordinates: Coordinates = {
      lat: location?.latitude,
      lng: location?.longitude,
    };
    registerUserData(username, currentCoordinates, this.defaultThreshold);
    this.bot.sendMessage(chatId, 'Address registration complete.');
  }
}
