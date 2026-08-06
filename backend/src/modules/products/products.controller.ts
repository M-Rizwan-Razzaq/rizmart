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
  UploadedFiles,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { ParseObjectIdPipe } from "../../common/pipes/parse-object-id.pipe";

const imageStorage = diskStorage({
  destination: "./uploads",
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, `product-${unique}${extname(file.originalname)}`);
  },
});

const imageFileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
    return cb(
      new BadRequestException("Only image files are allowed (jpg, png, webp)"),
      false,
    );
  }
  cb(null, true);
};

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: "List products with filtering & pagination" })
  @ApiResponse({ status: 200, description: "Paginated product list" })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get("featured")
  @ApiOperation({ summary: "Get featured products" })
  findFeatured() {
    return this.productsService.findFeatured();
  }

  @Get("trending")
  @ApiOperation({ summary: "Get trending products" })
  findTrending() {
    return this.productsService.findTrending();
  }

  @Get("best-sellers")
  @ApiOperation({ summary: "Get best-seller products" })
  findBestSellers() {
    return this.productsService.findBestSellers();
  }

  @Get("new-arrivals")
  @ApiOperation({ summary: "Get new arrival products" })
  findNewArrivals() {
    return this.productsService.findNewArrivals();
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Get product by slug" })
  @ApiResponse({ status: 404, description: "Not found" })
  findBySlug(@Param("slug") slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product by id" })
  @ApiResponse({ status: 404, description: "Not found" })
  findOne(@Param("id", ParseObjectIdPipe) id: string) {
    return this.productsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create product (admin)" })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update product (admin)" })
  update(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete product (admin)" })
  remove(@Param("id", ParseObjectIdPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Post(":id/images")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      storage: imageStorage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        images: { type: "array", items: { type: "string", format: "binary" } },
      },
    },
  })
  @ApiOperation({ summary: "Upload product images (admin)" })
  async uploadImages(
    @Param("id", ParseObjectIdPipe) id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files?.length) throw new BadRequestException("No images uploaded");
    const urls = files.map((f) => `/uploads/${f.filename}`);
    return this.productsService.addImages(id, urls);
  }
}
