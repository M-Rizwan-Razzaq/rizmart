import { Module } from "@nestjs/common";
import { ProductsModule } from "../products/products.module";
import { SiteContentModule } from "../site-content/site-content.module";
import { ChatbotController } from "./chatbot.controller";
import { ChatbotService } from "./chatbot.service";

@Module({
  imports: [ProductsModule, SiteContentModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
