import { IEmailLocals, winstonLogger } from '@abbos0959/jobber-shared';
import { config } from '@notifications/config';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@notifications/queues/connection';
import { sendEmail } from './mail.transport';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');

async function consumeAuthEmailMEssage(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }

    const exchanheName = 'jobber-email-notification';
    const routingkey = 'auth-email';
    const queueName = 'auth-email-queue';

    await channel.assertExchange(exchanheName, 'direct');

    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });

    await channel.bindQueue(jobberQueue.queue, exchanheName, routingkey);
    await channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const {
        receiverEmail,
        username,
        resetLink,
        template,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      } = JSON.parse(msg!.content.toString());
      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://miro.medium.com/v2/resize:fit:554/1*q3YCDsCYr438DN9k6iSziQ.jpeg',
        username,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total,
        resetLink
      };

      if (template === 'orderPlaced') {
        await sendEmail('orderPlaced', receiverEmail, locals);
        await sendEmail('orderReceipt', receiverEmail, locals);
      } else {
        await sendEmail(template, receiverEmail, locals);
      }
      channel.ack(msg!);

      // console.log(JSON.parse(msg!.content.toString()));

      // const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg!.content.toString());
      // console.log(username, 'bureseiver');

      // const locals: IEmailLocals = {
      //   appLink: `${config.CLIENT_URL}`,
      //   appIcon:
      //     'https://s.cafebazaar.ir/images/icons/com.StylishDpGirls.DPGirlsHDWallpaperDpzGirlsPhotos-9db48fd3-e251-44b7-820e-902054dc06e4_512x512.png?x-img=v1/resize,h_256,w_256,lossless_false/optimize',

      //   username,
      //   verifyLink,
      //   resetLink
      // };

      // await sendEmail(template, receiverEmail, locals);
    });
  } catch (error) {
    log.log('error', 'notificationserver emailconsumer error', error);
  }
}

async function consumeOrderEmailMEssage(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }

    const exchanheName = 'jobber-order-notification';
    const routingkey = 'order-email';
    const queueName = 'order-email-queue';

    await channel.assertExchange(exchanheName, 'direct');

    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });

    await channel.bindQueue(jobberQueue.queue, exchanheName, routingkey);
    await channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      console.log(JSON.parse(msg!.content.toString()));
    });
  } catch (error) {
    log.log('error', 'notificationserver emailconsumer error', error);
  }
}

export { consumeAuthEmailMEssage, consumeOrderEmailMEssage };
