import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { parse } from 'node-html-parser';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  async getCalendar(year: number, month: number): Promise<any> {
    let query = 'http://www.weeia.p.lodz.pl/pliki_strony_kontroler/kalendarz.php?';
    query += 'rok=' + year.toString() + '&';
    query += 'miesiac=' + month.toString();
    const response = await this.httpService.get(query).toPromise();
    const htmlData = response.data;
    const root = parse(htmlData);
    console.log(root.firstChild.toString());
    return root.firstChild.toString();
  }
}