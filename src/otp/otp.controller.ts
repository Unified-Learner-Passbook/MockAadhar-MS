import { Body, Controller, Post } from '@nestjs/common';
import { GenerateReqDTO, OtpDTO } from './otp.dto';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('generate')
  generate(@Body() generateReqDTO: GenerateReqDTO) {
    return this.otpService.sendOtp(generateReqDTO);
  }

  @Post('verify')
  verify(@Body() verifyReqDTO: OtpDTO) {
    return this.otpService.verifyOTP(verifyReqDTO);
  }
}
