import { IsString, IsOptional, IsEmail, MinLength, MaxLength, IsNumber } from 'class-validator';

import { BaseDto } from './base.dto';

export class CreateTeamMemberDto extends BaseDto {
  @IsString()
  @MaxLength(50)
  lastName!: string;

  @IsString()
  @MaxLength(50)
  firstName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsEmail()
  @MaxLength(150)
  mail!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  image?: string = 'default';
}

export class UpdateTeamMemberDto extends BaseDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  mail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  image?: string;
}

export class LoginDto {
  @IsEmail()
  mail!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}

export class TeamMemberQueryDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  count?: number;

  @IsOptional()
  @IsString()
  needle?: string;
}
