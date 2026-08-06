import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { MarketingService } from "./marketing.service";
import { SendPromotionDto } from "./dto/send-promotion.dto";

@ApiTags("Marketing")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("marketing")
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Get("promotion-recipients")
  @ApiOperation({ summary: "Get promotion recipient summary" })
  @ApiResponse({ status: 200, description: "Promotion recipient summary" })
  getRecipients() {
    return this.marketingService.getRecipientSummary();
  }

  @Post("promotion-emails")
  @ApiOperation({ summary: "Send promotion email to all deduped recipients" })
  @ApiResponse({ status: 201, description: "Promotion email queued" })
  sendPromotion(@Body() dto: SendPromotionDto) {
    return this.marketingService.sendPromotion(dto);
  }
}
