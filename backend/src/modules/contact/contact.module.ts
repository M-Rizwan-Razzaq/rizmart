import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";
import { NotificationService } from "../../common/services/notification.service";

@Module({
  imports: [ConfigModule],
  controllers: [ContactController],
  providers: [ContactService, NotificationService],
})
export class ContactModule {}
