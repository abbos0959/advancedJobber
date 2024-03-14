import { winstonLogger } from '@abbos0959/jobber-shared';
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@notifications/config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationsElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

export async function checkConnection(): Promise<void> {
  let isConnect = false;

  while (!isConnect) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});

      log.info('notificationService health  status: ', health.status);
      isConnect = true;
    } catch (error) {
      log.error('ElasticSearchga ulanishda xatolik sodir bo`ldi qaytadan urinib ko`ring');

      log.log('ElasticSearchga ulanishdagi method xatoliki  ', error);
    }
  }
}
