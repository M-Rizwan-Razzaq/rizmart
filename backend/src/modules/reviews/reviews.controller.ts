import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
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
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto, UpdateReviewDto } from "./dto/create-review.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ParseObjectIdPipe } from "../../common/pipes/parse-object-id.pipe";

@ApiTags("Reviews")
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get("product/:productId")
  @ApiOperation({ summary: "Get reviews for a product" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({ status: 200, description: "Paginated reviews" })
  findByProduct(
    @Param("productId", ParseObjectIdPipe) productId: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.reviewsService.findByProduct(productId, page, limit);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a review (guest or authenticated customer)",
  })
  create(@Body() dto: CreateReviewDto, @CurrentUser() currentUser: any) {
    return this.reviewsService.create(dto, currentUser);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update own review" })
  update(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: UpdateReviewDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.reviewsService.update(
      id,
      currentUser.userId,
      currentUser.role,
      dto,
    );
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete review (own or admin)" })
  remove(
    @Param("id", ParseObjectIdPipe) id: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.reviewsService.remove(id, currentUser.userId, currentUser.role);
  }
}
