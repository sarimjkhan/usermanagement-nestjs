import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should register a new user', async () => {
    const createUserDto = { username: 'testuser', password: 'testpassword' };
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(userRepository, 'create').mockReturnValue({
      ...createUserDto,
      password: hashedPassword,
    } as User);

    jest.spyOn(userRepository, 'save').mockResolvedValue({
      id: 1,
      username: 'testuser',
      password: hashedPassword,
    } as User);

    const result = await service.register(createUserDto);
    expect(result.username).toEqual(createUserDto.username);
    expect(result.password).toEqual(hashedPassword);
  });

  it('should update the user profile', async () => {
    const userId = 1;
    const updateProfileDto = { username: 'newtestuser' };
    const user = {
      id: userId,
      username: 'testuser',
      password: 'testpassword',
    } as User;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
    jest.spyOn(userRepository, 'save').mockResolvedValue({
      ...user,
      username: updateProfileDto.username,
    });

    const result = await service.updateProfile(userId, updateProfileDto);
    expect(result.username).toEqual(updateProfileDto.username);
  });
});
