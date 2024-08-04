import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should validate and return a user', async () => {
    const loginUserDto = { username: 'testuser', password: 'testpassword' };
    const user = {
      username: 'testuser',
      password: await bcrypt.hash('testpassword', 10),
    } as User;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    const result = await service.validateUser(loginUserDto);
    expect(result?.username).toEqual(user.username);
  });

  it('should blacklist a token', () => {
    const token = 'token';
    service.addToBlackList(token);
    expect(service.isTokenBlackListed(token)).toBeTruthy();
  });

  it('should return null for invalid credentials', async () => {
    const loginUserDto = { username: 'testuser', password: 'wrongpassword' };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    const result = service.validateUser(loginUserDto);
    await expect(result).rejects.toBeInstanceOf(NotFoundException);
  });
});
