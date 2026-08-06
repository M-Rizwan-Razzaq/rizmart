import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { IsMongoId } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { WishlistService } from "./wishlist.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

class ToggleWishlistDto {
  @ApiProperty({ description: "Product MongoDB ObjectId" })
  @IsMongoId()
  productId: string;
}

@ApiTags("Wishlist")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("wishlist")
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: "Get current user wishlist" })
  @ApiResponse({ status: 200, description: "Wishlist with populated products" })
  getWishlist(@CurrentUser() currentUser: any) {
    return this.wishlistService.getWishlist(currentUser.userId);
  }

  @Post("toggle")
  @ApiOperation({ summary: "Add or remove product from wishlist" })
  @ApiResponse({ status: 200, description: "Updated wishlist" })
  toggle(@Body() dto: ToggleWishlistDto, @CurrentUser() currentUser: any) {
    return this.wishlistService.toggle(currentUser.userId, dto.productId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Clear wishlist" })
  clear(@CurrentUser() currentUser: any) {
    return this.wishlistService.clear(currentUser.userId);
  }
}
