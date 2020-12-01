import { HttpService, Injectable } from '@nestjs/common';
import { parse } from 'node-html-parser';

const ics = require('ics');

type Event = {
  day: number,
  name: string,
  hyperlink: string
};

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  async getCalendarFileContent(year: number, month: number): Promise<any> {
    let query = 'http://www.weeia.p.lodz.pl/pliki_strony_kontroler/kalendarz.php?';
    query += 'rok=' + year.toString() + '&';
    query += 'miesiac=' + month.toString();
    const response = await this.httpService.get(query).toPromise();
    const htmlData = response.data;
    let events: Event[] = this.getEvents(htmlData);
    let icsEvents = [];
    events.forEach(event => {
      console.log(event);
 
      const icsEvent = {
        start: [year, month, event.day],
        end: [year, month, event.day],
        title: event.name,
        description: event.name,
        url: event.hyperlink
      };

      icsEvents.push(icsEvent);
    });

    const { error, value } = ics.createEvents(icsEvents);

    if (error) {
      console.log(error);
      return false;
    }
    return value;
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
}