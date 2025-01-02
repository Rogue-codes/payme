import { User } from "src/user/entities/user.entity";

export class SendWelcomeMailEvent {
    constructor(
        public readonly user: User
    ){}
}