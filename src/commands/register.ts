import TelegramBot, { Message } from 'node-telegram-bot-api';
import { Component, CoordinateResponse } from '../models';
import { getCoordinateData } from '../utils/coordinates';
import { registerUserData } from '../user/users';
import { ParentCommand } from './parentCommand';

/**
 * /register - registers user's address
 */
export class RegisterCommand extends ParentCommand {
  readonly defaultThreshold;
  readonly googleMapsToken;
  constructor(bot: TelegramBot, threshold: number, googleMapsToken: string) {
    super(bot);
    this.defaultThreshold = threshold;
    this.googleMapsToken = googleMapsToken;
  }

  async execute(message: Message, match: RegExpExecArray | null): Promise<void> {
    const chatId = message.chat.id;
    if (!match) {
      this.bot.sendMessage(chatId, 'Please provide your address.');
      return;
    }
    const username = message.from?.username;
    if (!username) {
      this.bot.sendMessage(chatId, 'Can\'t find the user. Skipping registration.');
      return;
    }
    const currentAddress = match[1];
    if (!currentAddress) {
      this.bot.sendMessage(chatId, 'Can\'t find address in the input.');
      return;
    }
    const coordinateData: CoordinateResponse = await getCoordinateData(currentAddress, this.googleMapsToken);
    if (coordinateData.status !== 'OK') {
      this.bot.sendMessage(chatId, 'Can\'t find the location. Skipping registration.');
      return;
    }
    const addressResult = coordinateData.results[0];
    const currentCoordinates = addressResult.geometry.location;
    const city = RegisterCommand.findCity(addressResult.address_components);
    if (!city) {
      this.bot.sendMessage(chatId, 'Can\'t find the city. The ongoing requests won\'t be precise');
    }

    registerUserData(username, currentCoordinates, this.defaultThreshold, city);
    this.bot.sendMessage(chatId, 'Address registration complete.');
    this.bot.sendLocation(chatId, currentCoordinates.lat, currentCoordinates.lng);
  }

  private static findCity(addressComponents: Component[]): string | undefined {
    const cityObject = addressComponents.find((component: Component) => component.types.includes('locality'));
    if (!cityObject) {
      return undefined;
    }
    return cityObject.long_name;
  }
}
