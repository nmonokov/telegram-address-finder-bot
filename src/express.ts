import TelegramBot from 'node-telegram-bot-api';
import express, { Express } from 'express';
import { logger } from './utils/logger';

/**
 * Express server to host the bot with web hooks.
 * POST /bot{token} - is a web hook which receives data from the telegram bot and reroutes it to the bot commands.
 *                    In order to secure public endpoint the bot token was added.
 * GET /health - is a simple health check
 */
export class WebHookServer {
  readonly url: string
  readonly port: number
  readonly token: string;
  readonly bot: TelegramBot;
  readonly app: Express;

  private constructor(url: string, port: number, token: string, bot: TelegramBot) {
    this.url = url;
    this.port = port;
    this.token = token;
    this.bot = bot;
    this.app = express();
    this.app.use(express.json());
  }

  start(): void {
    this.registerEndpoints();
    this.registerWebHook();
    this.app.listen(this.port, async () => {
      logger.info(`Express server is listening on ${this.port}`);
    });
  }

  private registerEndpoints(): void {
    this.app.post(`/bot${this.token}`, (request, response) => {
      this.bot.processUpdate(request.body);
      response.sendStatus(200);
    });
    this.app.get('/health', (request, response) => {
      response.sendStatus(200);
    })
  }

  private registerWebHook(): void {
    const telegramApiUrl = `https://api.telegram.org/bot${this.token}`
    const webHookUrl = `${telegramApiUrl}/setWebhook?url=${this.url}/bot${this.token}&drop_pending_updates=false`
    this.bot.setWebHook(webHookUrl);
  }

  static Builder = class {
    private static _url: string;
    private static _port: number;
    private static _token: string;
    private static _bot: TelegramBot;

    static url(url: string) {
      this._url = url;
      return this;
    }

    static port(port: string) {
      this._port = Number(port);
      return this;
    }

    static token(token: string) {
      this._token = token;
      return this;
    }

    static bot(bot: TelegramBot) {
      this._bot = bot;
      return this;
    }

    static build() {
      return new WebHookServer(this._url, this._port, this._token, this._bot);
    }
  }
}
