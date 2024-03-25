import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { RegisterUserDto, LoginUserDto } from './dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    try {
      const res = await firstValueFrom(
        this.natsClient.send('auth.register.user', registerUserDto),
      );
      return res;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const res = await firstValueFrom(
        this.natsClient.send('auth.login.user', loginUserDto),
      );
      return res;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async verifyToken(token: string) {
    try {
      const res = await firstValueFrom(
        this.natsClient.send('auth.verify.token', { token }),
      );
      return res;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
