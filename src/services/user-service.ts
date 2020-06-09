import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories/user.repository';
import {BcryptHasher} from './hash.password.bcrypt';


export class LoginUserService implements UserService<User, Credentials>{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('service.hasher')
    public hasher: BcryptHasher
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    // throw new Error('method not implemented');
    const foundUser = await this.userRepository.findOne({
      where: {
        userName: credentials.userName,
      },
    });
    if (!foundUser) {
      throw new HttpErrors.NotFound(`User not found with this ${credentials.userName}`)
    }
    const passwordMatched = await this.hasher.comparedPassword(credentials.password, foundUser.password);
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Password invalid');
    }

    return foundUser;
  }
  convertToUserProfile(user: User): UserProfile {
    // paridera de dos dias y no hay documentacion
    return {
      [securityId]: `${user.id}`,
      name: user.userName,
      id: user.id,
      email: user.email,
    };
  }
}
