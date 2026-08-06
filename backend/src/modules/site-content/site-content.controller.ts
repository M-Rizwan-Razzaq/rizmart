import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { SiteContentService } from "./site-content.service";
import { UpdateSiteContentDto } from "./dto/update-site-content.dto";

@ApiTags("Site Content")
@Controller("site-content")
export class SiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  @Get()
  @ApiOperation({ summary: "Get all public site content pages" })
  @ApiResponse({ status: 200, description: "All site content pages" })
  getAll() {
    return this.siteContentService.getAll();
  }

  @Get(":slug")
  @ApiParam({
    name: "slug",
    description: "about, privacy-policy, terms-of-service, or refund-policy",
  })
  @ApiOperation({ summary: "Get a public site content page by slug" })
  @ApiResponse({ status: 200, description: "Site content page" })
  getBySlug(
    @Param("slug")
    slug: "about" | "privacy-policy" | "terms-of-service" | "refund-policy",
  ) {
    return this.siteContentService.getBySlug(slug);
  }

  @Patch(":slug")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiParam({
    name: "slug",
    description: "about, privacy-policy, terms-of-service, or refund-policy",
  })
  @ApiOperation({ summary: "Update a site content page (admin)" })
  updateBySlug(
    @Param("slug")
    slug: "about" | "privacy-policy" | "terms-of-service" | "refund-policy",
    @Body() dto: UpdateSiteContentDto,
  ) {
    return this.siteContentService.updateBySlug(slug, dto);
  }
}
