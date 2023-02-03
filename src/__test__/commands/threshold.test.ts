import TelegramBot, { Message } from 'node-telegram-bot-api';
import { instance, mock, reset, verify } from 'ts-mockito';
import * as userFile from '../../user/file';
import * as userManager from '../../user/users';
import sinon from 'sinon';
import { ThresholdCommand } from '../../commands/threshold';
import { UserData } from '../../models';
import { getUserData } from '../../user/users';
import { getMessage } from '../utils';

describe('threshold command test', () => {
  const persistUserStub = sinon.stub(userFile, 'persistUser');
  const stubGetData = sinon.stub(userManager, 'getUserData');
  const botMock: TelegramBot = mock(TelegramBot);

  afterEach(() => {
    sinon.reset();
    reset(botMock);
  });

  test('threshold::successful update threshold', () => {
    const username: string = 'test_user';
    const message: Message = getMessage(username);
    const match: RegExpExecArray = ['/threshold', '1000'] as unknown as RegExpExecArray;
    const userData: UserData = {
      city: 'Vancouver',
      coordinates: { lat: 0, lng: 0 },
      proximityThreshold: 500,
    };
    persistUserStub.resolves();
    stubGetData.onFirstCall().returns(userData);
    userData.proximityThreshold = 1000;
    stubGetData.onSecondCall().returns(userData);


    new ThresholdCommand(instance(botMock)).execute(message, match);

    verify(botMock.sendMessage(
      0, `Threshold value is updated to a new value: ${userData.proximityThreshold}.`)).once();
  });

  test('threshold::fail value not found', () => {
    const username: string = 'test_user';
    const message: Message = getMessage(username);
    const match: RegExpExecArray = ['/threshold'] as unknown as RegExpExecArray;

    new ThresholdCommand(instance(botMock)).execute(message, match);

    verify(botMock.sendMessage(0, 'Threshold value is not a number.')).once();
  });

  test('threshold::fail username not found', () => {
    const message: Message = getMessage();
    const match: RegExpExecArray = ['/threshold'] as unknown as RegExpExecArray;

    new ThresholdCommand(instance(botMock)).execute(message, match);

    verify(botMock.sendMessage(0, 'Can\'t find the user. It is possible you\'re not registered.')).once();
  });

  test('threshold::fail match not found', () => {
    const message: Message = getMessage();

    new ThresholdCommand(instance(botMock)).execute(message, null);

    verify(botMock.sendMessage(0, 'Please provide your threshold.')).once();
  });
});
