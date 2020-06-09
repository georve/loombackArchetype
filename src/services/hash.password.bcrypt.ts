import {inject} from '@loopback/core';
import {compare, genSalt, hash} from 'bcryptjs';
import {PasswordHasherBindings} from '../keys';
export interface PasswordHasher<T = string> {
  hashPassword(password: T): Promise<T>;
  comparedPassword(providedPassword: T, storedPassword: T): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher<string> {
  @inject(PasswordHasherBindings.ROUNDS)
  public readonly round: number
  async hashPassword(password: string) {
    const salt = await genSalt(this.round);
    return await hash(password, salt);
  }

  async comparedPassword(providedPassword: string, storedPassword: string): Promise<boolean> {
    const passwordMatched = await compare(providedPassword, storedPassword);
    return passwordMatched;
  }
}
