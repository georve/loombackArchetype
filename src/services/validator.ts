import {HttpErrors} from '@loopback/rest';
import * as isEmail from 'isemail';
import {Credentials} from '../repositories/user.repository';


export function validateCredentials(credentials: Credentials) {
  if (!isEmail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('Invalid email');
  }

  if (credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity('password length should ne greater than 8 characters');
  }

  if (credentials.userName == undefined || credentials.userName == null) {
    throw new HttpErrors.UnprocessableEntity('username must be different to null or empty');
  }
}
