import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsEnum,
  IsArray,
  IsObject,
  IsOptional,
  IsBoolean,
  IsMongoId,
  Min,
  MinLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ProductGender,
  ProductMaterial,
  ProductStyle,
} from "../schemas/product.schema";

export class CreateProductDto {
  @ApiProperty({ example: "Aurea Solitaire Ring" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "MongoDB ObjectId of the category" })
  @IsMongoId()
  category: string;

  @ApiProperty({ example: 1290 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ example: 990 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discountPrice?: number;

  @ApiPropertyOptional({ type: [String], example: ["/uploads/ring.jpg"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ enum: ProductGender })
  @IsEnum(ProductGender)
  gender: ProductGender;

  @ApiProperty({ enum: ProductMaterial })
  @IsEnum(ProductMaterial)
  material: ProductMaterial;

  @ApiProperty({ enum: ProductStyle })
  @IsEnum(ProductStyle)
  style: ProductStyle;

  @ApiProperty({ example: "LX-AUREA-001" })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional({
    example: { Metal: "18K Gold", Stone: "0.6ct Diamond" },
  })
  @IsOptional()
  @IsObject()
  specifications?: Record<string, string>;

  @ApiPropertyOptional({ type: [String], example: ["diamond", "gold"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  trending?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  bestSeller?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  newArrival?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
