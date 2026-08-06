import {
  Injectable,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { OrdersService } from "../orders/orders.service";
import { RegisterDto } from "./dto/register.dto";
import { Role } from "../users/schemas/user.schema";
import { NotificationService } from "../../common/services/notification.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException("Email is already registered");
    }

    const user = await this.usersService.create({
      ...dto,
      role: Role.CUSTOMER,
    });

    // Claim any guest orders placed with this email before the account existed
    await this.ordersService.claimGuestOrders(dto.email, user._id.toString());

    await this.notificationService.notifyUserWelcome({
      name: user.name,
      email: user.email,
    });

    const token = this.signToken(user);
    return { token, user: this.sanitize(user) };
  }

  async login(user: any) {
    await this.notificationService.notifyUserLogin({
      name: user.name,
      email: user.email,
    });

    const token = this.signToken(user);
    return { token, user: this.sanitize(user) };
  }

  async getProfile(userId: string) {
    return this.usersService.findById(userId);
  }

  async forgotPassword(
    email: string,
  ): Promise<{ message: string; resetUrl?: string }> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(normalizedEmail);

    if (!user) {
      return { message: "If an account exists, a reset link has been sent." };
    }

    const token = await this.jwtService.signAsync(
      {
        sub: user._id.toString(),
        email: user.email,
        purpose: "password-reset",
      },
      {
        secret: this.configService.get<string>("resetTokenSecret"),
        expiresIn: this.configService.get<string>("resetTokenExpiresIn"),
      },
    );

    const appUrl =
      this.configService.get<string>("appUrl") ?? "http://localhost:5173";
    const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;

    await this.notificationService.notifyPasswordResetLink({
      name: user.name,
      email: user.email,
      resetUrl,
    });

    return {
      message: "If an account exists, a reset link has been sent.",
      ...(process.env.NODE_ENV !== "production" ? { resetUrl } : {}),
    };
  }

  async resetPassword(
    token: string,
    password: string,
  ): Promise<{ message: string }> {
    let payload: { sub?: string; email?: string; purpose?: string };

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>("resetTokenSecret"),
      });
    } catch {
      throw new BadRequestException("Invalid or expired reset token");
    }

    if (payload.purpose !== "password-reset" || !payload.sub) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    await this.usersService.update(payload.sub, { password } as any);
    return { message: "Password reset successfully" };
  }

  private signToken(user: any): string {
    const payload = {
      sub: user._id?.toString() ?? user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private sanitize(user: any) {
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.password;
    return obj;
  }
}
