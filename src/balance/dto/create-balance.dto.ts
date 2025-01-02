import { IsDecimal, IsNumber } from "class-validator";

export class CreateBalanceDto {
    @IsNumber()
    userId: number;
}