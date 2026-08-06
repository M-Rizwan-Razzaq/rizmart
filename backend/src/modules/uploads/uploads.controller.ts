import {
  Controller,
  Post,
  Delete,
  Body,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UploadsService } from "./uploads.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

class DeleteFileDto {
  @ApiProperty({ description: "R2 object key or full public URL to delete" })
  @IsString()
  @IsNotEmpty()
  key: string;
}

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  if (!file.mimetype.match(/image\/(jpg|jpeg|png|webp|gif|svg\+xml)$/)) {
    return cb(
      new BadRequestException(
        "Only image files are allowed (jpg, jpeg, png, webp)",
      ),
      false,
    );
  }
  cb(null, true);
};

@ApiTags("Uploads")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post("image")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(), // keep in memory — forward directly to R2
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
        folder: {
          type: "string",
          example: "products",
          description: "R2 folder (optional)",
        },
      },
    },
  })
  @ApiOperation({ summary: "Upload an image to Cloudflare R2 (admin)" })
  @ApiResponse({
    status: 200,
    description: "Returns public URL and key of uploaded file",
  })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string; key: string }> {
    if (!file) throw new BadRequestException("No file provided");
    return this.uploadsService.uploadFile(file, "products");
  }

  @Delete("image")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Delete an image from Cloudflare R2 by key or URL (admin)",
  })
  @ApiResponse({ status: 200, description: "Image deleted" })
  async deleteImage(@Body() dto: DeleteFileDto): Promise<{ message: string }> {
    await this.uploadsService.deleteFile(dto.key);
    return { message: "Image deleted successfully" };
  }
}
