import 'express-async-errors';
// import http from 'http';

import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express';
import { IEmailMessageDetails, winstonLogger } from '@abbos0959/jobber-shared';
import { healterouter } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMEssage, consumeOrderEmailMEssage } from '@notifications/queues/email.consumer';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationsServer', 'debug');

export function start(app: Application): void {
  startServer(app);

  app.use('', healterouter);
  startQueue();
  startElasticSearch();
}

async function startQueue(): Promise<void> {
  const emailChannel = (await createConnection()) as Channel;

  await consumeAuthEmailMEssage(emailChannel);
  await consumeOrderEmailMEssage(emailChannel);
  const verifylinkcha = `${config.CLIENT_URL}/confirm_email?v_token=21212ddsdsd`;

  const messageDetails: IEmailMessageDetails = {
    receiverEmail: `${config.SENDER_EMAIL}`,
    resetLink: verifylinkcha,
    template: 'forgotPassword',
    username: 'Abbos'
  };

  await emailChannel.assertExchange('jobber-email-notification', 'direct');
  const message = JSON.stringify(messageDetails);
  emailChannel.publish('jobber-email-notification', 'auth-email', Buffer.from(message));
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    // const httpServer: http.Server = new http.Server(app);

    log.info(`Server ishlamoqda va idsi ${process.pid} ga teng`);

    app.listen(SERVER_PORT, () => {
      log.info(`server  ${SERVER_PORT} portda ishlamoqda`);
    });
    console.log('sa');
  } catch (error) {
    log.log('error', 'NotificationServer startServer() method error', error);
  }
}
