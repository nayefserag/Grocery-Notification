import { Injectable } from "@nestjs/common";
import * as path from "path";
import { config } from "../config-module/config.service";
import { EmailConfigService } from "../config-module/email-config.service";
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly emailConfigService: EmailConfigService) {
    this.transporter = this.emailConfigService.createTransporter();
  }

  private readTemplate(templateName: string): string {
    const filePath = path.resolve(__dirname, `../../templates/${templateName}`);
    return fs.readFileSync(filePath, 'utf-8');
  }

  private replaceTemplateVariables(template: string, variables: Record<string, string>): string {
    return Object.keys(variables).reduce((content, key) => {
      const value = variables[key];
      const regex = new RegExp(`{{${key}}}`, 'g');
      return content.replace(regex, value);
    }, template);
  }

  private async sendEmail(to: string, subject: string, htmlContent: string): Promise<void> {
    const mailOptions = {
      from: config.getString('EMAIL_USER'),
      to,
      subject,
      html: htmlContent,
    };
    await this.transporter.sendMail(mailOptions);
  }

  /**
   * Generic function to send any type of email.
   * 
   * @param to Recipient's email
   * @param subject Email subject
   * @param templateName Name of the template file (e.g. 'forgot-password.template.html')
   * @param variables Object containing placeholders and their values for replacement
   */
  async sendGenericEmail(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, string>
  ): Promise<void> {
    let htmlContent = this.readTemplate(templateName);
    htmlContent = this.replaceTemplateVariables(htmlContent, variables);
    await this.sendEmail(to, subject, htmlContent);
  }

  /**
   * Method to send both Forgot Password and Complete Registration emails
   * by utilizing the generic email function.
   */
  async sendTemplateEmail(
    to: string,
    subject: string,
    type: 'forgotPassword' | 'completeRegistration',
    dynamicValue: string
  ): Promise<void> {
    const templateMap = {
      forgotPassword: 'forgot-password.template.html',
      completeRegistration: 'complete-registration.template.html',
    };

    const urlMap = {
      forgotPassword: `${config.getString('FRONTEND_URL')}/reset-password`,
      completeRegistration: `${config.getString('FRONTEND_URL')}/complete-registration/${dynamicValue}`,
    };

    const templateName = templateMap[type];
    const url = urlMap[type];

    const variables = {
      [`${type}Url`]: url,
    };

    await this.sendGenericEmail(to, subject, templateName, variables);
  }
}
