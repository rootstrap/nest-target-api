
import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import UserDto from '../../users/dto/user.dto';
import { User } from '../../users/user.entity'


describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  const mockAuthService = {
    login: () => { },
  };

  const mockUsersService = {
    create: () => { },
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login', async () => {
      const user = { user: 'user' };
      const authServiceLogin = jest.spyOn(authService, 'login');
      await authController.login({ user });

      expect(authServiceLogin).toHaveBeenCalledWith(user);
    });
  });

  describe('signup', () => {
    it('should call usersService.create and return a UserDto', async () => {
      const mockUser = new User('user@example.com', 'password');
      const userDto = new UserDto(mockUser);

      const usersServiceCreate = jest.spyOn(usersService, 'create').mockImplementation(async () => mockUser);
      const user = await authController.signup(mockUser);

      expect(usersServiceCreate).toHaveBeenCalledWith(mockUser.email, mockUser.password);
      expect(user).toEqual(userDto);
    });
  });
});
