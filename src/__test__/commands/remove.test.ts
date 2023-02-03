import { anything, instance, mock, reset, verify } from 'ts-mockito';
import * as userFile from '../../user/file';
import * as userManager from '../../user/users';
import sinon from 'sinon';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { getMessage } from '../utils';
import { RemoveCommand } from '../../commands/remove';
import { UserData } from '../../models';

describe('remove command test', () => {
  const overrideUserFileStub = sinon.stub(userFile, 'overrideUserFile');
  const stubGetData = sinon.stub(userManager, 'getUserData');
  const botMock: TelegramBot = mock(TelegramBot);

  afterEach(() => {
    sinon.reset();
    reset(botMock);
  });

  test('remove::successful', () => {
    const username: string = 'test_user';
    const message: Message = getMessage(username);
    const userData: UserData = {
      city: 'Kyiv',
      coordinates: { lat: 0, lng: 0 },
      proximityThreshold: 500,
    };
    overrideUserFileStub.returns(true);
    stubGetData.onFirstCall().returns(userData);

    new RemoveCommand(instance(botMock)).execute(message);

    verify(botMock.sendMessage(0, `${username}'s data was removed.`)).once();
  });

  test('remove::fail override', () => {
    const username: string = 'test_user';
    const message: Message = getMessage(username);
    const userData: UserData = {
      city: 'Kyiv',
      coordinates: { lat: 0, lng: 0 },
      proximityThreshold: 500,
    };
    overrideUserFileStub.returns(false);
    stubGetData.onFirstCall().returns(userData);

    new RemoveCommand(instance(botMock)).execute(message);

    verify(botMock.sendMessage(0, anything())).never();
  });

  test('remove::fail absent user', () => {
    const username: string = 'test_user';
    const message: Message = getMessage(username);
    overrideUserFileStub.returns(false);
    stubGetData.resolves(undefined);

    new RemoveCommand(instance(botMock)).execute(message);

    verify(botMock.sendMessage(0, anything())).never();
  });

  test('remove::fail absent username', () => {
    const message: Message = getMessage();

    new RemoveCommand(instance(botMock)).execute(message);

    verify(botMock.sendMessage(0, 'Can\'t find the user data.')).once();
  });
});
