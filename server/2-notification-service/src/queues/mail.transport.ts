import { IEmailLocals, winstonLogger } from '@abbos0959/jobber-shared';
import { config } from '@notifications/config';
import { emailTemplate } from '@notifications/helpers';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransport', 'debug');

async function sendEmail(template: string, reseiviedEmail: string, locals: IEmailLocals): Promise<void> {
  try {
    emailTemplate(template, reseiviedEmail, locals);
    log.info('email muvaffaqqiyatli yuborildi');
  } catch (error) {
    console.log(error, 'nimadir boldida');
    log.log('error', 'Notification send email xatoligi sendEmail funksiyasi', error);
  }
}

export { sendEmail };
