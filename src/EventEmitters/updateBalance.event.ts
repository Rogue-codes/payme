import { PAYMENT_TYPE } from 'src/payment/entities/payment.entity';

export class UpdateBalanceEvent {
  constructor(
    public readonly userId: number,
    public readonly txnType: PAYMENT_TYPE,
    public readonly amount: number,
  ) {}
}
