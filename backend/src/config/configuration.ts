export default () => ({
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/desi-muse",
  jwtSecret: process.env.JWT_SECRET || "fallback-secret-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  resetTokenSecret:
    process.env.RESET_TOKEN_SECRET ||
    `${process.env.JWT_SECRET || "fallback-secret-change-in-production"}-reset`,
  resetTokenExpiresIn: process.env.RESET_TOKEN_EXPIRES_IN || "1h",
  port: parseInt(process.env.PORT, 10) || 3000,
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  appUrl: process.env.APP_URL || "http://localhost:5173",
  siteUrl: process.env.SITE_URL || "https://www.desimuse.store",
  notifications: {
    adminEmail: process.env.ORDER_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "",
    resend: {
      apiKey: process.env.RESEND_API_KEY || "",
    },
    email: {
      host: process.env.EMAIL_HOST || "",
      port: parseInt(process.env.EMAIL_PORT, 10) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      user: process.env.EMAIL_USER || "",
      pass: process.env.EMAIL_PASS || "",
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || "",
      fromOrders: process.env.EMAIL_FROM_ORDERS || "Desi Muse <orders@desimuse.store>",
      fromOffers: process.env.EMAIL_FROM_OFFERS || "Desi Muse <offers@desimuse.store>",
    },
  },

  // Cloudflare R2 (S3-compatible)
  r2: {
    bucket: process.env.R2_BUCKET || "",
    endpoint: process.env.R2_ENDPOINT || "",
    publicUrl: process.env.R2_PUBLIC_URL || "",
    accessKey: process.env.R2_ACCESS_KEY || "",
    secretKey: process.env.R2_SECRET_KEY || "",
  },
});
