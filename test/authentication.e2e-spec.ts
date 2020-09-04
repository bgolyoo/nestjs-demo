import { Test } from '@nestjs/testing';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import User from '../src/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationController } from '../src/authentication/authentication.controller';
import { UsersService } from '../src/users/users.service';
import { ConfigService } from '@nestjs/config';
import mockedConfigService from '../src/utils/mocks/config.service';
import mockedJwtService from '../src/utils/mocks/jwt.service';
import { AuthenticationService } from '../src/authentication/authentication.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';

const mockedUser: User = {
  id: 1,
  email: 'user@email.com',
  name: 'John',
  password: 'hash',
  address: {
    id: 1,
    street: 'streetName',
    city: 'cityName',
    country: 'countryName',
    user: undefined
  },
  posts: []
};

describe('AuthenticationController (e2e)', () => {
  let app: INestApplication;
  let userData: User;
  beforeEach(async () => {
    userData = {
      ...mockedUser
    };
    const usersRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockReturnValue(Promise.resolve())
    };

    const module = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService
        },
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository
        }
      ]
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    await app.init();
  });

  describe('when registering', () => {
    describe('and using valid data', () => {
      it('should respond with the data of the user without the password', () => {
        const expectedData = {
          ...userData
        };
        delete expectedData.password;
        delete expectedData.address.user;
        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            email: mockedUser.email,
            name: mockedUser.name,
            password: 'strongPassword'
          })
          .expect(201)
          .expect(expectedData);
      });
    });

    describe('and using invalid data', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            name: mockedUser.name
          })
          .expect(400);
      });
    });
  });
});
