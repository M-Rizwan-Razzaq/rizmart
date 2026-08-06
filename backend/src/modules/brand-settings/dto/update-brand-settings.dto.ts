import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateBrandSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  appName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  atelier?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  homeMainImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  homeCategoryImageRings?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  homeCategoryImageNecklaces?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  homeCategoryImageBraceletes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  homeCategoryImageEarrings?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutUsImage?: string;
}
