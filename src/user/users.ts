import { Coordinates, UserData } from '../models';
import { overrideUserFile, persistUser, readUserFile } from './file';

/**
 * Upload user data into the map from the file on the application start up.
 */
const users: { [username: string]: UserData } = {};
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
 * Registers user data in the map, so we can access he's properties necessary for the address finding.
 *
 * @param username contained in the user's message input
 * @param city where address is located
 * @param threshold proximity threshold in meters to define whether selected address is near or not
 * @param coordinates of the address to register
 */
export const registerUserData = (username: string,
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
 * Retrieves user data.
 *
 * @param username contained in the user's message input
 */
export const getUserData = (username: string): UserData | undefined => users[username];

/**
 * Updates proximity threshold where 'Close address' is defined. Value in meters.
 *
 * @param username contained in the user's message input
 * @param threshold in meters. Cannot be 0 or below.
 */
export const updateThreshold = (username: string, threshold: number): void => {
  const user: UserData | undefined = getUserData(username);
  if (user && threshold > 0) {
    user.proximityThreshold = threshold;
    persistUser(username, user);
  }
};

/**
 * Removing the user data from the map and then overriding the whole file with user data.
 *
 * @param username
 */
export const removeUserData = (username: string): boolean => {
  const user: UserData | undefined = getUserData(username);
  if (user) {
    delete users[username];
    return overrideUserFile(users);
  }
  return false;
}
