import axios from 'axios';
import { coordinateResponse } from '../utils';
import sinon from 'sinon';
import { getCoordinateData } from '../../utils/coordinates';

describe('coordinates test', () => {
  const getStub = sinon.stub(axios, 'get');

  afterAll(() => {
    getStub.reset();
  })

  test('getCoordinateData::successful', async () => {
    const googleMapToken = 'token';
    const addressText = ' 400 EDWARDS LN VANCOUVER ';
    const expectedUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=400+EDWARDS+LN+VANCOUVER&key=token';
    getStub.resolves(coordinateResponse());

    await getCoordinateData(addressText, googleMapToken);

    expect(getStub.calledWithMatch(expectedUrl)).toBeTruthy();
  });
});
