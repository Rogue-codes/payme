import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  IsPositive,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { PAYMENT_TYPE } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsUrl()
  @IsNotEmpty()
  redirect_url: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  narration?: string;

  @IsEnum(PAYMENT_TYPE)
  @IsNotEmpty()
  paymentType: PAYMENT_TYPE.CREDIT;

  @IsNotEmpty()
  pin: number;
}
