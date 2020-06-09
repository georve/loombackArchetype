import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {User} from './models/user.model';
import {Credentials} from './repositories/user.repository';
import {PasswordHasher} from './services/hash.password.bcrypt';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = '132asda8213';
  export const TOKEN_EXPIRES_IN_VALUE = '7h';

}

export namespace PasswordHasherConstants {
  export const PASSWORD_ROUND_VALUE = 10;
}

export namespace TokenServiceBinding {
  export const TOKEN_SECRET = BindingKey.create<string>
    ('authentication.jwt.secret');


  export const TOKEN_EXPIRES_IN = BindingKey.create<string>
    ('authentication.jwt.expiresIn');


  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'user.service.jwt',
  );


};

export namespace PasswordHasherBindings {

  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>
    ('service.hasher');

  export const ROUNDS = BindingKey.create<number>
    ('rounds');

};

export namespace UserServiceBindings {

  export const USER_SERVICE = BindingKey.create<UserService<Credentials, User>>
    ('user.service');


}
