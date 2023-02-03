import { anything, instance, mock, reset, verify } from 'ts-mockito';
import * as userFile from '../../user/file';
import * as coordinates from '../../utils/coordinates';
import sinon from 'sinon';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { coordinateResponse, coordinateResponseWithCity, getMessage } from '../utils';
import { RegisterCommand } from '../../commands/register';

describe('register command test', () => {
  const coordinatesStub = sinon.stub(coordinates, 'getCoordinateData');
  const persistUserStub = sinon.stub(userFile, 'persistUser');
  const botMock: TelegramBot = mock(TelegramBot);

  afterEach(() => {
    sinon.reset();
    reset(botMock);
  });

  test('register::successful', async () => {
    const username: string = 'test_user';
    const defaultThreshold: number = 500;
    const message: Message = getMessage(username);
    const match: RegExpExecArray = ['/register', '400 EDWARDS LN VANCOUVER'] as unknown as RegExpExecArray;
    const coordinateData = coordinateResponseWithCity();
    const location = coordinateData.results[0].geometry.location;
    coordinatesStub.resolves(coordinateData);
    persistUserStub.resolves();

    await new RegisterCommand(instance(botMock), defaultThreshold, 'token').execute(message, match);

    verify(botMock.sendMessage(0, 'Address registration complete.')).once();
    verify(botMock.sendLocation(0, location.lat, location.lng)).once();
  });

  test('register::successful with absent city', async () => {
    const username: string = 'test_user';
    const defaultThreshold: number = 500;
    const message: Message = getMessage(username);
    const match: RegExpExecArray = ['/register', '400 EDWARDS LN VANCOUVER'] as unknown as RegExpExecArray;
    const coordinateData = coordinateResponse();
    const location = coordinateData.results[0].geometry.location;
    coordinatesStub.resolves(coordinateData);
    persistUserStub.resolves();

    await new RegisterCommand(instance(botMock), defaultThreshold, 'token').execute(message, match);

    verify(botMock.sendMessage(0, 'Can\'t find the city. The ongoing requests won\'t be precise.')).once();
    verify(botMock.sendMessage(0, 'Address registration complete.')).once();
    verify(botMock.sendLocation(0, location.lat, location.lng)).once();
  });

  test('register::fail google map zero results', async () => {
    const username: string = 'test_user';
    const defaultThreshold: number = 500;
    const message: Message = getMessage(username);
    const match: RegExpExecArray = ['/register', '400 EDWARDS LN VANCOUVER'] as unknown as RegExpExecArray;
    const coordinateData = coordinateResponse('ZERO_RESULTS');
    coordinatesStub.resolves(coordinateData);

    await new RegisterCommand(instance(botMock), defaultThreshold, 'token').execute(message, match);

    verify(botMock.sendMessage(0, 'Can\'t find the location. Skipping registration.')).once();
    verify(botMock.sendMessage(0, 'Address registration complete.')).never();
    verify(botMock.sendLocation(anything(), anything(), anything())).never();
  });

  test('register::fail absent address', async () => {
    const username: string = 'test_user';
    const defaultThreshold: number = 500;
    const message: Message = getMessage(username);
    const match: RegExpExecArray = ['/register'] as unknown as RegExpExecArray;

    await new RegisterCommand(instance(botMock), defaultThreshold, 'token').execute(message, match);

    verify(botMock.sendMessage(0, 'Can\'t find address in the input.')).once();
    verify(botMock.sendMessage(0, 'Address registration complete.')).never();
    verify(botMock.sendLocation(anything(), anything(), anything())).never();
  });

  test('register::fail absent username', async () => {
    const defaultThreshold: number = 500;
    const message: Message = getMessage();
    const match: RegExpExecArray = ['/register'] as unknown as RegExpExecArray;

    await new RegisterCommand(instance(botMock), defaultThreshold, 'token').execute(message, match);

    verify(botMock.sendMessage(0, 'Can\'t find the user. Skipping registration.')).once();
    verify(botMock.sendMessage(0, 'Address registration complete.')).never();
    verify(botMock.sendLocation(anything(), anything(), anything())).never();
  });

  test('register::fail absent match', async () => {
    const defaultThreshold: number = 500;
    const message: Message = getMessage();

    await new RegisterCommand(instance(botMock), defaultThreshold, 'token').execute(message, null);

    verify(botMock.sendMessage(0, 'Please provide your address.')).once();
    verify(botMock.sendMessage(0, 'Address registration complete.')).never();
    verify(botMock.sendLocation(anything(), anything(), anything())).never();
  });
});
