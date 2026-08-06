import { PartialType, OmitType } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ["role"] as const),
) {}

export class UpdateUserStatusDto {
  @ApiPropertyOptional({ description: "Block or unblock the user" })
  @IsBoolean()
  @IsOptional()
  isBlocked: boolean;
}
