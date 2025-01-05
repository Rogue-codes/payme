import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  // @Post()
  // create(@Body() createBalanceDto: CreateBalanceDto) {
  //   return this.balanceService.create(createBalanceDto);
  // }

  // @Get()
  // findAll() {
  //   return this.balanceService.findAll();
  // }
}
