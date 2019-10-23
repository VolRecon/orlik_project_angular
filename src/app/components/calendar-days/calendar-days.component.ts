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

  @Output() isSelectDuzySend: EventEmitter<boolean> = new EventEmitter();
  @Output() isSelectMalySend: EventEmitter<boolean> = new EventEmitter();

  //wysyla objekt rezerwacjaWszystkie do innego komponentu 
  @Output() rezerwacjaWszystkieSend: EventEmitter<any> = new EventEmitter();

  @Input() clickedMonth: any;
  @Input() Click: boolean = false;
  @Input() rezerwationsData: any;

  constructor(public nodeService: NodeService, private harmonogram: HarmonogramComponent,
    private harmonogramComponent: HarmonogramComponent) { }

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
      if (changes.rezerwationsData.currentValue.rezDuzyFinal != undefined) {
        this.rezDuzyFinal = changes.rezerwationsData.currentValue.rezDuzyFinal;
      }

      if (changes.rezerwationsData.currentValue.rezMalyFinal != undefined) {
        this.rezMalyFinal = changes.rezerwationsData.currentValue.rezMalyFinal;
      }

      if (changes.rezerwationsData.currentValue.arrayAttrDuzy != undefined) {
        this.arrayAttrDuzy = changes.rezerwationsData.currentValue.arrayAttrDuzy;
      }

      if (changes.rezerwationsData.currentValue.arrayAttrMaly != undefined) {
        this.arrayAttrMaly = changes.rezerwationsData.currentValue.arrayAttrMaly;
      }

      if (changes.rezerwationsData.currentValue.arrayTest != undefined) {
        this.arrayTest = changes.rezerwationsData.currentValue.arrayTest;
      }

      if (changes.rezerwationsData.currentValue.arrayTest2 != undefined) {
        this.arrayTest2 = changes.rezerwationsData.currentValue.arrayTest2;
      }

    }
  }

  monthChanged(changes) {
    let splits = this.harmonogram.ELEMENT_DATA_BLOCK[changes.clickedMonth.currentValue].godziny.split(' ');
    this.godzinyOtwarcia = [];
    this.godzinyOtwarcia = this.harmonogramComponent.checkOpenHour(splits);
    let tmpArray = [];

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
    if (value == "Duze boisko") {
      this.preparingReservations(event, i, value, this.rezDuzyFinal, this.selectedRezDuzy, this.godzinyOtwarcia, this.isSelectDuzySend, this.rezerwacjaDuzy)
    } else {
      this.preparingReservations(event, i, value, this.rezMalyFinal, this.selectedRezMaly, this.godzinyOtwarcia, this.isSelectMalySend, this.rezerwacjaMaly)
    }
  }

  preparingReservations(event, i, value, rezFinal, selectedRez, godzinyOtwarcia, isSelectSend, rezerwacja) {
    if (rezFinal.indexOf(i) < 0) {
      if (selectedRez.indexOf(i) < 0) {
        selectedRez.push(i);
        if (value == "Duze boisko" ? godzinyOtwarcia[i].duzy = "Chcę zarezerwować" : godzinyOtwarcia[i].maly = "Chcę zarezerwować") { }
        if (selectedRez.length == 0 ? isSelectSend.emit(true) : isSelectSend.emit(false)) { }
      } else {
        selectedRez.splice(selectedRez.indexOf(i), 1)
        if (value == "Duze boisko" ? godzinyOtwarcia[i].duzy = "Chcę zarezerwować" : godzinyOtwarcia[i].maly = "Chcę zarezerwować") { }
        if (selectedRez.length == 0 ? isSelectSend.emit(true) : isSelectSend.emit(false)) { }
      }
    }

    let data = {
      kolumna: value,
      godziny: rezerwacja
    }

    if (value == "Duze boisko" ? event.duzy == "Chcę zarezerwować" : event.maly == "Chcę zarezerwować") {
      // 1 - kliknieto kolumne o indeksie 1
      if (rezerwacja.includes(i) === false) {
        rezerwacja.push(i);
        if (value == "Duze boisko" ? this.rezerwacjaWszystkie[0] = data : this.rezerwacjaWszystkie[1] = data) { }
      }
    } else {
      rezerwacja.splice(rezerwacja.indexOf(i), 1);
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
