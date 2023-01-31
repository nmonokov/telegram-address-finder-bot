import { Coordinates, RegisteredUser } from '../models';
import { persistUser, readUserFile } from './file';

/**
 * Upload users into the map from the file on the application start up.
 */
const users: { [username: string]: RegisteredUser } = {};
readUserFile().forEach((data: string[]) => {
  const [username, lat, lng, threshold, city] = data;
  users[username] = {
    city: city || 'Not Provided',
    coordinates: {
      lat: Number(lat),
      lng: Number(lng),
    },
    proximityThreshold: Number(threshold),
  };
});

/**
 * Registers user in the map, so we can access he's properties necessary for the address finding.
 *
 * @param username contained in the user's message input
 * @param city where address is located
 * @param threshold proximity threshold in meters to define whether selected address is near or not
 * @param coordinates of the address to register
 */
export const registerUser = (username: string,
                             coordinates: Coordinates,
                             threshold: number,
                             city?: string): void => {
  const registeredUser = {
    city,
    coordinates,
    proximityThreshold: threshold,
  };
  users[username] = registeredUser;
  persistUser(username, registeredUser);
};

/**
 * Retrieves user metadata.
 *
 * @param username contained in the user's message input
 */
export const getUser = (username: string): RegisteredUser => users[username];

/**
 * Updates proximity threshold where 'Close address' is defined. Value in meters.
 *
 * @param username contained in the user's message input
 * @param threshold in meters. Cannot be 0 or below.
 */
export const updateThreshold = (username: string, threshold: number): void => {
  const user = users[username];
  if (user && threshold > 0) {
    user.proximityThreshold = threshold;
  }
  persistUser(username, user);
};
