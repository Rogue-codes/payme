import { IsEmail, IsEnum, IsNotEmpty, IsString, Length, Matches } from "class-validator";
enum KYC_STATUS  {
    VERIFIED = 'verified',
    NOT_VERIFIED = 'not verified',
}
export class CreateUserDto {
    @IsString()
    @Length(0, 50)
    firstName: string;
  
    @IsString()
    @Length(0, 50)
    lastName: string;
  
    @IsString()
    @Length(0, 50)
    stateOfOrigin: string;
  
    @IsString()
    @Length(0, 100)
    lga: string;
  
    @IsString()
    @IsNotEmpty()
    phone: string;
  
    @IsString()
    @Length(0, 150)
    homeAddress: string;
  
    @IsString()
    @Length(0, 4)
    transactionPin: string; 

    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsNotEmpty()
    @Length(6, 20)
    @Matches(/[a-z]/, {
      message: 'Password must contain at least one lowercase character',
    })
    @Matches(/[A-Z]/, {
      message: 'Password must contain at least one uppercase character',
    })
    @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
    @Matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
      message: 'Password must contain at least one special character',
    })
    password: string;

    @IsNotEmpty()
    @IsEnum(KYC_STATUS)
    kycStatus: KYC_STATUS
}

export class ConfirmEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class VerifyOTPDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;


    @IsNotEmpty()
    @IsString()
    code:string
}
