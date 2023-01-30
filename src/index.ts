import dotenv from 'dotenv';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import * as process from 'process';
import { StartCommand } from './commands/start';
import { RegisterCommand } from './commands/register';
import { ThresholdCommand } from './commands/threshold';
import { UserDataCommand } from './commands/userData';
import { RegisterByLocationCommand } from './commands/registerByLocation';
import { AddressMessageCommand } from './commands/addressMessage';

dotenv.config();
const BOT_TOKEN: string = process.env.BOT_TOKEN || '';
const THRESHOLD: number = Number(process.env.PROXIMITY_THRESHOLD || 500); // threshold in meters
const GOOGLE_MAPS_TOKEN: string = process.env.GOOGLE_MAPS_TOKEN || '';

const bot = new TelegramBot(BOT_TOKEN, { polling: { autoStart: true } });
const start: StartCommand = new StartCommand(bot);
const register: RegisterCommand = new RegisterCommand(bot, THRESHOLD, GOOGLE_MAPS_TOKEN);
const registerByLocation: RegisterByLocationCommand = new RegisterByLocationCommand(bot, THRESHOLD, GOOGLE_MAPS_TOKEN);
const addressMessage: AddressMessageCommand = new AddressMessageCommand(bot, GOOGLE_MAPS_TOKEN);
const threshold: ThresholdCommand = new ThresholdCommand(bot);
const userData: UserDataCommand = new UserDataCommand(bot);

/** Handling bot commands */

bot.onText(/\/start/, async (message: Message) => {
  start.execute(message);
});

bot.onText(/\/register (.+)/, async (message: Message, match: RegExpExecArray | null) => {
  await register.execute(message, match);
});

bot.on('location', (message: Message) => {
  registerByLocation.execute(message);
});

bot.onText(/\/threshold (.+)/, async (message: Message, match: RegExpExecArray | null) => {
  threshold.execute(message, match);
});

bot.onText(/\/user/, (message: Message) => {
  userData.execute(message);
});

bot.on('message', async (message: Message) => {
  await addressMessage.execute(message);
});


