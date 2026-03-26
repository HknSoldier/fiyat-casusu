import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got from 'got';

export interface AlertEmailData {
  to: string;
  subject: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  changePercent: number;
  platform: string;
  productUrl: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private apiKey: string | undefined;
  private fromEmail: string;
  private isEnabled: boolean = false;

  constructor(private configService: ConfigService) {
    console.log('[EmailService] Initializing...');
    this.apiKey = this.configService.get<string>('BREVO_API_KEY');
    this.fromEmail = this.configService.get<string>('BREVO_FROM_EMAIL', 'noreply@fiyatcasusu.com');
    
    console.log('[EmailService] API Key:', this.apiKey ? 'set' : 'not set');
    console.log('[EmailService] From Email:', this.fromEmail);
    
    if (this.apiKey) {
      this.isEnabled = true;
      this.logger.log('Email service enabled with Brevo');
    } else {
      this.logger.warn('Brevo API key not configured - emails will be logged only');
    }
  }

  /**
   * Send price alert email
   */
  async sendPriceAlert(data: AlertEmailData): Promise<boolean> {
    const changeText = data.changePercent > 0 
      ? `📈 Fiyat artışı: +%${data.changePercent.toFixed(1)}`
      : `📉 Fiyat düşüşü: %${data.changePercent.toFixed(1)}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert-box { background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .price-old { text-decoration: line-through; color: #999; }
          .price-new { font-size: 24px; font-weight: bold; color: #667eea; }
          .platform { display: inline-block; background: #eee; padding: 5px 10px; border-radius: 3px; font-size: 12px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 Fiyat Casusu - Fiyat Alertı</h1>
          </div>
          <div class="content">
            <div class="alert-box">
              <h2>${data.productName}</h2>
              <span class="platform">${data.platform}</span>
              <p>${changeText}</p>
              <p class="price-old">Eski fiyat: ${data.oldPrice.toFixed(2)} TL</p>
              <p class="price-new">Yeni fiyat: ${data.newPrice.toFixed(2)} TL</p>
              <a href="${data.productUrl}" class="button">Ürünü Görüntüle</a>
            </div>
            <p>Bu email, Fiyat Casusu platformu tarafından gönderilmiştir.</p>
          </div>
          <div class="footer">
            <p>Fiyat Casusu - KOBİ E-Ticaret Fiyat İzleme Platformu</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
💰 Fiyat Casusu - Fiyat Alertı

${data.productName}
Platform: ${data.platform}

${changeText}
Eski fiyat: ${data.oldPrice.toFixed(2)} TL
Yeni fiyat: ${data.newPrice.toFixed(2)} TL

Ürün linki: ${data.productUrl}

---
Fiyat Casusu - KOBİ E-Ticaret Fiyat İzleme Platformu
    `.trim();

    if (!this.isEnabled) {
      this.logger.log(`[DEV EMAIL] Would send to: ${data.to}, Subject: ${data.subject}`);
      return true;
    }

    return this.sendViaBrevo(data.to, data.subject, htmlContent, textContent);
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .feature { display: flex; align-items: center; margin: 15px 0; }
          .feature-icon { font-size: 24px; margin-right: 15px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Fiyat Casusu'na Hoş Geldiniz!</h1>
          </div>
          <div class="content">
            <p>Merhaba <strong>${name}</strong>,</p>
            <p>Fiyat Casusu'na kayıt olduğunuz için teşekkür ederiz!</p>
            <a href="http://localhost:3000/dashboard" class="button">Dashboard'a Git</a>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `🎉 Fiyat Casusu'na Hoş Geldiniz! Merhaba ${name}`;

    if (!this.isEnabled) {
      this.logger.log(`[DEV EMAIL] Welcome email to ${to}: ${name}`);
      return true;
    }

    return this.sendViaBrevo(to, '🎉 Fiyat Casusu\'na Hoş Geldiniz!', htmlContent, textContent);
  }

  /**
   * Send email via Brevo API
   */
  private async sendViaBrevo(to: string, subject: string, html: string, text: string): Promise<boolean> {
    try {
      const response = await got.post('https://api.brevo.com/v3/smtp/email', {
        json: {
          sender: {
            email: this.fromEmail,
            name: 'Fiyat Casusu'
          },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html,
          textContent: text,
        },
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      }).json();

      this.logger.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to send email via Brevo: ${error.message}`);
      return false;
    }
  }

  /**
   * Send email verification email
   */
  async sendVerificationEmail(to: string, token: string): Promise<boolean> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/verify?token=${token}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; font-family: monospace; font-size: 18px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Email Doğrulama</h1>
          </div>
          <div class="content">
            <p>Merhaba,</p>
            <p>Fiyat Casusu hesabınızı aktifleştirmek için aşağıdaki butona tıklayın:</p>
            <a href="${verificationUrl}" class="button">Hesabımı Aktifleştir</a>
            <p>Veya bu linki tarayıcınızda açın:</p>
            <div class="code-box">${verificationUrl}</div>
            <p>Bu link 24 saat geçerlidir.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `Email doğrulama için: ${verificationUrl}`;

    if (!this.isEnabled) {
      this.logger.log(`[DEV EMAIL] Verification email to ${to}, URL: ${verificationUrl}`);
      return true;
    }

    return this.sendViaBrevo(to, '📧 Fiyat Casusu - Email Doğrulama', htmlContent, textContent);
  }
}
