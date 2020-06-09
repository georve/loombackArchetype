import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {TokenServiceBinding} from '../keys';
const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService {

  @inject(TokenServiceBinding.TOKEN_SECRET)
  public readonly jwtsecret: string;

  @inject(TokenServiceBinding.TOKEN_EXPIRES_IN)
  public readonly jwtexpiration: string;

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized('Error generation token');
    }
    let token = '';
    try {
      token = await signAsync(userProfile, this.jwtsecret, {
        expiresIn: this.jwtexpiration
      });
    } catch (err) {
      throw new HttpErrors.Unauthorized('Error generation token');
    }

    return token;
  }

  async verifyToken(token: string): Promise<UserProfile> {
    //throw new Error('method not implemented');
    if (!token) {
      throw new HttpErrors.Unauthorized(`Error verifying token:'token' is null`);
    }

    let userProfile: UserProfile;
    try {
      //decode user profiler from token
      const decryptedToken = await verifyAsync(token, this.jwtsecret);
      userProfile = Object.assign(
        {[securityId]: '', name: '', id: '', email: ''},
        {[securityId]: `${decryptedToken.id}`, name: decryptedToken.name, id: decryptedToken.id, email: decryptedToken.email}
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error verifying tonen: ${error.message}`);
    }


    return userProfile;
  }



}
