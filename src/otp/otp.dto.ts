export class OtpDTO {
  email: string;
  otp: string;
}

export class GenerateReqDTO {
  email: string;
}

export class OtpStoreDTO {
  otp: string;
  timestamp: number;
}
