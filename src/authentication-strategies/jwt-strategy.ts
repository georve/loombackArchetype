import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {TokenServiceBinding} from '../keys';
import {JWTService} from '../services/jwt-service';


export class JWTStrategy implements AuthenticationStrategy {
  name: string = 'jwt';
  constructor(
    @inject(TokenServiceBinding.TOKEN_SERVICE)
    public jwtService: JWTService,
  ) {}
  async authenticate(
    request: Request,
  ): Promise<UserProfile | undefined> {
    //throw new Error('Method not implemented.');
    const token: string = this.extractCredentials(request);
    const userProfile = await this.jwtService.verifyToken(token);
    return Promise.resolve(userProfile);
  }

  extractCredentials(request: Request): string {
    //throw new Error('Method not implemented.');
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header is missing');

    }

    const authHeaderValue = request.headers.authorization;
    //authorization: Barer xxx.yyy..zz
    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized('Authorization header is not type of Bearer');

    }
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized('Authorization header jas too many parts in its pattern');
    }

    const token = parts[1];
    return token;

  }

}
