import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { RegisterUserDto, LoginUserDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { RpcCustomExceptionFilter } from 'src/common/exceptions/rpc-custom-exception.filter';

@Injectable()
export class AuthService {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    try {
      const res = await firstValueFrom(
        this.natsClient.send('auth.register.user', registerUserDto),
      );
      return res;
    } catch (error) {
      throw new RpcCustomExceptionFilter();
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const res = await firstValueFrom(
        this.natsClient.send('auth.login.user', loginUserDto),
      );
      return res;
    } catch (error) {
      throw new RpcCustomExceptionFilter();
    }
  }

  async verifyToken(token: string) {
    try {
      const res = await firstValueFrom(
        this.natsClient.send('auth.verify.token', { token }),
      );
      return res;
    } catch (error) {
      throw new RpcCustomExceptionFilter();
    }
  }
}
