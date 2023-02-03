import { Message } from 'node-telegram-bot-api';
import { Component, CoordinateResponse } from '../models';

export const getMessage = (username?: string, location?: any, text?: string): Message => ({
  chat: { id: 0, type: 'private' },
  from: { id: 0, is_bot: false, first_name: 'test', username },
  date: 0,
  message_id: 0,
  location,
  text,
});

export const coordinateResponseWithCity = (status?: string): CoordinateResponse => {
  const city: Component = {
    long_name: 'Vancouver',
    short_name: 'Vancouver',
    types: ['locality', 'political']
  };
  return coordinateResponse(status, city);
};

export const coordinateResponse = (status?: string, city?: Component): CoordinateResponse => ({
  results: [
    {
      address_components: city ? [city] : [],
      formatted_address: 'Vancouver, WA, USA',
      geometry: {
        bounds: {
          northeast: {
            lat: 0,
            lng: 0,
          },
          southwest: {
            lat: 0,
            lng: 0,
          }
        },
        location: {
          lat: 150,
          lng: 100,
        },
        location_type: '',
        viewport: {
          southwest: {
            lat: 0,
            lng: 0,
          },
          northeast: {
            lat: 0,
            lng: 0,
          }
        }
      },
      place_id: '',
      types: [],
    }
  ],
  status: status ? status : 'OK',
});
