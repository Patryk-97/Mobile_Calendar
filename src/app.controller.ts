import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('year=:year&month=:month')
  async getCalendar(@Param('year') year: number, @Param('month') month: number): Promise<any> {
    return await this.appService.getCalendar(year, month);
  }
}