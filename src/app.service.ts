import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  async getCalendar(year: number, month: number): Promise<AxiosResponse<any>> {
    let query = 'http://www.weeia.p.lodz.pl/pliki_strony_kontroler/kalendarz.php?';
    query += 'year=' + year.toString() + '&';
    query += 'month=' + month.toString();
    return await this.httpService.get(query).toPromise();
  }
}
