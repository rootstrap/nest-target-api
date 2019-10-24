
import { Test } from '@nestjs/testing'
import { AuthController } from '../auth.controller'
import { AuthService } from '../auth.service'
import { UsersService } from '../../users/users.service'
import UserDto from '../../dto/user.dto'
import { User } from '../../users/user.entity'
import { mockAuthService, mockUsersService } from './mocks'

describe('AuthController', () => {
  let authController: AuthController
  let authService: AuthService
  let usersService: UsersService

  beforeAll(async () => {
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
        },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    usersService = module.get<UsersService>(UsersService)
    authController = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(authController).toBeDefined()
  })

  describe('login', () => {
    it('should call authService.login', async () => {
      const user = { user: 'user' }
      const authServiceLogin = jest.spyOn(authService, 'login')
      await authController.login({ user })

      expect(authServiceLogin).toHaveBeenCalledWith(user)
    })
  })

  describe('signup', () => {
    const mockUser = new User('user@example.com', 'password')
    mockUser.id = 1
    const userDto = new UserDto(mockUser)
    let user
    let usersServiceCreate

    beforeAll(async () => {
      usersServiceCreate = jest.spyOn(usersService, 'create').mockImplementation(async () => mockUser)
      user = await authController.signup(mockUser)
    })

    it('should call usersService.create', async () => {
      expect(usersServiceCreate).toHaveBeenCalledWith(mockUser.email, mockUser.password)
    })

    it('should return a user DTO', async () => {
      expect(user).toEqual(userDto)
    })
  })
})
