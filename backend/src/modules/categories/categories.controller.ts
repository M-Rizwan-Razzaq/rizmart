import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { ParseObjectIdPipe } from "../../common/pipes/parse-object-id.pipe";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: "List all active categories" })
  @ApiQuery({
    name: "all",
    required: false,
    type: Boolean,
    description: "Include inactive (admin)",
  })
  @ApiResponse({ status: 200, description: "Category list" })
  findAll(@Query("all") all?: string) {
    return this.categoriesService.findAll(all === "true");
  }

  @Get(":id")
  @ApiOperation({ summary: "Get category by id" })
  @ApiResponse({ status: 200, description: "Category" })
  @ApiResponse({ status: 404, description: "Not found" })
  findOne(@Param("id", ParseObjectIdPipe) id: string) {
    return this.categoriesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create category (admin)" })
  @ApiResponse({ status: 201, description: "Created category" })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update category (admin)" })
  @ApiResponse({ status: 200, description: "Updated category" })
  update(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete category (admin)" })
  @ApiResponse({ status: 200, description: "Deleted" })
  remove(@Param("id", ParseObjectIdPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}
