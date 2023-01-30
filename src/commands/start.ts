import TelegramBot, { Message } from 'node-telegram-bot-api';
import { ParentCommand } from './parentCommand';

/**
 * /start - an introduction for a bot
 */
export class StartCommand extends ParentCommand {
  constructor(bot: TelegramBot) {
    super(bot);
  }

  execute(message: Message) {
    this.bot.sendMessage(message.chat.id, `
Hello, ${message.from?.first_name || 'user'}!
This bot helps you find the address on the map.

If you register your current location <code>/register address</code>
the bot will search those addresses in the city you\'re currently in.

Also you can register by simply share your current location in bot.
The only limitation is that city won't be set, so search queries won't be enriched with the city value.

Also you\'ll be notified whether this address is near you. Default threshold is 500 meters.
To change threshold value use this command <code>/threshold 1000</code>.`,
      {
        parse_mode: 'HTML'
      });
  }
}