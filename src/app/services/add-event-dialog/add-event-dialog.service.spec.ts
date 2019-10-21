import { TestBed } from '@angular/core/testing';

import { AddEventDialogService } from './add-event-dialog.service';

describe('AddEventDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddEventDialogService = TestBed.get(AddEventDialogService);
    expect(service).toBeTruthy();
  });
});
