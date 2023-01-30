import { ParentCommand } from './parentCommand';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { logger } from '../utils/logger';
import { getUser } from '../user/users';
import { CoordinateResponse, Coordinates } from '../models';
import { getCoordinateData } from '../utils/coordinates';
import { isNear } from '../utils/distance';

/**
 * Parse simple message prompt. Expecting to have an address text. If address is not found, then skip the entry.
 * If user was registered, then some prompt enhancement happened with adding city for more precision.
 * If user was registered, then user will receive a notification if selected address within threshold.
 *  Notification example: @user, "600-Richchya St, 21, Vinnytsia, Vinnyts'ka oblast, Ukraine, 21021" - is nearby.
 */
export class AddressMessageCommand extends ParentCommand {
  readonly googleMapsToken;

  constructor(bot: TelegramBot, googleMapsToken: string) {
    super(bot);
    this.googleMapsToken = googleMapsToken;
  }

  async execute(message: TelegramBot.Message): Promise<void> {
    const text: string | undefined = message.photo ? message.caption : message.text;
    if (!text) {
      logger.debug({message: 'Text is empty, skipping this message.'});
      return;
    }
    if (text.startsWith('/')) {
      return;
    }
    const enrichedText = `${getUser(message.from?.username || '')?.city || ''} ${text}`;
    logger.debug({message: 'Enriched text value for an address search.', enrichedText});
    const coordinateData: CoordinateResponse = await getCoordinateData(enrichedText, this.googleMapsToken);
    this.defineLocation(message, coordinateData);
  }

  private defineLocation(message: Message, coordinateData: CoordinateResponse): void {
    const chatId = message.chat.id;
    if (coordinateData.status !== 'OK') {
      this.bot.sendMessage(chatId, 'Can\'t find the location.');
      return;
    }
    coordinateData.results.forEach((data) => {
      const location: Coordinates = data.geometry.location;
      this.bot.sendMessage(chatId, data.formatted_address);
      this.bot.sendLocation(chatId, location.lat, location.lng);
      this.notifyIfNearby(message, location, data.formatted_address);
    });
  }

  private notifyIfNearby(message: Message,
                         coordinatesToCompare: Coordinates,
                         formattedAddress: string): void {
    const username = message.from?.username || '';
    const user = getUser(username);
    if (!user) {
      logger.debug({message: 'User\'s location is absent. Skipping the alert.'});
      return;
    }
    logger.debug({
      message: 'Current location',
      registeredCoordinates: user.coordinates,
    });
    if (isNear(user.coordinates, coordinatesToCompare, user.proximityThreshold)) {
      this.bot.sendMessage(message.chat.id, `@${username}, "${formattedAddress}" - is nearby.`);
    }
  };
}
