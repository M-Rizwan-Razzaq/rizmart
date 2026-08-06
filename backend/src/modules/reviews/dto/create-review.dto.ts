import {
  IsMongoId,
  IsInt,
  IsString,
  Min,
  Max,
  Length,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateReviewDto {
  @ApiProperty({ description: "Product MongoDB ObjectId" })
  @IsMongoId()
  productId: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @ApiProperty({
    example: "Absolutely stunning quality, exceeded expectations.",
  })
  @IsString()
  @Length(10, 500)
  comment: string;

  @ApiProperty({
    example: "Verified Buyer",
    required: false,
    description: "Optional public display name for the review",
  })
  @IsOptional()
  @IsString()
  @Length(2, 60)
  displayName?: string;
}

export class UpdateReviewDto {
  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @ApiProperty()
  @IsString()
  @Length(10, 500)
  comment: string;

  @ApiProperty({
    example: "Verified Buyer",
    required: false,
    description: "Optional public display name for the review",
  })
  @IsOptional()
  @IsString()
  @Length(2, 60)
  displayName?: string;
}
