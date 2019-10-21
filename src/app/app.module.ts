import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AllMaterialModule } from '../material-module';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SliderComponent } from './components/slider/slider.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { CalendarDaysComponent } from './components/calendar-days/calendar-days.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { HarmonogramComponent } from './components/harmonogram/harmonogram.component';
import { AddEventDialogComponent } from './components/add-event-dialog/add-event-dialog.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    SliderComponent,
    CalendarDaysComponent,
    HomeComponent,
    HarmonogramComponent,
    AddEventDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule, 
    AppRoutingModule, 
    BrowserAnimationsModule, 
    AllMaterialModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: ''
    })
  ],
  exports: [
    CalendarComponent
  ],
  entryComponents: [SliderComponent,AddEventDialogComponent],
  providers: [HarmonogramComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class CalendarModule {

  /* Gets today's date */
  //public static getToday(): any {
  //  return CalendarComponent.getToday();
  //}

  /** Pad number with zeros */
  //public static zeroPad(num, padlen, padchar = '0'): string {
  //    return CalendarComponent.zeropad(num, padlen, padchar);
  //}
} 