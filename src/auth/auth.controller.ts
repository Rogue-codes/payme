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
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Response } from 'express';
import { RefreshTokenGuard } from 'src/guard/refresh-token/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(loginDto);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refreshToken(@Res() res:Response, @Req() req) {
    try {
      const token = await this.authService.generateNewAccessToken(req.user)
      return res.status(200).json({
        success:true,
        message:"token generated",
        data:token
      })
    } catch (error) {
      console.log(error)
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
