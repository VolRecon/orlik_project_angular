import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

godzinyOtwarcia: any = [];

private dataSend = new Subject<any>();
data = {
  tooltipsButtonDuzy: [],
  tooltipsButtonMaly: [],
  rezDuzyFinal: [],
  rezMalyFinal: [],
  arrayAttrDuzy: [],
  arrayAttrMaly: [],
  arrayTest: [],
  arrayTest2: []
}

constructor() { }

  getData(){
    return this.dataSend.asObservable();
  }

  showRezerwation(post, godzinyOtw) {

    this.data.tooltipsButtonDuzy = [];
    this.data.tooltipsButtonMaly = [];
    this.data.rezDuzyFinal = [];
    this.data.rezMalyFinal = [];
    this.data.arrayAttrDuzy = [];
    this.data.arrayAttrMaly = [];
    this.data.arrayTest = [];
    this.data.arrayTest2 = [];

    this.godzinyOtwarcia = godzinyOtw;
    let splits = post.map(p => p.split(/T|:|-|<b>|<\/b>/));

    // jesli jest 2,3,4,5,6 rezerwacji tej samej osoby obok siebie
    for (let i = 0; i < splits.length; i++) {
      this.splitsHelper(splits, i);
      this.dataSend.next(this.data);
    }
  }

  splitsHelper(splits, i) {
    if (splits[i][10] - splits[i][3] == 2) {
      this.rezMergeTd(splits, i, 2)
    } else if (splits[i][10] - splits[i][3] == 3) {
      this.rezMergeTd(splits, i, 3)
    } else if (splits[i][10] - splits[i][3] == 4) {
      this.rezMergeTd(splits, i, 4)
    } else if (splits[i][10] - splits[i][3] == 5) {
      this.rezMergeTd(splits, i, 5)
    } else if (splits[i][10] - splits[i][3] == 6) {
      this.rezMergeTd(splits, i, 6)
    } else {
      this.rezMergeTd(splits, i, 0)
    }
  }

  //laczy komorki td w DOM
  rezMergeTd(splits, i, number) {
    let tooltipsIndexHelp = [];
    let tooltipsIndex = {
      duzy: [],
      maly: []
    };
    let rezDuzy = [];
    let rezMaly = [];

    if (splits[i][10] - splits[i][3] == 1) {
      if (splits[i][14] == " Male Boisko ") {
        rezMaly.push(splits[i][3] + ":00");
        rezMaly.push(splits[i][10] + ":00");
        for (let y = 0; y < this.godzinyOtwarcia.length; y++) {
          if (this.godzinyOtwarcia[y].time.split(" ", 3)[0] == (+(splits[i][3])) + ":00") {
            this.data.tooltipsButtonMaly[this.godzinyOtwarcia.indexOf(this.godzinyOtwarcia[y])] = splits[i][25];
          }
        }
      } else {
        rezDuzy.push(splits[i][3] + ":00");
        rezDuzy.push(splits[i][10] + ":00");
        for (let y = 0; y < this.godzinyOtwarcia.length; y++) {
          if (this.godzinyOtwarcia[y].time.split(" ", 3)[0] == (+(splits[i][3])) + ":00") {
            this.data.tooltipsButtonDuzy[this.godzinyOtwarcia.indexOf(this.godzinyOtwarcia[y])] = splits[i][25];
          }
        }
      }
    } else {
      if (splits[i][14] == " Male Boisko ") {
        for (let j = 0; j < number; j++) {
          rezMaly.push((+(splits[i][3]) + j) + ":00");
          rezMaly.push((+(splits[i][10]) - (number - 1) + j) + ":00");
          for (let y = 0; y < this.godzinyOtwarcia.length; y++) {
            if (this.godzinyOtwarcia[y].time.split(" ", 3)[0] == (+(splits[i][3]) + j) + ":00") {
              tooltipsIndexHelp.push(this.godzinyOtwarcia.indexOf(this.godzinyOtwarcia[y]));
              this.data.tooltipsButtonMaly[this.godzinyOtwarcia.indexOf(this.godzinyOtwarcia[y])] = splits[i][25];
            }
          }
        }
        tooltipsIndex.maly.push(tooltipsIndexHelp);
        tooltipsIndexHelp = [];
        this.arrayNextTo(tooltipsIndex);
      } else {
        for (let j = 0; j < number; j++) {
          rezDuzy.push((+(splits[i][3]) + j) + ":00");
          rezDuzy.push((+(splits[i][10]) - (number - 1) + j) + ":00");
          for (let y = 0; y < this.godzinyOtwarcia.length; y++) {
            if (this.godzinyOtwarcia[y].time.split(" ", 3)[0] == (+(splits[i][3]) + j) + ":00") {
              tooltipsIndexHelp.push(this.godzinyOtwarcia.indexOf(this.godzinyOtwarcia[y]));
              this.data.tooltipsButtonDuzy[this.godzinyOtwarcia.indexOf(this.godzinyOtwarcia[y])] = splits[i][25];
            }
          }
        }
        tooltipsIndex.duzy.push(tooltipsIndexHelp);
        tooltipsIndexHelp = [];
        this.arrayNextTo(tooltipsIndex);
      }
    }

    this.rezText(rezDuzy, rezMaly); 
  }

  // tworzenie array ktory bedzie laczyl komorki jesli wystapia 2,3,4,5 obok siebie itd.
  arrayNextTo(tooltipsIndex) {
    //jezeli aktualnie robimy rezerwacje dla duzy
    if (tooltipsIndex.duzy.length > 0) {
      for (let i = 0; i < tooltipsIndex.duzy[0].length; i++) {
        if (tooltipsIndex.duzy[0].length == 2) {
          this.data.arrayAttrDuzy[tooltipsIndex.duzy[0][i]] = 2;
        } else if (tooltipsIndex.duzy[0].length == 3) {
          this.data.arrayAttrDuzy[tooltipsIndex.duzy[0][i]] = 3;
        } else if (tooltipsIndex.duzy[0].length == 4) {
          this.data.arrayAttrDuzy[tooltipsIndex.duzy[0][i]] = 4;
        } else if (tooltipsIndex.duzy[0].length == 5) {
          this.data.arrayAttrDuzy[tooltipsIndex.duzy[0][i]] = 5;
        } else if (tooltipsIndex.duzy[0].length == 6) {
          this.data.arrayAttrDuzy[tooltipsIndex.duzy[0][i]] = 6;
        }
      }

      for (let i = 0; i < this.godzinyOtwarcia.length-1; i++) {
        if (this.data.arrayAttrDuzy[i] == null || this.data.arrayAttrDuzy[i] == []) {
          this.data.arrayAttrDuzy[i] = "initial";
        }
      }
      this.deleteTd(this.data.arrayAttrDuzy, "Duzy");
    }

    //jezeli aktualnie robimy rezerwacje dla maly
    if (tooltipsIndex.maly.length > 0) {
      for (let i = 0; i < tooltipsIndex.maly[0].length; i++) {
        if (tooltipsIndex.maly[0].length == 2) {
          this.data.arrayAttrMaly[tooltipsIndex.maly[0][i]] = 2;
        } else if (tooltipsIndex.maly[0].length == 3) {
          this.data.arrayAttrMaly[tooltipsIndex.maly[0][i]] = 3;
        } else if (tooltipsIndex.maly[0].length == 4) {
          this.data.arrayAttrMaly[tooltipsIndex.maly[0][i]] = 4;
        } else if (tooltipsIndex.maly[0].length == 5) {
          this.data.arrayAttrMaly[tooltipsIndex.maly[0][i]] = 5;
        } else if (tooltipsIndex.maly[0].length == 6) {
          this.data.arrayAttrMaly[tooltipsIndex.maly[0][i]] = 6;
        }
      }

      for (let i = 0; i < this.godzinyOtwarcia.length-1; i++) {
        if (this.data.arrayAttrMaly[i] == null || this.data.arrayAttrMaly[i] == []) {
          this.data.arrayAttrMaly[i] = "initial";
        }
      }
      this.deleteTd(this.data.arrayAttrMaly, "Maly");
    }
  }

  //Zmiana tekstu z wolny termin na termin zarezerwowany i zmiana koloru na czerwony
  rezText(rezDuzy, rezMaly) {
    if (rezDuzy.length > 0) {
      for (let i = 0; i < rezDuzy.length; i++) {
        for (let j = 0; j < this.godzinyOtwarcia.length; j++) {
          // od godziny
          if (i % 2 == 0) {
            if (this.godzinyOtwarcia[j].time.split(" ", 3)[0] == rezDuzy[i]) {
              this.godzinyOtwarcia[j].duzy = "Termin zarezerwowany"
              this.data.rezDuzyFinal.push(this.godzinyOtwarcia.indexOf(this.godzinyOtwarcia[j]));
            }
          }
          // do godziny
          else {
            if (this.godzinyOtwarcia[j].time.split(" ", 3)[2] == rezDuzy[i]) {
              this.godzinyOtwarcia[j].duzy = "Termin zarezerwowany"
              this.data.rezDuzyFinal.push(this.godzinyOtwarcia.indexOf(this.godzinyOtwarcia[j]));
            }
          }
        }
      }
    }

    if (rezMaly.length > 0) {
      for (let i = 0; i < rezMaly.length; i++) {
        for (let j = 0; j < this.godzinyOtwarcia.length; j++) {
          // od godziny
          if (i % 2 == 0) {
            if (this.godzinyOtwarcia[j].time.split(" ", 3)[0] == rezMaly[i]) {
              this.godzinyOtwarcia[j].maly = "Termin zarezerwowany"
              this.data.rezMalyFinal.push(this.godzinyOtwarcia.indexOf(this.godzinyOtwarcia[j]));
            }
          }
          // do godziny
          else {
            if (this.godzinyOtwarcia[j].time.split(" ", 3)[2] == rezMaly[i]) {
              this.godzinyOtwarcia[j].maly = "Termin zarezerwowany"
              this.data.rezMalyFinal.push(this.godzinyOtwarcia.indexOf(this.godzinyOtwarcia[j]));
            }
          }
        }
      }
    }
  }

  /* tworzymy array ktory kasuje tworzace sie blednie <td> podczas laczenia 
  poprzez wypelnienie tablic wartosciami true false*/
  deleteTd(arrayAttr, check) {

    //dla duzego
    if (check == "Duzy") {
      for (let i = 0; i < arrayAttr.length; i++) {
        if (arrayAttr[i] == 2) {
          this.data.arrayTest[i + 1] = true;
          i++
        } else if (arrayAttr[i] == 3) {
            this.data.arrayTest[i + 1] = true;
            this.data.arrayTest[i + 2] = true;
            i += 2
        } else if (arrayAttr[i] == 4) {
            this.data.arrayTest[i + 1] = true;
            this.data.arrayTest[i + 2] = true;
            this.data.arrayTest[i + 3] = true;
            i += 3;
        } else if (arrayAttr[i] == 5) {
            this.data.arrayTest[i + 1] = true;
            this.data.arrayTest[i + 2] = true;
            this.data.arrayTest[i + 3] = true;
            this.data.arrayTest[i + 4] = true;
            i += 4;
        } else if (arrayAttr[i] == 6) {
            this.data.arrayTest[i + 1] = true;
            this.data.arrayTest[i + 2] = true;
            this.data.arrayTest[i + 3] = true;
            this.data.arrayTest[i + 4] = true;
            this.data.arrayTest[i + 5] = true;
            i += 5;
        }
      }
    } else {
      //dla malego
      for (let i = 0; i < arrayAttr.length; i++) {
        if (arrayAttr[i] == 2) {
          this.data.arrayTest2[i + 1] = true;
          i++
        } else if (arrayAttr[i] == 3) {
            this.data.arrayTest2[i + 1] = true;
            this.data.arrayTest2[i + 2] = true;
            i += 2;
        } else if (arrayAttr[i] == 4) {
            this.data.arrayTest2[i + 1] = true;
            this.data.arrayTest2[i + 2] = true;
            this.data.arrayTest2[i + 3] = true;
            i += 3;
        } else if (arrayAttr[i] == 5) {
            this.data.arrayTest2[i + 1] = true;
            this.data.arrayTest2[i + 2] = true;
            this.data.arrayTest2[i + 3] = true;
            this.data.arrayTest2[i + 4] = true;
            i += 4;
        } else if (arrayAttr[i] == 6) {
            this.data.arrayTest2[i + 1] = true;
            this.data.arrayTest2[i + 2] = true;
            this.data.arrayTest2[i + 3] = true;
            this.data.arrayTest2[i + 4] = true;
            this.data.arrayTest2[i + 5] = true;
            i += 5;
        }
      }
    }
  }
}
