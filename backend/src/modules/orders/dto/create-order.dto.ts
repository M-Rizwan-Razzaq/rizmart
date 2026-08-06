import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsArray,
  IsOptional,
  IsEmail,
  IsMongoId,
  ValidateNested,
  ArrayMinSize,
  Min,
  IsObject,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class OrderItemDto {
  @ApiProperty({ description: "Product MongoDB ObjectId" })
  @IsMongoId()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  qty: number;
}

export class ShippingAddressDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() firstName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() lastName?: string;
  @ApiProperty() @IsString() @IsNotEmpty() address: string;
  @ApiProperty() @IsString() @IsNotEmpty() city: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() state?: string;
  @ApiProperty() @IsString() @IsNotEmpty() zip: string;
  @ApiProperty() @IsString() @IsNotEmpty() country: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: ShippingAddressDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiProperty({ example: "+1 555 123 4567" })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ description: "Email required for guest orders" })
  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
