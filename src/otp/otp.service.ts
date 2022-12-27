import { SentMessageInfo } from 'nodemailer';
import { MailerService } from '@nestjs-modules/mailer';
import { GenerateReqDTO, OtpDTO, OtpStoreDTO } from './otp.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  constructor(private mailService: MailerService) {}

  private readonly otpLength: number = 4;
  private readonly otpCharSpace: string = '0123456789';
  private readonly expiryLimit: number = 5 * 60 * 1000;

  private otps: Record<string, OtpStoreDTO> = {};

  async sendOtp(generateReqDTO: GenerateReqDTO): Promise<SentMessageInfo> {
    // check if required fields are available
    if (!generateReqDTO.email) throw new BadRequestException();

    let newOTP = '';
    for (let i = 0; i < this.otpLength; i++)
      newOTP += this.otpCharSpace.charAt(
        Math.floor(Math.random() * this.otpCharSpace.length),
      );

    // store this OTP with the current date time as timestamp
    this.otps[generateReqDTO.email] = {
      otp: newOTP,
      timestamp: new Date().getTime(),
    };

    // form the mailData to be sent via nodemailer
    const mailData = {
      to: generateReqDTO.email,
      from: 'mock.aadhar@gmail.com',
      subject: 'OTP For Aadhar KYC',
      text: newOTP,
    };

    // wait for the response and return it
    const response = await this.mailService.sendMail(mailData);

    if (response.accepted[0] === generateReqDTO.email) {
      const responseObj = {
        status: 200,
        message: 'OTP Generated Succesfully',
      };
      return responseObj;
    } else {
      const responseObj = {
        status: 500,
        message: 'Something Went Wrong',
      };

      // possibility of shifting this to the graylog based logging system
      console.log(response);
      return responseObj;
    }
  }

  async verifyOTP(otpDTO: OtpDTO): Promise<any> {
    // check if required fields are available
    if (!otpDTO.email || !otpDTO.otp) throw new BadRequestException();

    return new Promise((resolve, reject) => {
      if (
        this.otps[otpDTO.email].otp == otpDTO.otp &&
        this.otps[otpDTO.email].timestamp + this.expiryLimit >=
          new Date().getTime()
      ) {
        const responseObj = {
          status: 200,
          verified: true,
          message: 'OTP was successfully verified !',
        };
        resolve(responseObj);
      } else {
        const responseObj = {
          status: 400,
          verified: false,
          message: 'Oops ! Try generating a new OTP.',
          data: 'The OTP Could Not Be Verified',
        };
        resolve(responseObj);
      }
    });
  }
}
