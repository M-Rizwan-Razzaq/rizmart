import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NotificationService } from "../../common/services/notification.service";
import { CreateContactDto } from "./dto/create-contact.dto";

@Injectable()
export class ContactService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
  ) {}

  async sendContactMessage(dto: CreateContactDto): Promise<{ sent: boolean }> {
    const adminEmail =
      this.configService.get<string>("notifications.adminEmail") ||
      this.configService.get<string>("notifications.email.from");

    await this.notificationService.notifyContactSubmission(dto, adminEmail);
    return { sent: true };
  }
}
