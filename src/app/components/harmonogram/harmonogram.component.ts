import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NodeService } from 'src/app/services/node/node.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-harmonogram',
  templateUrl: './harmonogram.component.html',
  styleUrls: ['./harmonogram.component.css']
})

export class HarmonogramComponent implements OnInit {

  /** Today */
  @Input() public today;

  /** The page open with [xx, month, year] */
  @Input() public openPage;

  /** Currently selected date */
  @Input() public selectedDate;

  /** Array with all the calendar data */
  @Input() public calendar: any[] = [];

  /** Emits the new date on change */
  @Output() change: EventEmitter<any> = new EventEmitter();

  minMax: any;

  //laczenie td w DOM
  arrayAttrDuzy: any = [];
  arrayAttrMaly: any = [];

  //czerwony kolor jesli ktos juz zarezerwowal
  rezDuzyFinal: any = [];
  rezMalyFinal: any = [];

  showSpinner: boolean = false;
  arrayTest: any = [];
  arrayTest2: any = [];
  tooltipsButtonDuzy: any = [];
  tooltipsButtonMaly: any = [];
  displayedColumns: string[] = ['time', 'duzy', 'maly'];
  godzinyOtwarcia: any = [];

  //mozliwe godziny otwarcia orlika
  ELEMENT_DATA: PeriodicElement[] = [
    { time: "16:00 - 17:00", duzy: 'Wolny termin', maly: 'Wolny termin' },
    { time: "17:00 - 18:00", duzy: 'Wolny termin', maly: 'Wolny termin' },
    { time: "18:00 - 19:00", duzy: 'Wolny termin', maly: 'Wolny termin' },
    { time: "19:00 - 20:00", duzy: 'Wolny termin', maly: 'Wolny termin' },
    { time: "20:00 - 21:00", duzy: 'Wolny termin', maly: 'Wolny termin' },
    { time: "21:00 - 22:00", duzy: 'Wolny termin', maly: 'Wolny termin' }
  ];

  //godziny otwarcia dla konkretnego miesiaca
  ELEMENT_DATA_BLOCK: Block[] = [
    { miesiac: "Styczeń", godziny: '18:00 - 20:00' },
    { miesiac: "Luty", godziny: '18:00 - 20:00' },
    { miesiac: "Marzec", godziny: '18:00 - 20:00' },
    { miesiac: "Kwiecień", godziny: '18:00 - 20:00' },
    { miesiac: "Maj", godziny: '18:00 - 20:00' },
    { miesiac: "Czerwiec", godziny: '18:00 - 20:00' },
    { miesiac: "Lipiec", godziny: '18:00 - 20:00' },
    { miesiac: "Sierpień", godziny: '17:00 - 21:00' },
    { miesiac: "Wrzesień", godziny: '17:00 - 21:00' },
    { miesiac: "Październik", godziny: '16:00 - 21:00' },
    { miesiac: "Listopad", godziny: '16:00 - 21:00' },
    { miesiac: "Grudzień", godziny: '18:00 - 20:00' }
  ];

