import { User } from "src/user/entities/user.entity";

export class GenerateBalanceEvent {
    constructor(
        public user: User
    ){}
}