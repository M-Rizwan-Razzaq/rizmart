import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ProductGender,
  ProductMaterial,
  ProductStyle,
} from "../schemas/product.schema";

export enum SortBy {
  PRICE_ASC = "price_asc",
  PRICE_DESC = "price_desc",
  RATING = "rating",
  NEWEST = "newest",
  POPULAR = "popular",
}

export class ProductQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 12;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: "Category id or slug" })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: ProductGender })
  @IsOptional()
  @IsEnum(ProductGender)
  gender?: ProductGender;

  @ApiPropertyOptional({ enum: ProductMaterial })
  @IsOptional()
  @IsEnum(ProductMaterial)
  material?: ProductMaterial;

  @ApiPropertyOptional({ enum: ProductStyle })
  @IsOptional()
  @IsEnum(ProductStyle)
  style?: ProductStyle;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  trending?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  bestSeller?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  newArrival?: boolean;

  @ApiPropertyOptional({
    default: false,
    description: "Include inactive products in the response",
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  includeInactive?: boolean;

  @ApiPropertyOptional({ enum: SortBy, default: SortBy.NEWEST })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.NEWEST;
}