  /** Constants */
  public readonly monthNames =
    [
      'Styczeń', 'Luty', 'Marzec', 'Kwiecień',
      'Maj', 'Czerwiec', 'Lipiec', 'Sierpień',
      'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];

  constructor(private nodeService: NodeService, private functionsService: FunctionsService) { }

  /** Change the month +1 or -1 */
  changeMonth(diff: number) {

    this.showSpinner = true;
    this.openPage.date += diff;
    let numOfDays = Number(this.getDaysOfMonth(this.openPage.month, this.openPage.year));

    // czyszczenie zmiennych
    this.rezDuzyFinal = [];
    this.rezMalyFinal = [];
    this.arrayAttrDuzy = [];
    this.arrayAttrMaly = [];
    this.arrayTest = [];
    this.arrayTest2 = [];
    this.tooltipsButtonDuzy = [];
    this.tooltipsButtonMaly = [];
    for (let i = 0; i < this.godzinyOtwarcia.length; i++) {
      this.godzinyOtwarcia[i].duzy = "Wolny termin"
      this.godzinyOtwarcia[i].maly = "Wolny termin"
    }

    /* See if the year switches */
    if (this.openPage.month >= 12) {
      this.openPage.month = 0;
      this.openPage.year++;
    } else if (this.openPage.month < 0) {
      this.openPage.month = 11;
      this.openPage.year--;
    }

    if (this.openPage.date < 1) {
      this.openPage.month += diff;
      numOfDays = Number(this.getDaysOfMonth(this.openPage.month, this.openPage.year));
      this.openPage.date = numOfDays;
      let splits: string[] = this.ELEMENT_DATA_BLOCK[this.openPage.month].godziny.split(' ', 3);
      this.checkOpenHour(splits);
    } else if (this.openPage.date > numOfDays) {
      this.openPage.month += diff;
      this.openPage.date = 1;
      let splits: string[] = this.ELEMENT_DATA_BLOCK[this.openPage.month].godziny.split(' ', 3);
      this.checkOpenHour(splits);
    }

    // pobierz rezerwacje z konkretnego dnia
    this.minMax = {
      min: (this.openPage.year + "-" + this.functionsService.addZero(this.openPage.month + 1, 2) + "-" + this.openPage.date + "T" + "14:00:00.000Z"),
      max: (this.openPage.year + "-" + this.functionsService.addZero(this.openPage.month + 1, 2) + "-" + this.openPage.date + "T" + "22:00:00.000Z")
    }

    // wyświetl rezerwacje jeśli istnieją
    this.nodeService.sendToAPIData(this.minMax).subscribe(post => {
      this.functionsService.showRezerwation(post, this.godzinyOtwarcia);
      this.showSpinner = false;
    });

  }

  /** Gets the DaysPerMonth array */
  getDaysOfMonth(month: number, year: number): number {
    /* Check leap years if February */
    if (month === 1 && this.leapYear(year)) {
      return 29;
    }

    /** Return the number of days */
    return [31, 28, 31, 30, 31, 30,
      31, 31, 30, 31, 30, 31][month];
  }

  /** Returns true if leap year */
  leapYear(year): boolean {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }

  checkOpenHour(splits) {
    this.godzinyOtwarcia = [];

    this.ELEMENT_DATA.forEach((data, index) =>{
      if(data.time.split(' ', 3)[0] == splits[0]){
        this.godzinyOtwarcia.push(index)
      } else if(data.time.split(' ', 3)[0] == splits[2]){
        this.godzinyOtwarcia.push(index-1)
      }
    })

    //uzupelniamy liczby 
    let converter: number[] = []
 
    for (let i = this.godzinyOtwarcia[0]; i <= this.godzinyOtwarcia[1]; i++) {
      converter.push(i)
    }

    //czyscimy zmienna
    this.godzinyOtwarcia = [];

    for (let i = 0; i < converter.length; i++) {
      for (let j = 0; j < this.ELEMENT_DATA.length; j++) {
        if (converter[i] === this.ELEMENT_DATA.indexOf(this.ELEMENT_DATA[j])) {
          this.godzinyOtwarcia.push(this.ELEMENT_DATA[j])
        }
      }
    }

    return this.godzinyOtwarcia;
  }

  ngOnInit() {
    this.calendar = [];
    this.today = this.functionsService.getToday();
    this.openPage = { ...this.today };
    this.selectedDate = { ...this.today };
    this.showSpinner = true;
    this.minMax = {
      min: (this.functionsService.getToday().year + "-" + this.functionsService.addZero(this.functionsService.getToday().month + 1, 2) + "-" + this.functionsService.getToday().date + "T" + "14:00:00.000Z"),
      max: (this.functionsService.getToday().year + "-" + this.functionsService.addZero(this.functionsService.getToday().month + 1, 2) + "-" + this.functionsService.getToday().date + "T" + "22:00:00.000Z")
    }

    this.nodeService.sendToAPIData(this.minMax).subscribe(post => {
      this.functionsService.showRezerwation(post, this.godzinyOtwarcia);
      this.showSpinner = false;
    }, error => {
        console.log("Problem z połączeniem i pobraniem danych")
    });

    this.functionsService.getData().subscribe(data => {
      this.tooltipsButtonDuzy = data.tooltipsButtonDuzy;
      this.tooltipsButtonMaly = data.tooltipsButtonMaly;
      this.rezDuzyFinal = data.rezDuzyFinal;
      this.rezMalyFinal = data.rezMalyFinal;
      this.arrayAttrDuzy = data.arrayAttrDuzy;
      this.arrayAttrMaly = data.arrayAttrMaly;
      this.arrayTest = data.arrayTest;
      this.arrayTest2 = data.arrayTest2;
    })

    let splits: string[] = this.ELEMENT_DATA_BLOCK[this.openPage.month].godziny.split(' ', 3);
    this.checkOpenHour(splits);
  }
}

export interface PeriodicElement {
  duzy: any;
  time: string;
  maly: string;
}

export interface Block {
  miesiac: string;
  godziny: string;
}
