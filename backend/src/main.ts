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

  // CORS — allow the Vite dev server
  app.enableCors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3001",
      "https://desimuse.vercel.app",
      "https://luxora-jewel-hub-frontend.onrender.com",
      "https://www.desimuse.store",
      "https://desimuse.store",
      "https://luxora-jewel-hub-1.onrender.com",
      "https://luxora-jewel-hub.ar2148085.workers.dev",
    ],
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
    .setTitle("Desi Muse API")
    .setDescription(
      "REST API for Desi Muse Jewelry E-commerce — authentication, products, orders, reviews, wishlist & admin dashboard",
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
  console.log(`🚀 Desi Muse API running on http://localhost:${port}/api`);
  console.log(`📚 Swagger docs  → http://localhost:${port}/api/docs`);
}

bootstrap();
