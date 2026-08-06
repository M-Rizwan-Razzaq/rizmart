import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { NewsletterService } from "./newsletter.service";
import { CreateNewsletterSubscriptionDto } from "./dto/create-newsletter-subscription.dto";

@ApiTags("Newsletter")
@Controller("newsletter")
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post("subscribe")
  @ApiOperation({ summary: "Subscribe to the newsletter" })
  @ApiResponse({ status: 201, description: "Newsletter subscription stored" })
  subscribe(@Body() dto: CreateNewsletterSubscriptionDto) {
    return this.newsletterService.subscribe(dto);
  }
}
