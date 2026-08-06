import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ThemeService } from "./theme.service";
import { UpdateThemeDto } from "./dto/update-theme.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@ApiTags("Theme")
@Controller("theme")
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Get()
  @ApiOperation({ summary: "Get global theme and brand settings" })
  @ApiResponse({ status: 200, description: "Theme and brand settings or null" })
  getTheme() {
    return this.themeService.getTheme();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update global theme and brand settings (admin)" })
  updateTheme(@Body() dto: UpdateThemeDto) {
    return this.themeService.upsertTheme(dto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Reset global theme and brand settings to defaults (admin)",
  })
  deleteTheme() {
    return this.themeService.deleteTheme();
  }
}
