// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository, Filter} from '@loopback/repository';
import {get, getJsonSchemaRef, post, requestBody, getModelSchemaRef, param} from '@loopback/rest';
import * as _ from 'lodash';
import {TokenServiceBinding} from '../keys';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories';
import {Credentials} from '../repositories/user.repository';
import {BcryptHasher} from '../services/hash.password.bcrypt';
import {JWTService} from '../services/jwt-service';
import {LoginUserService} from '../services/user-service';
import {validateCredentials} from '../services/validator';
import {CredentialsRequestBody} from './specs/user.controller.spec';



export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('service.hasher')
    public hasher: BcryptHasher,
    @inject('user.service')
    public userService: LoginUserService,
    @inject(TokenServiceBinding.TOKEN_SERVICE)
    public jwt: JWTService
  ) {}

  @post('/users/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchemaRef(User),
        },
      },
    },
  })
  async signup(@requestBody() userData: User) {
    validateCredentials(_.pick(userData, ['email', 'password', 'userName']));
    userData.password = await this.hasher.hashPassword(userData.password)
    const savedUser = await this.userRepository.create(userData);
    delete savedUser.password;
    return savedUser;
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },

        },
      },
    },
  })
  async login(@requestBody(CredentialsRequestBody) credentials: Credentials): Promise<{token: string}> {
    console.log(credentials);
    const user = await this.userService.verifyCredentials(credentials);
    console.log(user);
    const userProfiler = this.userService.convertToUserProfile(user);
    const token = await this.jwt.generateToken(userProfiler);
    return Promise.resolve({token: token});
  }

  @get('/users/me')
  @authenticate('jwt')
  async me(): Promise<string> {
    return Promise.resolve('Hola mundo');
  }

  @get('/users/users', {
    responses: {
      '200': {
        description: 'Array of Users model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

}
