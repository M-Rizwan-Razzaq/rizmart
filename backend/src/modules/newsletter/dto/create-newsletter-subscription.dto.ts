import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateNewsletterSubscriptionDto {
  @ApiProperty({ example: "subscriber@example.com" })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
