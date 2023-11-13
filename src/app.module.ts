import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';
import { CatsModule } from './cats/cats.module';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  imports: [CatsModule],
})
export class AppModule {}
