import {  IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CompleteUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}
