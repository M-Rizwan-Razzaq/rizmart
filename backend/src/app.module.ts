import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import configuration from "./config/configuration";

import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { ProductsModule } from "./modules/products/products.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { WishlistModule } from "./modules/wishlist/wishlist.module";
import { UploadsModule } from "./modules/uploads/uploads.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { ThemeModule } from "./modules/theme/theme.module";
import { ContactModule } from "./modules/contact/contact.module";
import { NewsletterModule } from "./modules/newsletter/newsletter.module";
import { MarketingModule } from "./modules/marketing/marketing.module";
import { BrandSettingsModule } from "./modules/brand-settings/brand-settings.module";
import { SiteContentModule } from "./modules/site-content/site-content.module";
import { SitemapModule } from "./modules/sitemap/sitemap.module";
import { HealthModule } from "./modules/health/health.module";

@Module({
  imports: [
    // Config — global so all modules can inject ConfigService
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // MongoDB via Mongoose
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>("mongoUri"),
      }),
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    ReviewsModule,
    WishlistModule,
    UploadsModule,
    DashboardModule,
    ThemeModule,
    BrandSettingsModule,
    SiteContentModule,
    ContactModule,
    NewsletterModule,
    MarketingModule,
    SitemapModule,
    HealthModule,
  ],
})
export class AppModule {}
