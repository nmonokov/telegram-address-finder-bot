import TelegramBot, { Message } from 'node-telegram-bot-api';
import { anything, deepEqual, instance, mock, reset, verify } from 'ts-mockito';
import { UserDataCommand } from '../../commands/user';
import * as userManager from '../../user/users';
import sinon from 'sinon';
import { UserData } from '../../models';
import { getMessage } from '../utils';

describe('user command test', () => {
  const getDataStub = sinon.stub(userManager, 'getUserData');
  const mockBot: TelegramBot = mock(TelegramBot);

  afterEach(() => {
    sinon.reset();
    reset(mockBot);
  })

  test('user::successful data send', () => {
    const expectedUserData: UserData = {
      city: 'Vancouver',
      coordinates: { lat: 0, lng: 0 },
      proximityThreshold: 100,
    };
    getDataStub.returns(expectedUserData);
    const username: string = 'test_username';
    const message: Message = getMessage(username)

    new UserDataCommand(instance(mockBot)).execute(message);

    verify(mockBot.sendMessage(0, '<b>User Data</b>\n' +
      `city: <code>${expectedUserData.city}</code>\n` +
      `threshold: <code>${expectedUserData.proximityThreshold} meters</code>\n`,
      deepEqual({ parse_mode: 'HTML' }))).once();
    verify(mockBot.sendLocation(0, expectedUserData.coordinates.lat, expectedUserData.coordinates.lng)).once();
  });

  test('user::fail user data not found', () => {
    getDataStub.returns(undefined);
    const username: string = 'test_username';
    const message: Message = getMessage(username)

    new UserDataCommand(instance(mockBot)).execute(message);

    verify(mockBot.sendMessage(0, `${username}'s data not found. Probably not registered.`)).once();
    verify(mockBot.sendLocation(anything(), anything(), anything())).never();
  });

  test('user::fail username not found', () => {
    getDataStub.resolves();
    const message: Message = getMessage();

    new UserDataCommand(instance(mockBot)).execute(message);

    verify(mockBot.sendMessage(0, 'Can\'t find the user.')).once();
    verify(mockBot.sendLocation(anything(), anything(), anything())).never();
  });
});
