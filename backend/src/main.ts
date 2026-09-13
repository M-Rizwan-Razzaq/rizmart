import { NestFactory, Reflector } from "@nestjs/core";
import { ValidationPipe, ClassSerializerInterceptor } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>("port") ?? 3000;
  const frontendOrigins = new Set(
    [
      "http://localhost:5173",
      "http://localhost:3001",
      "https://rizmart-frontend.ar2148085.workers.dev",
      "https://rizmart.store",
      "https://www.rizmart.store",
      config.get<string>("appUrl"),
      config.get<string>("siteUrl"),
      ...(config.get<string[]>("corsOrigins") ?? []),
    ].filter((origin): origin is string => Boolean(origin)),
  );

  // CORS — allow local dev and the configured frontend origin
  app.enableCors({
    origin: Array.from(frontendOrigins),
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix("api", { exclude: ["sitemap.xml"] });

  // Serve uploaded files as static assets: GET /uploads/<filename>
  app.useStaticAssets(join(process.cwd(), "uploads"), { prefix: "/uploads" });

  // Global pipes — validate & transform all DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter — uniform error shape
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global response transform — wrap all responses in { success, data, timestamp }
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger API documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle("RizMart API")
    .setDescription(
      "REST API for RizMart Bags E-commerce — authentication, products, orders, reviews, wishlist & admin dashboard",
    )
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("Auth", "Register, login, profile")
    .addTag("Users", "User management")
    .addTag("Categories", "Product categories")
    .addTag("Products", "Product catalog")
    .addTag("Orders", "Order management")
    .addTag("Reviews", "Product reviews")
    .addTag("Wishlist", "User wishlist")
    .addTag("Uploads", "Image uploads")
    .addTag("Dashboard", "Admin statistics")
    .addTag("Brand Settings", "Brand identity settings")
    .addTag("Site Content", "Public content pages")
    .addTag("Contact", "Contact form submissions")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(port);
  console.log(`🚀 RizMart API running on http://localhost:${port}/api`);
  console.log(`📚 Swagger docs  → http://localhost:${port}/api/docs`);
}

bootstrap();
