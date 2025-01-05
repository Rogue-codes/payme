import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Request, Response } from 'express';
import { UserGuard } from 'src/guard/user-guard/user-guard.guard';
import { ChargeCompletedDto } from './dto/web-hook.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(UserGuard)
  @Post('initialize')
  async initiate(
    @Body() createPaymentDto: CreatePaymentDto,
    @Res() res: Response,
    @Req() req,
  ) {
    try {
      const result = await this.paymentService.initializePayment(
        req.user,
        createPaymentDto,
      );
      return res.status(200).json({
        success: true,
        message: 'Payment initialized successfully',
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

  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  async paymentWebhookHandler(
    @Body() dto: ChargeCompletedDto,
    @Headers() headers = {},
  ) {
    try {
      const result = await this.paymentService.handlePaymentWebhook(
      dto,
      `${headers[process.env.FLUTTERWAVE_WEBHOOK_SIGNATURE_KEY]}`,
    );

    // if (!result) {
    //   throw new BadRequestException();
    // }
    } catch (error) {
      console.log(error)
    }
    
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
