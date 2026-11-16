import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class ChatbotHistoryMessageDto {
  @IsIn(["user", "assistant"])
  role: "user" | "assistant";

  @IsString()
  @MaxLength(500)
  content: string;
}

export class AskChatbotDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  question: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @ValidateNested({ each: true })
  @Type(() => ChatbotHistoryMessageDto)
  history?: ChatbotHistoryMessageDto[];
}
