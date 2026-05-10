import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export enum UserRole {
  STUDENT = 'mahasiswa',
  BUSINESS = 'bisnis',
  ADMIN = 'admin',
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;

  @IsEnum(UserRole, { message: 'Role harus: mahasiswa, bisnis, atau admin' })
  role: UserRole;
}