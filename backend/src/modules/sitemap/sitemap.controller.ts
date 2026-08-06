import { Controller, Get, Res } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { Response } from "express";
import { SitemapService } from "./sitemap.service";

@ApiExcludeController()
@Controller()
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get("sitemap.xml")
  async getSitemap(@Res() res: Response): Promise<void> {
    const xml = await this.sitemapService.buildXml();
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.send(xml);
  }
}
