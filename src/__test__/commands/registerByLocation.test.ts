import { instance, mock, reset, verify } from 'ts-mockito';
import * as userFile from '../../user/file';
import sinon from 'sinon';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { getMessage } from '../utils';
import { RegisterByLocationCommand } from '../../commands/registerByLocation';

describe('register by location command', () => {
  const persistUserStub = sinon.stub(userFile, 'persistUser');
  const botMock: TelegramBot = mock(TelegramBot);

  afterEach(() => {
    sinon.reset();
    reset(botMock);
  });

  test('registerByLocation::successful registration', () => {
    const username: string = 'test_user';
    const defaultThreshold: number = 500;
    const message: Message = getMessage(username, {
      latitude: 0,
      longitude: 0,
    });
    persistUserStub.resolves();

    new RegisterByLocationCommand(instance(botMock), defaultThreshold, 'token').execute(message);

    verify(botMock.sendMessage(0, 'Address registration complete.')).once();
  });

  test('registerByLocation::fail absent location', () => {
    const username: string = 'test_user';
    const defaultThreshold: number = 500;
    const message: Message = getMessage(username);
    persistUserStub.resolves();

    new RegisterByLocationCommand(instance(botMock), defaultThreshold, 'token').execute(message);

    verify(botMock.sendMessage(0, 'Can\'t find the location. Skipping registration.')).once();
  });

  test('registerByLocation::fail absent username', () => {
    const defaultThreshold: number = 500;
    const message: Message = getMessage();
    persistUserStub.resolves();

    new RegisterByLocationCommand(instance(botMock), defaultThreshold, 'token').execute(message);

    verify(botMock.sendMessage(0, 'Can\'t find the user. Skipping registration.')).once();
  });
});
