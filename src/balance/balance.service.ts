import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Balance } from './entities/balance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
  ) {}
  async create(createBalanceDto: CreateBalanceDto) {
    const newBalance = await this.balanceRepository.create(createBalanceDto);
    await this.balanceRepository.save(newBalance);
  }

  async creditAccount(userId: number, amount: number) {
    const account = await this.balanceRepository.findOne({
      where: { userId: userId },
    });

    if (!account) {
      throw new NotFoundException();
    }

    console.log('amount', amount);

    // Ensure both are numbers
    account.amount =
      parseFloat(account.amount.toString()) + parseFloat(amount.toString());

    await this.balanceRepository.save(account);

    return 'account funded successfully';
  }

  async debitAccount(userId: number, amount: number) {
    const account = await this.balanceRepository.findOne({
      where: {
        userId: userId,
      },
    });

    if (!account) {
      throw new NotFoundException();
    }

    account.amount -= amount;

    await this.balanceRepository.save(account);

    return 'account funded successfully';
  }

  async getBalance(id: number) {
    const account = await this.balanceRepository.findOne({
      where: {
        userId: id,
      },
    });

    if (!account) {
      throw new NotFoundException();
    }

    return account.amount

  }

  update(id: number, updateBalanceDto: UpdateBalanceDto) {
    return `This action updates a #${id} balance`;
  }

  remove(id: number) {
    return `This action removes a #${id} balance`;
  }
}
