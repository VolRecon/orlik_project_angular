import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NodeService } from 'src/app/services/node/node.service';
import { HarmonogramComponent } from '../harmonogram/harmonogram.component';

@Component({
  selector: 'app-calendar-days',
  templateUrl: './calendar-days.component.html',
  styleUrls: ['./calendar-days.component.css']
})

export class CalendarDaysComponent implements OnInit {

  displayedColumns: string[] = ['time', 'duzy', 'maly'];
  dataSource = this.harmonogram.ELEMENT_DATA;
  godzinyOtwarcia: any = [];

  rezDuzyFinal: any = [];
  rezMalyFinal: any = [];


  arrayAttrDuzy: any = []
  arrayAttrMaly: any = []
  arrayTest: any = []
  arrayTest2: any = []

  //tablice przechowywujace wybor konkretnych pol
  selectedRezDuzy: any[];
  selectedRezMaly: any[];

  rezerwacjaDuzy: any = [];
  rezerwacjaMaly: any = [];

  //Objekt dwu elementowy przechowujacy informacje o wybranych rezerwacjach
  rezerwacjaWszystkie: any = [];

  //tablica z poprawionymi godzinami otwarcia 
  @Output() tmpCorrectArray: EventEmitter<any> = new EventEmitter();

  isSelectDuzy: boolean = true;
  isSelectMaly: boolean = true;
  @Output() isSelectDuzySend: EventEmitter<boolean> = new EventEmitter();
  @Output() isSelectMalySend: EventEmitter<boolean> = new EventEmitter();

  //wysyla objekt rezerwacjaWszystkie do innego komponentu 
  @Output() rezerwacjaWszystkieSend: EventEmitter<any> = new EventEmitter();
  
  @Input() clickedMonth: any;
  @Input() Click: boolean = false;
  @Input() rezerwationsData: any;

  constructor(public nodeService: NodeService, private harmonogram: HarmonogramComponent) { }

  ngOnChanges(changes) {
    if (changes.clickedMonth != undefined) {
      if (this.harmonogram.ELEMENT_DATA_BLOCK[changes.clickedMonth.currentValue] != undefined) {
        this.monthChanged(changes);
      }
    }

    if (changes.Click == undefined) { }
    else {
      if (changes.Click.currentValue === true && changes.Click != "undefined") {
        this.rezerwacjaWszystkieSend.emit(this.rezerwacjaWszystkie);
      }
    }

    if (changes.rezerwationsData != undefined) {
      if(changes.rezerwationsData.currentValue.rezDuzyFinal != undefined){
        this.rezDuzyFinal = changes.rezerwationsData.currentValue.rezDuzyFinal;
      } 

      if(changes.rezerwationsData.currentValue.rezMalyFinal != undefined){
        this.rezMalyFinal = changes.rezerwationsData.currentValue.rezMalyFinal;
      } 

      if(changes.rezerwationsData.currentValue.arrayAttrDuzy != undefined){
        this.arrayAttrDuzy = changes.rezerwationsData.currentValue.arrayAttrDuzy;
      }

      if(changes.rezerwationsData.currentValue.arrayAttrMaly != undefined){
        this.arrayAttrMaly = changes.rezerwationsData.currentValue.arrayAttrMaly;
      }

      if(changes.rezerwationsData.currentValue.arrayTest != undefined){
        this.arrayTest = changes.rezerwationsData.currentValue.arrayTest;
      }

      if(changes.rezerwationsData.currentValue.arrayTest2 != undefined){
        this.arrayTest2 = changes.rezerwationsData.currentValue.arrayTest2;
      }

    }
  }

  monthChanged(changes) {

    let splits = this.harmonogram.ELEMENT_DATA_BLOCK[changes.clickedMonth.currentValue].godziny.split(' ');
    let splitsElements: any = [];
    this.godzinyOtwarcia = [];
    let tmpArray = [];

    for (let element of this.harmonogram.ELEMENT_DATA) {
      splitsElements.push(element.time.split(' ', 3));
    }

    for (let i = 0; i < splitsElements.length; i++) {
      if (splitsElements[i][0] == splits[0]) {
        this.godzinyOtwarcia.push(i)
      } else if (splitsElements[i][2] == splits[2]) {
        this.godzinyOtwarcia.push(i)
      }
    }

    //uzupelniamy liczby 
    let converter: any = []
    for (let i = this.godzinyOtwarcia[0]; i <= this.godzinyOtwarcia[1]; i++) {
      converter.push(i)
    }

    //czyscimy zmienna
    this.godzinyOtwarcia = [];

    for (let i = 0; i < converter.length; i++) {
      for (let j = 0; j < this.harmonogram.ELEMENT_DATA.length; j++) {
        if (converter[i] === this.harmonogram.ELEMENT_DATA.indexOf(this.harmonogram.ELEMENT_DATA[j])) {
          this.godzinyOtwarcia.push(this.harmonogram.ELEMENT_DATA[j])
        }
      }
    }

    for (let i = 0; i < this.godzinyOtwarcia.length; i++) {
      if (this.godzinyOtwarcia[i].time.split(" ", 3)[0] == "16:00") {
        tmpArray[0] = this.godzinyOtwarcia[i].time;
      } else if (this.godzinyOtwarcia[i].time.split(" ", 3)[0] == "17:00") {
        tmpArray[1] = this.godzinyOtwarcia[i].time;
      } else if (this.godzinyOtwarcia[i].time.split(" ", 3)[0] == "18:00") {
        tmpArray[2] = this.godzinyOtwarcia[i].time;
      } else if (this.godzinyOtwarcia[i].time.split(" ", 3)[0] == "19:00") {
        tmpArray[3] = this.godzinyOtwarcia[i].time;
      } else if (this.godzinyOtwarcia[i].time.split(" ", 3)[0] == "20:00") {
        tmpArray[4] = this.godzinyOtwarcia[i].time;
      } else if (this.godzinyOtwarcia[i].time.split(" ", 3)[0] == "21:00") {
        tmpArray[5] = this.godzinyOtwarcia[i].time;
      } else { }
    }

    this.tmpCorrectArray.emit(tmpArray);
  }

