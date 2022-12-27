import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OtpController } from './otp/otp.controller';
import { OtpService } from './otp/otp.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.HOST_,
        port: process.env.PORT_,
        auth: {
          user: process.env.USER_,
          pass: process.env.PASS_,
        },
      },
    }),
  ],
  controllers: [AppController, OtpController],
  providers: [AppService, OtpService],
})
export class AppModule {}
