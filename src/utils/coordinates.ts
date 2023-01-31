import { CoordinateResponse } from '../models';
import { logger } from './logger';
import axios from 'axios';

/**
 * Retrieves coordinate for the selected address in the user message.
 * Uses Google Map API in order to find the location.
 *
 * @param text user's address input
 * @param googleMapToken token for accessing Google Maps API
 */
export const getCoordinateData = async (text: string, googleMapToken: string): Promise<CoordinateResponse> => {
  const locationRequestUrl = createUrl(text, googleMapToken);
  logger.debug({ message: 'Google Maps API url.', locationRequestUrl });
  const mapResponse = await axios.get(locationRequestUrl);
  const coordinateData: CoordinateResponse = mapResponse.data;
  logger.debug({
    status: mapResponse.status,
    statusText: mapResponse.statusText,
    coordinateData,
  });
  return coordinateData;
};

const createUrl = (text: string, googleMapToken: string): string => {
  const formattedAddress = text.trim()
    .replace(/\s+/g, '+')
    .replace(/\d\d:\d\d\s*/, '')
    .trim();
  return `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${googleMapToken}`;
};
