import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { NodeService } from 'src/app/services/node/node.service';
import { MatStepper, ErrorStateMatcher, MatDialog } from '@angular/material';
import { trigger, transition, style, animate } from '@angular/animations';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';
import { AddEventDialogService } from 'src/app/services/add-event-dialog/add-event-dialog.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import { HarmonogramComponent } from '../harmonogram/harmonogram.component';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  animations: [
    trigger('myAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0)', 'opacity': 1 }))
      ]
      ), transition(
        ':leave', [
        style({ transform: 'translateX(0)', 'opacity': 1 }),
        animate('500ms', style({ transform: 'translateX(100%)', 'opacity': 0 }))
      ]
      )
    ])
  ],
})

export class SliderComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  finalizationFormGroup: FormGroup;
  public selDate = { date: 1, month: 1, year: 1 };
  public heatmap = {} as any;
  minMax: any;
  showSpinner: boolean = true;
  rezData: any = [];
  spinnerDialog: boolean = false;

  matcher = new MyErrorStateMatcher();
  //wybieranie dnia
  clikedDay: any;
  clickedMonthSend: any;

  //informacja o wszystkich wybranych rezerwacjach 
  rezerwacjaWszystkie: any = [];

  //godziny otwarcia orlika i ustawienie rezerwacji na odpowiednie indeksy
  tmpCorrectArray: any = [];

  isClick: boolean = false;

  //czy cos zostalo wybrane na boisku duzy, maly
  isSelectDuzy: boolean = true;
  isSelectMaly: boolean = true;

  goscinnosci: gosc[] = [
    { value: 1, viewValue: 'Dla wszystkich' },
    { value: 2, viewValue: 'Dla wszystkich (pierszeństwo gry dla tzw. "OldBoy")' },
    { value: 3, viewValue: 'Dla zaproszonych' },
    { value: 4, viewValue: 'Wyłącznie dla tzw. "OldBoy"' },
    { value: 5, viewValue: 'Dla zawodników klubu "Macovia Maków"' }
  ];

  selected2 = this.goscinnosci[0].viewValue;
  @ViewChild('stepper') stepper: MatStepper;

  constructor(private _formBuilder: FormBuilder, public nodeService: NodeService, public dialog: MatDialog,
    private AddEventDialogService: AddEventDialogService, private functionsService: FunctionsService,
    private harmonogram: HarmonogramComponent) { }

  isClickNext() {
    this.isClick = !this.isClick;
  }

  compareItems(i1, i2) {
    return i1 && i2 && i1.id === i2.id;
  }

  /* Get today's date */
  getToday(): any {
    const dateNow = new Date();
    return {
      date: dateNow.getDate(),
      month: dateNow.getMonth(),
      year: dateNow.getFullYear()
    };
  }

  /** Log changes in date */
  dateChanged(data: any) {
    this.minMax = {
      min: (data.year + "-" + this.addZero(data.month + 1, 2) + "-" + this.addZero(data.date, 2) + "T" + "14:00:00.000Z"),
      max: (data.year + "-" + this.addZero(data.month + 1, 2) + "-" + this.addZero(data.date, 2) + "T" + "22:00:00.000Z")
    }

    this.clikedDay = data.year + "-" + this.addZero(data.month + 1, 2) + "-" + this.addZero(data.date, 2)
  }

  addZero(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  //kiedy przycisk "Nastepny" zostanie klikniety, pobierz dane o rezerwacji z tego dnia
  sendAndTakeData() {
    {
      //Wyslij dzien jaki ma zostac uwzgledniony
      this.clickedMonthSend = this.selDate.month;

      for (let i = 0; i < this.harmonogram.ELEMENT_DATA.length; i++) {
        this.harmonogram.ELEMENT_DATA[i].duzy = "Wolny termin"
        this.harmonogram.ELEMENT_DATA[i].maly = "Wolny termin"
      }

      this.nodeService.sendToAPIData(this.minMax).subscribe(post => {
        this.functionsService.showRezerwation(post, this.harmonogram.ELEMENT_DATA);
        this.showSpinner = false;
      });

      this.showSpinner = true;
    }
  }

  addEvent(name, phone, wstep) {

    let data = {
      name: name,
      phone: phone,
      wstep: wstep,
      day: this.clikedDay,
      hours: this.rezerwacjaWszystkie,
      array: this.tmpCorrectArray
    }

    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '50vh',
      autoFocus: false,
      disableClose: true,
      data: { spinner: true }
    });

    //w trakcie realizacji
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

    this.nodeService.addEvent(data).subscribe(result => {
      this.spinnerDialog = false;
      this.AddEventDialogService.updateResult(this.spinnerDialog);
    });
  }

  //zabezpieczenie przycisku przez usunieciem disable z DOM
  move(index: number) {
    if (this.isSelectDuzy === false || this.isSelectMaly === false) {
      this.stepper.selectedIndex = index;
    }
  }

  ngOnInit() {

    this.finalizationFormGroup = this._formBuilder.group({
      nameFormControl: ['', Validators.required],
      phoneFormControl: ['', Validators.required]
    });

    this.selDate = this.getToday();
    //this.heatmap = this.genDemoHeatmap();

    this.firstFormGroup = this._formBuilder.group({});
    this.secondFormGroup = this._formBuilder.group({});

    //badz przygotowany ze uzytkowik nic nie kliknie
    this.dateChanged(this.selDate);

    this.functionsService.getData().subscribe(data => {
      // console.log('Data: ',data);
      this.rezData = [];
      this.rezData = data;
    })
  }
}

export interface gosc {
  value: number;
  viewValue: string;
}
