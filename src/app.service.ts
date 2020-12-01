import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { parse } from 'node-html-parser';

export type Event = {
  day: number,
  name: string,
  hyperlink: string
};

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
    return root;
  }

  getEvents(htmlData: any): Event[] {
    const root = parse(htmlData);
    const activeClasses = root.querySelectorAll('.active');
    let events: Event[] = [];
    activeClasses.forEach(activeClass => {
      if (activeClass.rawTagName === 'td') {
        const activeHyperlink = activeClass.querySelector('.active');
        if (activeHyperlink) {
          const innerBox = activeClass.querySelector('.InnerBox');
          if (innerBox) {
            const eventNameWrapper = (() => {
              const p = innerBox.querySelector('p');
              if (p) {
                return p;
              }
              return innerBox.querySelector('div');
            }) ();
            if (eventNameWrapper) {
              events.push({
                day: parseInt(activeHyperlink.rawText),
                name: eventNameWrapper.rawText,
                hyperlink: activeHyperlink.getAttribute('href')
              });
            }
          }
        }
      }
    });
    return events;
}