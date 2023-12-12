import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Aaa } from './entity/Add';
import { createClient } from 'redis';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      //host: "192.168.1.6",
      host: "mysql-container",
      port: 3306,
      username: "root",
      password: "test123",
      database: "aaa",
      synchronize: true,
      logging: true,
      entities: [Aaa],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: 'REDIS_CLIENT',
    async useFactory() {
      const client = createClient({
        socket: {
          host: 'redis-container',
          port: 6379
        }
      });
      await client.connect();
      return client;
    }
  }],
})
export class AppModule {}
