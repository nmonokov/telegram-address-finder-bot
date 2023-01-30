import fs from 'fs';
import { logger } from '../utils/logger';
import { RegisteredUser } from '../models';

const usersFolderPath = 'users';
const usersFilePath = `${usersFolderPath}/data.txt`;

/**
 * Reads user file. Usually done on the application start up. Creates folder with file if non existent.
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

const createFileIfNotExists = () => {
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
export const persistUser = (username: string, user: RegisteredUser) => {
  try {
    const userToPersist =
      `${username}|${user.coordinates.lat}|${user.coordinates.lng}|${user.proximityThreshold}|${user.city}`;
    fs.appendFileSync(usersFilePath, userToPersist + '\n');
    logger.debug(`User ${username} has been written to ${usersFilePath}`);
  } catch (error) {
    logger.error({ message: 'Failed to persist user.', error });
  }
};
