import { winstonLogger } from '@abbos0959/jobber-shared';
import { config } from '@notifications/config';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationqueeConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);

    const channel: Channel = await connection.createChannel();
    log.info('rabbitmq sevrver ishladi ');
    closeConnection(channel, connection);

    return channel;
  } catch (error) {
    log.log('error,', 'notificationqueeConnection service methods xatoligi', error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: Connection) {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}

export { createConnection };
