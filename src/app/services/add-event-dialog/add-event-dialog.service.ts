import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddEventDialogService {

  private result: BehaviorSubject<any> = new BehaviorSubject<any>(true);
  public result$: Observable<any> = this.result.asObservable();

  constructor() { }

  updateResult(updated) {
    this.result.next(updated);
  }

}
