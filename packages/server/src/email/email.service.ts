import * as fs from 'fs';
import * as path from 'path';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import * as nodemailer from 'nodemailer';

const SHARED_TEMPLATES_KEYS = ['{{head}}', '{{logo}}', '{{footer}}'];

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private templatesDir: string;
  private emailFrom: string;
  private isDevolopment: boolean;

  constructor(private readonly configService: ConfigService) {
    const env = configService.get<string>('NODE_ENV', 'development');
    this.templatesDir = path.join(__dirname, 'templates');
    this.isDevolopment = env === 'development' || env === 'test';
    this.emailFrom = this.configService.get<string>('EMAIL_FROM', 'info@dineritoflow.com');

    if (this.isDevolopment) {
      this.setupNodemailer();

      this.logger.log('Using Nodemailer for email sending');
    } else {
      this.setupSendGrid();

      this.logger.log('Using SendGrid for email sending');
    }
  }

  private setupNodemailer() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.ethereal.email'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.get<string>('SMTP_USER', ''),
        pass: this.configService.get<string>('SMTP_PASS', ''),
      },
    });
  }

  private setupSendGrid() {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');

    if (!apiKey) {
      this.logger.error('SendGrid API key is missing');
      return;
    }

    SendGrid.setApiKey(apiKey);
  }

  private getTemplate(templateName: string): string | null {
    const templatePath = path.join(this.templatesDir, `${templateName}.html`);

    try {
      if (!fs.existsSync(templatePath)) {
        this.logger.error(`Template ${templateName} not found at ${templatePath}`);
        return null;
      }

      return fs.readFileSync(templatePath, 'utf-8');
    } catch (error) {
      this.logger.error(`Error reading template ${templateName}`, error);
      return null;
    }
  }

  private renderTemplate(templateName: string, data: Record<string, any>): string {
    const template = this.getTemplate(templateName);

    if (!template) return '';

    return template.replace(/{{(\w+)}}/g, (_, key) => {
      if (SHARED_TEMPLATES_KEYS.includes(`{{${key}}}`)) {
        const sharedTemplate = this.getTemplate(`/shared/${key}`);

        if (sharedTemplate) return sharedTemplate;
      }

      return data[key] || '';
    });
  }

  private async send(mailOptions: nodemailer.SendMailOptions | SendGrid.MailDataRequired): Promise<boolean> {
    const options = {
      ...mailOptions,
      from: this.emailFrom,
    };

    try {
      if (this.isDevolopment) {
        await this.transporter.sendMail(options as nodemailer.SendMailOptions);
      } else {
        await SendGrid.send(options as SendGrid.MailDataRequired);
      }

      return true;
    } catch (error) {
      this.logger.error(`Failed to send email`, error);
      return false;
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const template = this.renderTemplate('welcome', { name });

    if (!template) {
      this.logger.error(`Failed to render welcome template`);
      return false;
    }

    return this.send({
      to,
      subject: 'Test email from DineritoFlow',
      html: template,
    });
  }

  async sendVerificationCodeEmail(to: string, code: string, expiration: number): Promise<boolean> {
    const template = this.renderTemplate('verification-code', { code, expiration });

    if (!template) {
      this.logger.error(`Failed to render verification code template`);
      return false;
    }
    return this.send({
      to,
      subject: 'Please confirm your email address',
      html: template,
    });
  }
}
