import { instance, mock, reset, verify } from 'ts-mockito';
import * as coordinates from '../../utils/coordinates';
import sinon from 'sinon';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { coordinateResponse, coordinateResponseWithCity, getMessage } from '../utils';
import * as userManager from '../../user/users';
import { UserData } from '../../models';
import { AddressMessageCommand } from '../../commands/addressMessage';

describe('address message command test', () => {
  const coordinatesStub = sinon.stub(coordinates, 'getCoordinateData');
  const getDataStub = sinon.stub(userManager, 'getUserData');
  const botMock: TelegramBot = mock(TelegramBot);

  afterEach(() => {
    sinon.reset();
    reset(botMock);
  });

  test('addressMessage::successful address found and notified', async () => {
    const username = 'test_user';
    const message: Message = getMessage(username, undefined, '400 EDWARDS LN VANCOUVER');
    const userData: UserData = {
      city: 'Vancouver',
      coordinates: { lat: 150, lng: 100 },
      proximityThreshold: 100,
    };
    getDataStub.returns(userData);
    const coordinateData = coordinateResponseWithCity();
    const location = coordinateData.results[0].geometry.location;
    const formattedAddress = coordinateData.results[0].formatted_address;
    coordinatesStub.resolves(coordinateData);

    await new AddressMessageCommand(instance(botMock), 'token').execute(message);

    verify(botMock.sendMessage(0, formattedAddress)).once();
    verify(botMock.sendLocation(0, location.lat, location.lng)).once();
    verify(botMock.sendMessage(0, `@${username}, "${formattedAddress}" - is nearby.`)).once();
  });

  test('addressMessage::successful address found without notification', async () => {
    const username = 'test_user';
    const message: Message = getMessage(username, undefined, '400 EDWARDS LN VANCOUVER');
    const userData: UserData = {
      city: 'Vancouver',
      coordinates: { lat: 0, lng: 0 },
      proximityThreshold: 100,
    };
    getDataStub.returns(userData);
    const coordinateData = coordinateResponseWithCity();
    const location = coordinateData.results[0].geometry.location;
    const formattedAddress = coordinateData.results[0].formatted_address;
    coordinatesStub.resolves(coordinateData);

    await new AddressMessageCommand(instance(botMock), 'token').execute(message);

    verify(botMock.sendMessage(0, formattedAddress)).once();
    verify(botMock.sendLocation(0, location.lat, location.lng)).once();
    verify(botMock.sendMessage(0, `@${username}, "${formattedAddress}" - is nearby.`)).never();
  });

  test('addressMessage::successful address found without user location', async () => {
    const username = 'test_user';
    const message: Message = getMessage(username, undefined, '400 EDWARDS LN VANCOUVER');
    getDataStub.returns(undefined);
    const coordinateData = coordinateResponseWithCity();
    const location = coordinateData.results[0].geometry.location;
    const formattedAddress = coordinateData.results[0].formatted_address;
    coordinatesStub.resolves(coordinateData);

    await new AddressMessageCommand(instance(botMock), 'token').execute(message);

    verify(botMock.sendMessage(0, formattedAddress)).once();
    verify(botMock.sendLocation(0, location.lat, location.lng)).once();
    verify(botMock.sendMessage(0, `@${username}, "${formattedAddress}" - is nearby.`)).never();
  });

  test('addressMessage::fail google map zero results', async () => {
    const username = 'test_user';
    const message: Message = getMessage(username, undefined, '400 EDWARDS LN VANCOUVER');
    getDataStub.returns(undefined);
    const coordinateData = coordinateResponse('ZERO_RESULTS');
    const location = coordinateData.results[0].geometry.location;
    const formattedAddress = coordinateData.results[0].formatted_address;
    coordinatesStub.resolves(coordinateData);

    await new AddressMessageCommand(instance(botMock), 'token').execute(message);

    verify(botMock.sendMessage(0, 'Can\'t find the location.')).once();
    verify(botMock.sendMessage(0, formattedAddress)).never();
    verify(botMock.sendLocation(0, location.lat, location.lng)).never();
    verify(botMock.sendMessage(0, `@${username}, "${formattedAddress}" - is nearby.`)).never();
  });

  test('addressMessage::fail no results command text', async () => {
    const username = 'test_user';
    const message: Message = getMessage(username, undefined, '/user');
    const coordinateData = coordinateResponse();
    const location = coordinateData.results[0].geometry.location;
    const formattedAddress = coordinateData.results[0].formatted_address;

    await new AddressMessageCommand(instance(botMock), 'token').execute(message);

    verify(botMock.sendMessage(0, formattedAddress)).never();
    verify(botMock.sendLocation(0, location.lat, location.lng)).never();
    verify(botMock.sendMessage(0, `@${username}, "${formattedAddress}" - is nearby.`)).never();
  });

  test('addressMessage::fail no text', async () => {
    const username = 'test_user';
    const message: Message = getMessage(username, undefined);
    const coordinateData = coordinateResponse();
    const location = coordinateData.results[0].geometry.location;
    const formattedAddress = coordinateData.results[0].formatted_address;

    await new AddressMessageCommand(instance(botMock), 'token').execute(message);

    verify(botMock.sendMessage(0, formattedAddress)).never();
    verify(botMock.sendLocation(0, location.lat, location.lng)).never();
    verify(botMock.sendMessage(0, `@${username}, "${formattedAddress}" - is nearby.`)).never();
  });
});
