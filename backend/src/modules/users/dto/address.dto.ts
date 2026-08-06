import { IsString, IsNotEmpty, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateAddressDto {
  @ApiPropertyOptional({ example: "Home" })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ example: "Jane" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({ example: "Doe" })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: "123 Fifth Avenue" })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: "New York" })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ example: "NY" })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: "10001" })
  @IsOptional()
  @IsString()
  zip?: string;

  @ApiPropertyOptional({ example: "United States" })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: "+1 212 555 0100" })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateAddressDto extends CreateAddressDto {}

export class SetDefaultAddressDto {
  @ApiProperty()
  @IsBoolean()
  isDefault: boolean;
}
