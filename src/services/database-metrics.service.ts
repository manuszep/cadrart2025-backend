import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

interface IConnectionMetrics {
  activeConnections: number;
  busyConnections: number;
  totalConnections: number;
  idleConnections: number;
}

interface IQueryMetrics {
  slowQueries: number;
  activeQueries: number;
}

interface IDatabaseSize {
  sizeMB: number;
}

interface ITableMetric {
  table_name: string;
  table_rows: number;
  size_mb: number;
}

interface IPoolInfo {
  total?: number;
  idle?: number;
}

@Injectable()
export class DatabaseMetricsService {
  private readonly logger = new Logger('DatabaseMetrics');

  constructor(private dataSource: DataSource) {}

  async getConnectionMetrics(): Promise<IConnectionMetrics> {
    try {
      const connection = this.dataSource.driver;

      // For MySQL, we need to query the information schema
      const result = await this.dataSource.query(`
        SELECT
          COUNT(*) as active_connections,
          (SELECT COUNT(*) FROM information_schema.processlist WHERE command != 'Sleep') as busy_connections
        FROM information_schema.processlist
        WHERE db = DATABASE()
      `);

      // Try to access pool information if available
      const pool = (connection as { pool?: IPoolInfo }).pool;

      return {
        activeConnections: result[0]?.active_connections || 0,
        busyConnections: result[0]?.busy_connections || 0,
        totalConnections: pool?.total || 0,
        idleConnections: pool?.idle || 0
      };
    } catch (error) {
      this.logger.error('Failed to get connection metrics', error);
      return {
        activeConnections: 0,
        busyConnections: 0,
        totalConnections: 0,
        idleConnections: 0
      };
    }
  }

  async getQueryMetrics(): Promise<IQueryMetrics> {
    try {
      // Get slow queries count (queries taking more than 1 second)
      const slowQueriesResult = await this.dataSource.query(`
        SELECT COUNT(*) as slow_count
        FROM information_schema.processlist
        WHERE db = DATABASE() AND time > 1
      `);

      // Get active queries count
      const activeQueriesResult = await this.dataSource.query(`
        SELECT COUNT(*) as active_count
        FROM information_schema.processlist
        WHERE db = DATABASE() AND command != 'Sleep'
      `);

      return {
        slowQueries: slowQueriesResult[0]?.slow_count || 0,
        activeQueries: activeQueriesResult[0]?.active_count || 0
      };
    } catch (error) {
      this.logger.error('Failed to get query metrics', error);
      return {
        slowQueries: 0,
        activeQueries: 0
      };
    }
  }

  async getDatabaseSize(): Promise<IDatabaseSize> {
    try {
      const result = await this.dataSource.query(`
        SELECT
          ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
      `);

      return {
        sizeMB: result[0]?.size_mb || 0
      };
    } catch (error) {
      this.logger.error('Failed to get database size', error);
      return {
        sizeMB: 0
      };
    }
  }

  async getTableMetrics(): Promise<ITableMetric[]> {
    try {
      const result = await this.dataSource.query(`
        SELECT
          table_name,
          table_rows,
          ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
        ORDER BY (data_length + index_length) DESC
        LIMIT 10
      `);

      return result;
    } catch (error) {
      this.logger.error('Failed to get table metrics', error);
      return [];
    }
  }
}
