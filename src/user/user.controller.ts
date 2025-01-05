import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ConfirmEmailDto,
  CreateUserDto,
  VerifyOTPDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { getAllStates, getLocalGovernments } from 'src/helpers/statesApi';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('confirm-email')
  async confirmEmail(
    @Body() confirmEmailDto: ConfirmEmailDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.userService.confirmEmail(confirmEmailDto);
      return res.status(200).json({
        success: true,
        message: result,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOTPDto, @Res() res: Response) {
    try {
      const result = await this.userService.verifyOtp(verifyOtpDto);
      return res.status(200).json({
        success: true,
        message: result,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Post('resend-otp/:id')
  async resendOtp(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.userService.resendOtp(id);
      return res.status(200).json({
        success: true,
        message: result,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('cache')
  async cache() {
    const data = await this.userService.getCache();
    return data;
  }

  @Get('states/all')
  async findAllStates(@Res() res: Response) {
    try {
      const states = await getAllStates();
      return res.status(200).json({
        success: true,
        message: 'All states retrieved successfully',
        data: states,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Get('state/:id')
  async findLga(@Param('id') id: string, @Res() res: Response) {
    try {
      const lgas = await getLocalGovernments(id);
      return res.status(200).json({
        success: true,
        message: 'All states retrieved successfully',
        data: lgas,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Get('balance')
  async getBalance(@Res() res: Response, @Req() req) {
    try {
      const balance = await this.userService.getAccountBalance(req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Account balance retrieved successfully',
        data: balance,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
