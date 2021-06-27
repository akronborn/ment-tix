import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Secret {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedSecret: string, suppliedSecret: string) {
    const [hashedSecret, salt] = storedSecret.split('.');
    const buf = (await scryptAsync(suppliedSecret, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedSecret;
  }
}
