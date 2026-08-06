import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import * as bcrypt from "bcrypt";
import { UsersService } from "../../users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (user.isBlocked) {
      throw new UnauthorizedException("Your account has been blocked");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid email or password");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...result } = user.toObject ? user.toObject() : user;
    return result;
  }
}
