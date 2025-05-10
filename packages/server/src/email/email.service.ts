import * as fs from 'fs';
import * as path from 'path';

import { DEFAULT_LANGUAGE } from '@dinerito-flow/shared';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import * as Handlebars from 'handlebars';
import { I18nContext } from 'nestjs-i18n';
import * as nodemailer from 'nodemailer';

import en from './i18n/en';
import es from './i18n/es';
import { EmailTemplates, I18nKeys } from './types';

const SHARED_TEMPLATES_KEYS = ['footer', 'head', 'logo', 'team-message'];

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private templatesDir: string;
  private emailFrom: string;
  private currentLang: string;
  private isDevolopment: boolean;

  constructor(private readonly configService: ConfigService) {
    const env = configService.get<string>('NODE_ENV', 'development');
    this.templatesDir = path.join(__dirname, 'templates');
    this.isDevolopment = env === 'development' || env === 'test';
    this.emailFrom = this.configService.get<string>('EMAIL_FROM', 'info@dineritoflow.com');
    this.currentLang = I18nContext.current()?.lang || DEFAULT_LANGUAGE;

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

  private registerPartials(): void {
    SHARED_TEMPLATES_KEYS.forEach((key) => {
      const partialPath = path.join(this.templatesDir, 'shared', this.currentLang, `${key}.html`);

      Handlebars.registerPartial(key, fs.readFileSync(partialPath, 'utf-8'));
    });
  }

  private renderTemplate(templateName: EmailTemplates, data: Record<string, any>): string {
    this.registerPartials();

    const template = this.getTemplate(templateName);

    if (!template) {
      this.logger.error(`Failed to render ${templateName} template`);
      return '';
    }

    return Handlebars.compile(template)(data);
  }

  private getTemplateI18nData(key: I18nKeys): Record<string, string> {
    return {
      lang: this.currentLang,
      ...(this.currentLang === DEFAULT_LANGUAGE ? en[key] : es[key]),
    };
  }

  async send(
    to: string,
    templateName: EmailTemplates,
    data: Record<string, any>,
    mailOptions?: nodemailer.SendMailOptions | SendGrid.MailDataRequired
  ): Promise<boolean> {
    const i18nKey = templateName.toUpperCase().replace(/-/g, '_') as I18nKeys;
    const i18n = this.getTemplateI18nData(i18nKey);
    const template = this.renderTemplate(templateName, { ...i18n, ...data });

    if (!template) return false;

    const options = {
      ...mailOptions,
      to,
      subject: i18n.subject,
      html: template,
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
}
