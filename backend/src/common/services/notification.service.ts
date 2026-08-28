import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, Transporter } from "nodemailer";

type OrderAddress = {
  name?: string;
  firstName?: string;
  lastName?: string;
  address: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
};

type OrderLineItem = {
  name: string;
  qty: number;
  price: number;
};

type ContactSubmission = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type PromotionEmail = {
  subject: string;
  message: string;
};

type UserNotification = {
  name: string;
  email: string;
};

type PasswordResetNotification = {
  name: string;
  email: string;
  resetUrl: string;
};

type NotificationOrder = {
  orderNumber: string;
  status: string;
  total: number;
  shipping?: number;
  subtotal?: number;
  phone?: string;
  guestEmail?: string;
  shippingAddress?: OrderAddress;
  items?: OrderLineItem[];
  user?: {
    name?: string;
    email?: string;
  };
};

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private transporter?: Transporter;
  private readonly brandName = "RizMart";

  constructor(private readonly configService: ConfigService) {}

  async notifyOrderPlaced(
    order: NotificationOrder,
    customerEmail?: string | null,
    adminEmail?: string | null,
  ): Promise<void> {
    const recipientEmails = Array.from(
      new Set([customerEmail?.trim(), adminEmail?.trim()].filter(Boolean)),
    ) as string[];

    const customerName =
      order.user?.name?.trim() ||
      order.shippingAddress?.name?.trim() ||
      order.shippingAddress?.firstName?.trim() ||
      "Customer";

    const tasks = recipientEmails.map((email) => {
      const isAdmin = email === adminEmail?.trim();
      return this.sendEmail({
        to: email,
        from: this.configService.get<string>("notifications.email.fromOrders"),
        subject: isAdmin
          ? `New order received: ${order.orderNumber}`
          : `Your ${this.brandName} order ${order.orderNumber} has been received`,
        html: this.buildOrderPlacedEmailHtml(order, customerName, isAdmin),
        text: this.buildOrderPlacedEmailText(order, customerName, isAdmin),
      });
    });

    await this.runBestEffort(tasks, `order ${order.orderNumber} placed`);
  }

  async notifyOrderStatusChanged(
    order: NotificationOrder,
    previousStatus: string,
    currentStatus: string,
    recipientEmail?: string | null,
  ): Promise<void> {
    if (!recipientEmail?.trim()) {
      return;
    }

    await this.runBestEffort(
      [
        this.sendEmail({
          to: recipientEmail.trim(),
          from: this.configService.get<string>("notifications.email.fromOrders"),
          subject: `Your ${this.brandName} order ${order.orderNumber} is now ${currentStatus}`,
          html: this.buildOrderStatusEmailHtml(
            order,
            previousStatus,
            currentStatus,
          ),
          text: this.buildOrderStatusEmailText(
            order,
            previousStatus,
            currentStatus,
          ),
        }),
      ],
      `order ${order.orderNumber} status change`,
    );
  }

  async notifyContactSubmission(
    submission: ContactSubmission,
    adminEmail?: string | null,
  ): Promise<void> {
    const recipient = adminEmail?.trim();
    if (!recipient) {
      this.logger.warn(
        "Contact notification skipped because admin email is not configured",
      );
      return;
    }

    await this.runBestEffort(
      [
        this.sendEmail({
          to: recipient,
          subject: `New contact enquiry: ${submission.subject}`,
          replyTo: submission.email,
          html: this.buildContactEmailHtml(submission),
          text: this.buildContactEmailText(submission),
        }),
      ],
      `contact enquiry from ${submission.email}`,
    );
  }

  async sendPromotionEmail(
    to: string,
    campaign: PromotionEmail,
  ): Promise<void> {
    await this.runBestEffort(
      [
        this.sendEmail({
          to: to.trim().toLowerCase(),
          from: this.configService.get<string>("notifications.email.fromOffers"),
          subject: campaign.subject,
          html: this.buildPromotionEmailHtml(campaign),
          text: this.buildPromotionEmailText(campaign),
        }),
      ],
      `promotion email to ${to}`,
    );
  }

  async notifyUserWelcome(recipient: UserNotification): Promise<void> {
    if (!recipient.email?.trim()) {
      return;
    }

    await this.runBestEffort(
      [
        this.sendEmail({
          to: recipient.email.trim(),
          subject: `Welcome to ${this.brandName}, ${recipient.name.trim()}`,
          html: this.buildWelcomeEmailHtml(recipient),
          text: this.buildWelcomeEmailText(recipient),
        }),
      ],
      `welcome email for ${recipient.email}`,
    );
  }

  async notifyUserLogin(recipient: UserNotification): Promise<void> {
    if (!recipient.email?.trim()) {
      return;
    }

    await this.runBestEffort(
      [
        this.sendEmail({
          to: recipient.email.trim(),
          subject: `You just signed in to ${this.brandName}`,
          html: this.buildLoginEmailHtml(recipient),
          text: this.buildLoginEmailText(recipient),
        }),
      ],
      `login email for ${recipient.email}`,
    );
  }

  async notifyPasswordResetLink(
    recipient: PasswordResetNotification,
  ): Promise<void> {
    if (!recipient.email?.trim()) {
      return;
    }

    await this.runBestEffort(
      [
        this.sendEmail({
          to: recipient.email.trim(),
          subject: `Reset your ${this.brandName} password`,
          html: this.buildPasswordResetEmailHtml(recipient),
          text: this.buildPasswordResetEmailText(recipient),
        }),
      ],
      `password reset for ${recipient.email}`,
    );
  }

  private async sendEmail({
    to,
    subject,
    html,
    text,
    replyTo,
    from: fromOverride,
  }: {
    to: string;
    subject: string;
    html: string;
    text: string;
    replyTo?: string;
    from?: string;
  }): Promise<void> {
    const from =
      fromOverride ||
      this.configService.get<string>("notifications.email.from");
    const resendApiKey = this.configService.get<string>(
      "notifications.resend.apiKey",
    );

    if (resendApiKey && from) {
      await this.sendViaResend({
        apiKey: resendApiKey,
        from,
        to,
        subject,
        html,
        text,
        replyTo,
      });
      return;
    }

    const transporter = this.getTransporter();
    if (transporter && from) {
      await transporter.sendMail({
        from,
        to,
        subject,
        html,
        text,
        replyTo,
      });
      return;
    }

    this.logger.warn(
      `Email skipped for ${to} because neither Resend nor SMTP is configured`,
    );
  }

  private async sendViaResend({
    apiKey,
    from,
    to,
    subject,
    html,
    text,
    replyTo,
  }: {
    apiKey: string;
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
    replyTo?: string;
  }): Promise<void> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "RizMart Backend",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        text,
        reply_to: replyTo,
      }),
    });

    if (response.ok) {
      return;
    }

    const responseText = await response.text().catch(() => "");
    throw new Error(
      `Resend email failed with status ${response.status}${responseText ? `: ${responseText}` : ""}`,
    );
  }

  private buildContactEmailHtml(submission: ContactSubmission): string {
    return `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
        <h2 style="margin:0 0 12px;">New contact enquiry</h2>
        <p style="margin:0 0 16px;">
          <strong>From:</strong> ${this.escapeHtml(submission.name)}<br />
          <strong>Email:</strong> ${this.escapeHtml(submission.email)}<br />
          <strong>Phone:</strong> ${this.escapeHtml(submission.phone)}<br />
          <strong>Subject:</strong> ${this.escapeHtml(submission.subject)}
        </p>
        <div style="padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;white-space:pre-wrap;">
          ${this.escapeHtml(submission.message)}
        </div>
      </div>
    `;
  }

  private buildContactEmailText(submission: ContactSubmission): string {
    return [
      "New contact enquiry",
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      `Phone: ${submission.phone}`,
      `Subject: ${submission.subject}`,
      "",
      submission.message,
    ].join("\n");
  }

  private buildPromotionEmailHtml(campaign: PromotionEmail): string {
    const safeMessage = this.escapeHtml(campaign.message).replaceAll(
      "\n",
      "<br />",
    );
    return `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#111827;">
        <div style="padding:24px;border-radius:18px;border:1px solid #e5e7eb;background:#fffaf3;">
          <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#f3ead6;color:#8a6537;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px;">
            ${this.escapeHtml(this.brandName)} Promotion
          </div>
          <h2 style="margin:0 0 14px;font-size:28px;line-height:1.2;color:#1f2937;">
            ${this.escapeHtml(campaign.subject)}
          </h2>
          <div style="font-size:15px;color:#374151;white-space:normal;">
            ${safeMessage}
          </div>
        </div>
      </div>
    `;
  }

  private buildPromotionEmailText(campaign: PromotionEmail): string {
    return [campaign.subject, "", campaign.message].join("\n");
  }

  private buildWelcomeEmailHtml(recipient: UserNotification): string {
    return `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#111827;">
        <div style="padding:24px;border-radius:18px;border:1px solid #e5e7eb;background:#fffaf3;">
          <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#f3ead6;color:#8a6537;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px;">
            Welcome
          </div>
          <h2 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#1f2937;">
            Welcome to ${this.brandName}, ${this.escapeHtml(recipient.name)}
          </h2>
          <p style="margin:0;color:#374151;font-size:15px;">
            Your account is ready. You can now browse collections, save favorites, and track your orders.
          </p>
        </div>
      </div>
    `;
  }

  private buildWelcomeEmailText(recipient: UserNotification): string {
    return [
      `Welcome to ${this.brandName}, ${recipient.name}`,
      "",
      "Your account is ready. You can now browse collections, save favorites, and track your orders.",
    ].join("\n");
  }

  private buildLoginEmailHtml(recipient: UserNotification): string {
    return `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#111827;">
        <div style="padding:24px;border-radius:18px;border:1px solid #e5e7eb;background:#fffaf3;">
          <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#f3ead6;color:#8a6537;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px;">
            Secure Sign-In
          </div>
          <h2 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#1f2937;">
            You just signed in to ${this.brandName}
          </h2>
          <p style="margin:0;color:#374151;font-size:15px;">
            Hello ${this.escapeHtml(recipient.name)}, this is a quick confirmation that your account was accessed successfully.
          </p>
        </div>
      </div>
    `;
  }

  private buildLoginEmailText(recipient: UserNotification): string {
    return [
      `You just signed in to ${this.brandName}`,
      "",
      `Hello ${recipient.name}, this is a quick confirmation that your account was accessed successfully.`,
    ].join("\n");
  }

  private buildPasswordResetEmailHtml(
    recipient: PasswordResetNotification,
  ): string {
    return `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
        <h2 style="margin:0 0 12px;">Reset your password</h2>
        <p style="margin:0 0 16px;">
          Hello ${this.escapeHtml(recipient.name)}, we received a request to reset your ${this.brandName} password.
        </p>
        <p style="margin:0 0 20px;">
          <a href="${this.escapeHtml(recipient.resetUrl)}" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#d8b46b;color:#111827;text-decoration:none;font-weight:700;">
            Reset Password
          </a>
        </p>
        <p style="margin:0 0 8px;color:#6b7280;">
          If the button does not work, copy and paste this link into your browser:
        </p>
        <p style="word-break:break-all;color:#2563eb;">${this.escapeHtml(recipient.resetUrl)}</p>
        <p style="margin-top:16px;color:#6b7280;">
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    `;
  }

  private buildPasswordResetEmailText(
    recipient: PasswordResetNotification,
  ): string {
    return [
      "Reset your password",
      `Hello ${recipient.name}, we received a request to reset your ${this.brandName} password.`,
      "",
      `Reset here: ${recipient.resetUrl}`,
      "",
      "If you did not request this, you can ignore this email.",
    ].join("\n");
  }

  private buildOrderPlacedEmailHtml(
    order: NotificationOrder,
    customerName: string,
    isAdmin = false,
  ): string {
    const itemsHtml = this.buildItemsTableHtml(order.items ?? []);
    const addressHtml = this.buildAddressHtml(order.shippingAddress);

    return `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
        <h2 style="margin:0 0 12px;">${isAdmin ? "New order received" : "Thanks for your order"}, ${customerName}</h2>
        <p style="margin:0 0 16px;">
          Order <strong>${order.orderNumber}</strong> has been placed successfully.
        </p>
        <p style="margin:0 0 16px;">
          Status: <strong>${order.status}</strong><br />
          Total: <strong>${this.formatCurrency(order.total)}</strong>
        </p>
        ${addressHtml}
        ${itemsHtml}
        <p style="margin-top:16px;color:#6b7280;">
          ${isAdmin ? "This is an internal notification for the admin team." : "We will keep you updated whenever the order status changes."}
        </p>
      </div>
    `;
  }

  private buildOrderPlacedEmailText(
    order: NotificationOrder,
    customerName: string,
    isAdmin = false,
  ): string {
    const lines = [
      `${isAdmin ? "New order received" : "Thanks for your order"}, ${customerName}`,
      `Order: ${order.orderNumber}`,
      `Status: ${order.status}`,
      `Total: ${this.formatCurrency(order.total)}`,
    ];
    if (order.shippingAddress) {
      const addr = order.shippingAddress;
      const fullName =
        addr.name ||
        `${addr.firstName ?? ""} ${addr.lastName ?? ""}`.trim();
      lines.push(
        `Ship to: ${fullName}, ${addr.address}, ${addr.city}, ${addr.country}`,
      );
    }
    if (order.items?.length) {
      lines.push(
        "Items:",
        ...order.items.map(
          (item) =>
            `- ${item.name} x${item.qty} (${this.formatCurrency(item.price)})`,
        ),
      );
    }
    return lines.join("\n");
  }

  private buildOrderStatusEmailHtml(
    order: NotificationOrder,
    previousStatus: string,
    currentStatus: string,
  ): string {
    const tone = this.getStatusTone(currentStatus);
    const itemCount = (order.items ?? []).reduce(
      (sum, item) => sum + (item.qty || 0),
      0,
    );

    return `
      <div style="margin:0;padding:0;background:#f3f4f6;">
        <div style="max-width:680px;margin:0 auto;padding:24px 16px;font-family:Arial,sans-serif;color:#111827;">
          <div style="overflow:hidden;border-radius:20px;background:#ffffff;border:1px solid #e5e7eb;box-shadow:0 18px 50px rgba(15,23,42,0.12);">
            <div style="padding:28px 28px 24px;background:linear-gradient(135deg,#111827 0%,#1f2937 45%,#6b7280 100%);color:#ffffff;">
              <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,0.14);font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">
                ${this.escapeHtml(this.brandName)} Order Update
              </div>
              <h2 style="margin:14px 0 8px;font-size:28px;line-height:1.2;font-weight:700;">
                Your order has been updated
              </h2>
              <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.86);">
                Order <strong>${this.escapeHtml(order.orderNumber)}</strong> moved from <strong>${this.escapeHtml(previousStatus)}</strong> to <strong>${this.escapeHtml(currentStatus)}</strong>.
              </p>
            </div>

            <div style="padding:28px;">
              <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
                <div style="flex:1;min-width:180px;padding:16px 18px;border:1px solid #e5e7eb;border-radius:16px;background:#fafafa;">
                  <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;margin-bottom:6px;">Current status</div>
                  <div style="display:inline-block;padding:8px 12px;border-radius:999px;background:${tone.bg};color:${tone.text};font-weight:700;font-size:13px;">
                    ${this.escapeHtml(currentStatus)}
                  </div>
                </div>
                <div style="flex:1;min-width:180px;padding:16px 18px;border:1px solid #e5e7eb;border-radius:16px;background:#fafafa;">
                  <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;margin-bottom:6px;">Order total</div>
                  <div style="font-size:22px;font-weight:700;color:#111827;">${this.formatCurrency(order.total)}</div>
                </div>
                <div style="flex:1;min-width:180px;padding:16px 18px;border:1px solid #e5e7eb;border-radius:16px;background:#fafafa;">
                  <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;margin-bottom:6px;">Items</div>
                  <div style="font-size:22px;font-weight:700;color:#111827;">${itemCount}</div>
                </div>
              </div>

              ${this.buildItemsTableHtml(order.items ?? [])}

              <div style="margin-top:20px;padding:16px 18px;border-radius:16px;background:#f9fafb;border:1px solid #e5e7eb;">
                <div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:6px;">What changed</div>
                <div style="font-size:14px;line-height:1.7;color:#4b5563;">
                  Order <strong>${this.escapeHtml(order.orderNumber)}</strong> progressed from <strong>${this.escapeHtml(previousStatus)}</strong> to <strong>${this.escapeHtml(currentStatus)}</strong>.
                  You can use this update to keep the customer informed and reduce support follow-ups.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private buildOrderStatusEmailText(
    order: NotificationOrder,
    previousStatus: string,
    currentStatus: string,
  ): string {
    const lines = [
      `Your ${this.brandName} order ${order.orderNumber} moved from ${previousStatus} to ${currentStatus}.`,
      `Total: ${this.formatCurrency(order.total)}`,
    ];
    if (order.items?.length) {
      lines.push(
        "Items:",
        ...order.items.map(
          (item) =>
            `- ${item.name} x${item.qty} (${this.formatCurrency(item.price)})`,
        ),
      );
    }
    return lines.join("\n");
  }

  private buildItemsTableHtml(items: OrderLineItem[]): string {
    if (!items.length) {
      return `
        <div style="padding:18px;border-radius:16px;background:#f9fafb;border:1px solid #e5e7eb;color:#6b7280;">
          No order items available for this update.
        </div>
      `;
    }

    const rows = items
      .map(
        (item) => `
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid #eef2f7;">${this.escapeHtml(item.name)}</td>
            <td style="padding:14px 0;border-bottom:1px solid #eef2f7;text-align:center;font-weight:700;">${item.qty}</td>
            <td style="padding:14px 0;border-bottom:1px solid #eef2f7;text-align:right;font-weight:700;">${this.formatCurrency(item.price)}</td>
          </tr>
        `,
      )
      .join("");

    return `
      <table style="width:100%;border-collapse:separate;border-spacing:0;margin-top:12px;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
        <thead>
          <tr style="background:#111827;color:#ffffff;">
            <th style="text-align:left;padding:14px 16px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Item</th>
            <th style="text-align:center;padding:14px 16px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Qty</th>
            <th style="text-align:right;padding:14px 16px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Price</th>
          </tr>
        </thead>
        <tbody style="background:#ffffff;">${rows}</tbody>
      </table>
    `;
  }

  private buildAddressHtml(address?: OrderAddress): string {
    if (!address) {
      return "";
    }

    const fullName =
      address.name ||
      `${address.firstName ?? ""} ${address.lastName ?? ""}`.trim();

    return `
      <div style="margin:16px 0;padding:12px;border:1px solid #e5e7eb;border-radius:8px;">
        <strong>Shipping address</strong>
        <div>${fullName}</div>
        <div>${address.address}</div>
        <div>${address.city} ${address.zip}</div>
        <div>${address.country}</div>
      </div>
    `;
  }

  private async runBestEffort(
    tasks: Promise<unknown>[],
    context: string,
  ): Promise<void> {
    const results = await Promise.allSettled(tasks);
    for (const result of results) {
      if (result.status === "rejected") {
        this.logger.warn(
          `Notification failed for ${context}: ${result.reason}`,
        );
      }
    }
  }

  private getTransporter(): Transporter | undefined {
    if (this.transporter) {
      return this.transporter;
    }

    const emailConfig = this.configService.get<{
      host: string;
      port: number;
      secure: boolean;
      user: string;
      pass: string;
    }>("notifications.email");

    if (!emailConfig?.host || !emailConfig?.user || !emailConfig?.pass) {
      return undefined;
    }

    this.transporter = createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });

    return this.transporter;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    }).format(amount ?? 0);
  }

  private getStatusTone(status: string): { bg: string; text: string } {
    const normalized = status.toLowerCase();

    if (normalized.includes("confirm"))
      return { bg: "#ecfdf5", text: "#047857" };
    if (normalized.includes("pack")) return { bg: "#eff6ff", text: "#1d4ed8" };
    if (normalized.includes("ship")) return { bg: "#fefce8", text: "#a16207" };
    if (normalized.includes("deliver"))
      return { bg: "#ecfccb", text: "#3f6212" };
    if (normalized.includes("cancel") || normalized.includes("return")) {
      return { bg: "#fef2f2", text: "#b91c1c" };
    }

    return { bg: "#f3f4f6", text: "#374151" };
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
}
