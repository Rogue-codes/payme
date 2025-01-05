import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import axios from 'axios';
import { genTxnRef } from 'src/helpers/genTxnRef';
import {
  PAYMENT_STATUS,
  PAYMENT_TYPE,
  Payment,
} from './entities/payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceService } from 'src/balance/balance.service';
import { ChargeCompletedDto } from './dto/web-hook.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UpdateBalanceEvent } from 'src/EventEmitters/UpdateBalance.event';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    private readonly userUserService: UserService,

    private readonly balanceService: BalanceService,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  async fundAccount(user: any, data: CreatePaymentDto) {
    try {
      const txnReference = genTxnRef();

      const user_ = await this.userUserService.findOne(user.email);

      if (!user_) {
        throw new NotFoundException();
      }

      const isPinValid = await bcrypt.compare(
        data.pin.toString(),
        user_.transactionPin,
      );

      if (!isPinValid) {
        throw new UnauthorizedException('Invalid Pin');
      }

      const newPayment = await this.paymentRepository.create({
        amount: data.amount,
        narration: data.narration,
        paymentRef: txnReference,
        paymentType: data.paymentType,
        userId: user.id,
      });

      await this.paymentRepository.save(newPayment);

      const response = await axios.post(
        `${process.env.FLUTTERWAVE_BASE_URL}/payments`,
        {
          tx_ref: txnReference,
          amount: data.amount,
          currency: data.currency,
          redirect_url: data.redirect_url,
          customer: {
            email: user.email,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log('error', error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async handlePaymentWebhook(
    dto: ChargeCompletedDto,
    signature: string,
  ): Promise<boolean> {
    try {
      console.log('dto', dto);
      if (!dto) {
        return false;
      }

      if (!signature) {
        throw new ForbiddenException();
      }

      if (signature !== process.env.FLUTTERWAVE_HASH) {
        throw new ForbiddenException('Error validating signature');
      }

      const transaction = await this.paymentRepository.findOneBy({
        paymentRef: dto.txRef,
      });
      if (!transaction) {
        return false;
      }

      const paymentConfirmed = dto.status === 'successful';
      if (paymentConfirmed) {
        transaction.status = PAYMENT_STATUS.SUCCESSFUL;
        await this.paymentRepository.save(transaction);

        this.eventEmitter.emit(
          'update.balance',
          new UpdateBalanceEvent(
            transaction.userId,
            transaction.paymentType,
            dto.amount,
          ),
        );

        if (transaction.paymentType === 'CR') {
          await this.balanceService.creditAccount(
            transaction.userId,
            transaction.amount,
          );
        }
      } else {
        transaction.status = PAYMENT_STATUS.FAILED;
      }
      return true;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }

  @OnEvent('update.balance')
  async handleBalance(payload: UpdateBalanceEvent) {
    if (payload.txnType === PAYMENT_TYPE.CREDIT) {
      await this.balanceService.creditAccount(payload.userId, payload.amount);
    }

    if (payload.txnType === PAYMENT_TYPE.DEBIT) {
      await this.balanceService.debitAccount(payload.userId, payload.amount);
    }
  }
}
