import TelegramBot, { Message } from 'node-telegram-bot-api';
import { StartCommand } from '../../commands/start';
import { deepEqual, instance, mock, verify } from 'ts-mockito';

describe('start command test', () => {
  const mockBot: TelegramBot = mock(TelegramBot);

  test('start::message without first name', () => {
    const message: Message = {
      chat: { id: 0, type: 'private' },
      date: 0,
      message_id: 0
    };

    new StartCommand(instance(mockBot)).execute(message);

    verify(mockBot.sendMessage(0, 'Hello, user!\n' +
      'This bot helps you find the address on the map.\n' +
      '\n' +
      'If you register your current location <code>/register address</code>\n' +
      'the bot will search those addresses in the city you\'re currently in.\n' +
      '\n' +
      'Also you can register by simply share your current location in bot.\n' +
      'The only limitation is that city won\'t be set, so search queries won\'t be enriched with the city value.\n' +
      '\n' +
      'Also you\'ll be notified whether this address is near you. Default threshold is 500 meters.\n' +
      'To change threshold value use this command <code>/threshold 1000</code>.',
      deepEqual({ parse_mode: 'HTML' }))).called();
  });

  test('start::message with first name', () => {
    const firstName = 'test_name';
    const message: Message = {
      chat: { id: 0, type: 'private' },
      from: { id: 0, is_bot: false, first_name: firstName },
      date: 0,
      message_id: 0
    };

    new StartCommand(instance(mockBot)).execute(message);

    verify(mockBot.sendMessage(0, `Hello, ${firstName}!\n` +
      'This bot helps you find the address on the map.\n' +
      '\n' +
      'If you register your current location <code>/register address</code>\n' +
      'the bot will search those addresses in the city you\'re currently in.\n' +
      '\n' +
      'Also you can register by simply share your current location in bot.\n' +
      'The only limitation is that city won\'t be set, so search queries won\'t be enriched with the city value.\n' +
      '\n' +
      'Also you\'ll be notified whether this address is near you. Default threshold is 500 meters.\n' +
      'To change threshold value use this command <code>/threshold 1000</code>.',
      deepEqual({ parse_mode: 'HTML' }))).called();
  });
});
