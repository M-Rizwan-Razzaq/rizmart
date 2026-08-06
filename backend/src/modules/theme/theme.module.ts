import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ThemeController } from "./theme.controller";
import { ThemeService } from "./theme.service";
import { ThemeSettings, ThemeSettingsSchema } from "./schemas/theme.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ThemeSettings.name, schema: ThemeSettingsSchema },
    ]),
  ],
  controllers: [ThemeController],
  providers: [ThemeService],
  exports: [ThemeService],
})
export class ThemeModule {}
