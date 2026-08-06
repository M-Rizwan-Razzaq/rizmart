import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { BrandSettingsService } from "./brand-settings.service";
import { UpdateBrandSettingsDto } from "./dto/update-brand-settings.dto";

@ApiTags("Brand Settings")
@Controller("brand-settings")
export class BrandSettingsController {
  constructor(private readonly brandSettingsService: BrandSettingsService) {}

  @Get()
  @ApiOperation({ summary: "Get global brand identity settings" })
  @ApiResponse({ status: 200, description: "Brand identity settings or null" })
  getBrandSettings() {
    return this.brandSettingsService.getBrandSettings();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update global brand identity settings (admin)" })
  updateBrandSettings(@Body() dto: UpdateBrandSettingsDto) {
    return this.brandSettingsService.upsertBrandSettings(dto);
  }
}
