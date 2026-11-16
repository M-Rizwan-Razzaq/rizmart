import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { AskChatbotDto } from "./dto/ask-chatbot.dto";
import { ChatbotService } from "./chatbot.service";

@ApiTags("Storefront Chatbot")
@Controller("chatbot")
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post("ask")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Answer a customer question using live store data" })
  ask(@Body() dto: AskChatbotDto, @Req() request: Request) {
    return this.chatbotService.answer(dto, request.ip || "unknown");
  }
}
