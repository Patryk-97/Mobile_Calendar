import { Controller, Get, Header, HttpCode, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('year=:year&month=:month')
  @HttpCode(201)
  @Header('Content-Type', 'text/calendar')
  @Header('Content-Disposition', 'attachment; filename=calendar.ics')
  async getCalendar(@Param('year') year: number, @Param('month') month: number): Promise<any> {
    return await this.appService.getCalendarFileContent(year, month);
  }
}