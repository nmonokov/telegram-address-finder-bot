import fs from 'fs';
import { logger } from '../utils/logger';
import { UserData } from '../models';

const usersFolderPath = 'users';
const usersFilePath = `${usersFolderPath}/data.txt`;

/**
 * Reads user data file. Usually done on the application start up. Creates folder with file if non existent.
 */
export const readUserFile = (): string[][] => {
  try {
    createFileIfNotExists();
    const file: string = fs.readFileSync(usersFilePath, 'utf-8');
    const fileLines: string[] = file.split('\n');
    if (fileLines.length > 0 && fileLines[1]) {
      const entryPluralForm = fileLines.length > 1 ? 'entries' : 'entry';
      logger.info({ message : `Loading ${fileLines.length} user ${entryPluralForm}.`});
    }
    return fileLines.map((line: string) => line.split('|'))
  } catch (error) {
    logger.error({ message: 'Failed to load users from the file.', error });
    return [];
  }
};

const createFileIfNotExists = (): void => {
  const exists: boolean = fs.existsSync(usersFilePath);
  if (!exists) {
    logger.debug({
      message: 'Creating folder and file.',
      usersFilePath,
    });
    fs.mkdirSync(usersFolderPath);
    fs.writeFileSync(usersFilePath, "");
  }
};

/**
 * Appends new line of user data.
 *
 * @param username
 * @param user
 */
export const persistUser = (username: string, user: UserData): void => {
  try {
    const userToPersist = mapUser(username, user);
    fs.appendFileSync(usersFilePath, userToPersist + '\n');
    logger.debug(`User ${username} has been written to ${usersFilePath}`);
  } catch (error) {
    logger.error({ message: 'Failed to persist user.', error });
  }
};

/**
 * Since this is a simple DB implementation with a file in order to delete one user data
 * we need to remove it from the map object and rewrite whole file without him.
 * Returns true if override was successful, false - otherwise.
 *
 * @param users all users in memory
 */
export const overrideUserFile = (users: { [username: string]: UserData }): boolean => {
  const fileLines: string[] = Object.keys(users)
    .filter((username: string) => username)
    .map((username: string) => {
      const user: UserData = users[username];
      return mapUser(username, user);
    });
  const file: string = fileLines.join('\n');
  try {
    fs.writeFileSync(usersFilePath, file);
    return true;
  } catch (error) {
    logger.error({ message: 'Failed to override user data file.' });
    return false;
  }
}

const mapUser = (username: string, user: UserData): string =>
  `${username}|${user.coordinates.lat}|${user.coordinates.lng}|${user.proximityThreshold}|${user.city}`;
