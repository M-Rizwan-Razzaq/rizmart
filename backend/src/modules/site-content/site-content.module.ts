import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SiteContent, SiteContentSchema } from "./schemas/site-content.schema";
import { SiteContentController } from "./site-content.controller";
import { SiteContentService } from "./site-content.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SiteContent.name, schema: SiteContentSchema },
    ]),
  ],
  controllers: [SiteContentController],
  providers: [SiteContentService],
  exports: [SiteContentService],
})
export class SiteContentModule {}