  //pobierz wartosc rezerwacji i sprawdz czy juz tu nie wystepuje rezerawcja
  takeValueCol(event, i, value) {

    if (value == "Duzy") {
      if (this.rezDuzyFinal.indexOf(i) < 0) {
        if (this.selectedRezDuzy.indexOf(i) < 0) {
          this.selectedRezDuzy.push(i);
          this.godzinyOtwarcia[i].duzy = "Chcę zarezerwować";
          if (this.selectedRezDuzy.length == 0) {
            this.isSelectDuzy = true;
          } else {
            this.isSelectDuzy = false;
          }
          this.isSelectDuzySend.emit(this.isSelectDuzy);
        } else {
          this.selectedRezDuzy.splice(this.selectedRezDuzy.indexOf(i), 1)
          this.godzinyOtwarcia[i].duzy = "Wolny termin";
          if (this.selectedRezDuzy.length == 0) {
            this.isSelectDuzy = true;
          } else {
            this.isSelectDuzy = false;
          }
          this.isSelectDuzySend.emit(this.isSelectDuzy);
        }
      }

      let data = {
        kolumna: "Duze boisko",
        godziny: this.rezerwacjaDuzy
      }

      if (event.duzy == "Chcę zarezerwować") {
        // 1 - kliknieto kolumne o indeksie 1
        let n = this.rezerwacjaDuzy.includes(i);
        if (n === false) {
          this.rezerwacjaDuzy.push(i);

          this.rezerwacjaWszystkie[0] = data;
        }
      } else {
        const index: number = this.rezerwacjaDuzy.indexOf(i);
        this.rezerwacjaDuzy.splice(index, 1);
      }
    } else {
      if (this.rezMalyFinal.indexOf(i) < 0) {
        if (this.selectedRezMaly.indexOf(i) < 0) {
          this.selectedRezMaly.push(i);
          this.godzinyOtwarcia[i].maly = "Chcę zarezerwować";
          if (this.selectedRezMaly.length == 0) {
            this.isSelectMaly = true;
          } else {
            this.isSelectMaly = false;
          }
          this.isSelectMalySend.emit(this.isSelectMaly);
        } else {
          this.selectedRezMaly.splice(this.selectedRezMaly.indexOf(i), 1)
          this.godzinyOtwarcia[i].maly = "Wolny termin";
          if (this.selectedRezMaly.length == 0) {
            this.isSelectMaly = true;
          } else {
            this.isSelectMaly = false;
          }
          this.isSelectMalySend.emit(this.isSelectMaly);
        }
      }

      let data = {
        kolumna: "Male boisko",
        godziny: this.rezerwacjaMaly
      }

      if (event.maly == "Chcę zarezerwować") {
        // 1 - kliknieto kolumne o indeksie 1
        let n = this.rezerwacjaMaly.includes(i);
        if (n === false) {
          this.rezerwacjaMaly.push(i);
          this.rezerwacjaWszystkie[1] = data;
        }
      } else {
        const index: number = this.rezerwacjaMaly.indexOf(i);
        this.rezerwacjaMaly.splice(index, 1);
      }
    }
  }

  ngOnInit() {
    this.selectedRezDuzy = [];
    this.selectedRezMaly = [];
    
    let data1 = {
      kolumna: 'Duze boisko',
      godziny: []
    }

    let data2 = {
      kolumna: 'Male boisko',
      godziny: []
    }

    this.rezerwacjaWszystkie[0] = data1;
    this.rezerwacjaWszystkie[1] = data2;
  }
}

export interface PeriodicElement {
  duzy: string;
  time: string;
  maly: string;
}

export interface Block {
  miesiac: string;
  godziny: string;
}
