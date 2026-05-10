import {
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  IsUrl,
  Min,
  Max,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsString()
  major?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(14)
  semester?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsUrl()
  portfolio_url?: string;
}