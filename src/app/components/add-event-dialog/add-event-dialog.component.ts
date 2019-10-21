import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddEventDialogService } from 'src/app/services/add-event-dialog/add-event-dialog.service';

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrls: ['./add-event-dialog.component.css']
})
export class AddEventDialogComponent implements OnInit {

  isSpinner: boolean = true;

  constructor(public dialogRef: MatDialogRef<AddEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private AddEventDialogService: AddEventDialogService) { }

  ngOnInit() {
    this.isSpinner = this.data.spinner;
    this.AddEventDialogService.result$.subscribe(result =>
      this.isSpinner = result
    );
  }
}
