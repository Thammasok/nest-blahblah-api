import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { ConfigService } from '@nestjs/config';

const jwtToken = 'jwtToken';

const mockAuthService = {
  signup: jest.fn().mockResolvedValueOnce(jwtToken),
  signin: jest.fn().mockResolvedValueOnce(jwtToken),
  signToken: jest.fn().mockResolvedValueOnce(jwtToken),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        JwtStrategy,
        ConfigService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('signUp', () => {
  //   it('should register a new user', async () => {
  //     const signUpDto = {
  //       email: 'ghulam1@gmail.com',
  //       password: '12345678',
  //     };

  //     const result = await controller.signup(signUpDto);

  //     expect(service.signup).toHaveBeenCalled();
  //     expect(result).toEqual(jwtToken);
  //   });
  // });
});
