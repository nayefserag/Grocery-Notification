import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class OtpVerificationDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    otp: string;
  }