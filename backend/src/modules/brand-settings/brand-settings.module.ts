import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  BrandSettings,
  BrandSettingsSchema,
} from "./schemas/brand-settings.schema";
import { BrandSettingsController } from "./brand-settings.controller";
import { BrandSettingsService } from "./brand-settings.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BrandSettings.name, schema: BrandSettingsSchema },
    ]),
  ],
  controllers: [BrandSettingsController],
  providers: [BrandSettingsService],
  exports: [BrandSettingsService],
})
export class BrandSettingsModule {}
