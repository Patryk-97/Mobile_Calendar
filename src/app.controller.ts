import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('year=:year&month=:month')
  getCalendar(@Param('year') year: string, @Param('month') month: string): string {
    return year + " " + month;
  }
}
