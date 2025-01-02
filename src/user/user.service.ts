import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ConfirmEmailDto,
  CreateUserDto,
  VerifyOTPDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTP, User } from './entities/user.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { GenerateOtpEvent } from 'src/EventEmitters/generateOtp.event';
import { genOtp } from 'src/helpers/genOtp';
import { MailService } from 'src/email/email.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SendWelcomeMailEvent } from 'src/EventEmitters/userEvents';
import * as bcrypt from 'bcrypt';
import { GenerateBalanceEvent } from 'src/EventEmitters/generateBalanceEvent';
import { BalanceService } from 'src/balance/balance.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
    private readonly eventEmitter: EventEmitter2,
    private readonly emailService: MailService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly balanceService: BalanceService,
  ) {}
  async confirmEmail(payload: ConfirmEmailDto): Promise<string> {
    const { email } = payload;

    // Check if the email already exists
    const alreadyExistingEmail = await this.userRepository.findOne({
      where: { email },
    });

    if (alreadyExistingEmail) {
      throw new ConflictException(`email: ${email} already exists`);
    }

    const alreadyExistingOtp = await this.otpRepository.findOne({
      where: {
        email,
      },
    });

    if (alreadyExistingOtp) {
      throw new ConflictException(
        `A One time password has already been sent to ${email}, use it to verify your email.`,
      );
    }

    // Emit an event to generate OTP after ensuring the user is saved
    this.eventEmitter.emit('generateOtpEvent', new GenerateOtpEvent(email));

    return `OTP has been sent to email: ${email}`;
  }

  async verifyOtp(payload: VerifyOTPDto): Promise<string> {
    const { email, code } = payload;

    // Check if the email exists in the OTP repository
    const validUser = await this.otpRepository.findOne({ where: { email } });

    if (!validUser) {
      throw new BadRequestException(
        'No OTP found for this email. Please request a new OTP.',
      );
    }

    // Validate the OTP
    const isCodeValid = await bcrypt.compare(code, validUser.otp);
    if (!isCodeValid) {
      throw new BadRequestException('Invalid OTP. Please try again.');
    }

    // Check if the OTP has expired
    if (new Date() > new Date(validUser.tokenExpiresIn)) {
      throw new BadRequestException(
        'OTP has expired. Please request a new one.',
      );
    }

    // Cache the verified email for future use
    await this.cacheManager.set(`verified_email_${email}`, email);

    // Remove the OTP entry from the repository
    await this.otpRepository.delete(validUser.Id);

    return 'Email verified successfully. Proceed to create your account.';
  }

  async saveRefreshToken (email:string, token:string) {
    const user = await this.userRepository.findOne({
      where:{
        email
      }
    })

    if(!user){
      throw new NotFoundException()
    }

    user.refreshToken = await bcrypt.hash(token,10);
    await this.userRepository.save(user);
  }

  async isRefreshTokenValid (email:string,token:string){
    const user = await this.userRepository.findOne({
      where:{
        email
      }
    })

    return await bcrypt.compare(token, user.refreshToken)
  }

  async resendOtp(email: string): Promise<string> {
    console.log('email:', email);
    // Check if the email exists in the OTP repository
    const otpUser = await this.otpRepository.findOne({
      where: {
        email,
      },
    });

    if (!otpUser) {
      throw new BadRequestException(
        'No OTP found for this email. Please request a new OTP.',
      );
    }

    // Generate a new OTP and hash it
    const otp = genOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Update the OTP and expiration time
    otpUser.otp = hashedOtp;
    otpUser.tokenExpiresIn = new Date(Date.now() + 3600000); // 1 hour from now

    // Save the updated OTP entry
    await this.otpRepository.save(otpUser);

    // Send the OTP via email
    await this.emailService.sendVerifyEmail(email, otp);

    return 'A new OTP has been sent to your email.';
  }

  async getCache() {
    const keys = await this.cacheManager.store.keys();
    const result = await Promise.all(
      keys.map(async (key) => {
        const value = await this.cacheManager.get(key);
        return { key, value };
      }),
    );
    return result;
  }

  async create(createUserDto: CreateUserDto) {
    // check cache to know if email has been verified
    const verifiedEmail = await this.cacheManager.get(
      `verified_email_${createUserDto.email}`,
    );

    if (!verifiedEmail) {
      throw new UnauthorizedException(
        `email: ${createUserDto.email} has not been verified`,
      );
    }

    const alreadyExistingEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (alreadyExistingEmail) {
      throw new ConflictException(
        `email: ${createUserDto.email} already exists}`,
      );
    }

    const alreadyExistingPhone = await this.userRepository.findOne({
      where: {
        phone: createUserDto.phone,
      },
    });

    if (alreadyExistingPhone) {
      throw new ConflictException(
        `phone: ${createUserDto.phone} already exists}`,
      );
    }

    // hashPassword
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const hashedTransactionPin = await bcrypt.hash(
      createUserDto.transactionPin,
      10,
    );

    const newUser = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      transactionPin: hashedTransactionPin,
      isActive: true,
      isVerified: true,
    });

    await this.userRepository.save(newUser);

    // delete cached email
    // await this.cacheManager.del(`email_${createUserDto.email}`);

    this.eventEmitter.emit('createBalance', new GenerateBalanceEvent(newUser));

    this.eventEmitter.emit(
      'sendUserCreatedEmail',
      new SendWelcomeMailEvent(newUser),
    );

    return newUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(email: string) {
    const user = await this.userRepository.findOne({
      where:{
        email
      }
    })

    return user
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  @OnEvent('generateOtpEvent')
  async generateOtp(payload: GenerateOtpEvent) {
    const { email } = payload;
    const otp = genOtp();

    const hashedOtp = await bcrypt.hash(otp, 10);

    const otp_ = this.otpRepository.create({
      email,
      otp: hashedOtp,
      tokenExpiresIn: new Date(Date.now() + 3600000),
    });

    await this.otpRepository.save(otp_);

    await this.emailService.sendVerifyEmail(email, otp);
  }

  @OnEvent('sendUserCreatedEmail')
  async sendUserCreatedEmail(payload: SendWelcomeMailEvent) {
    const { user } = payload;

    await this.emailService.sendWelcomeMail(user);
  }

  @OnEvent('createBalance')
  async createBalance(payload: GenerateBalanceEvent) {
    const { user } = payload;

    await this.balanceService.create({
      userId: user.id,
    });
  }
}
