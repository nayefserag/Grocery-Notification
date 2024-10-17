import * as bcrypt from 'bcryptjs';
import { config } from '../module/config-module/config.service';

/**
 * Hash a plaintext password using bcrypt.
 * @param password The plaintext password to hash.
 * @returns A promise that resolves with the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(config.getNumber('SALT_ROUNDS'));
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plaintext password with a hashed password.
 * @param password The plaintext password to compare.
 * @param hashedPassword The hashed password to compare against.
 * @returns A boolean indicating whether the passwords match.
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
