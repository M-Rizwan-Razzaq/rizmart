import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SendPromotionDto {
  @ApiProperty({ example: "Weekend Gold Drop" })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  subject: string;

  @ApiProperty({ example: "Enjoy 15% off selected jewelry this weekend." })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  message: string;
}
