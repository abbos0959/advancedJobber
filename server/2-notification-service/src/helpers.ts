import path from 'path';

import { IEmailLocals, winstonLogger } from '@abbos0959/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import Email from 'email-templates';
import nodemailer, { Transporter } from 'nodemailer';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailtransportHelper', 'debug');

async function emailTemplate(template: string, receiver: string, locals: IEmailLocals): Promise<void> {
  console.log(receiver, 'receivercha');
  try {
    const smtpTransporter: Transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD
      }
    });

    const email: Email = new Email({
      message: {
        from: `Bu advanced backend kursi uchun  yuborlimoqda <${config.SENDER_EMAIL}>`
      },
      send: true,
      preview: false,
      transport: smtpTransporter,
      views: {
        options: {
          extension: 'ejs'
        }
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build')
        }
      }
    });
    await email.send({
      template: path.join(__dirname, '..', 'src/emails', template),
      message: { to: receiver },
      locals
    });
  } catch (error) {
    console.log(error);
    log.error(error);
    // console.log(error);
  }
}
export { emailTemplate };
