
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from './snackbar.service';
import { BrowserAnimationsModule,  } from '@angular/platform-browser/animations';

describe('SnackbarService', () => {
  let service: SnackbarService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, BrowserAnimationsModule],
      providers: [SnackbarService],
    });
    service = TestBed.inject(SnackbarService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('test_openSB_with_error_action', () => {
    const spy = spyOn(snackBar, 'open');
    service.openSB('Error occurred', 'error');
    expect(spy).toHaveBeenCalledWith('Error occurred', '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2500,
      panelClass: ['error-snackbar'],
    });
  });

  it('test_openSB_with_non_error_action', () => {
    const spy = spyOn(snackBar, 'open');
    service.openSB('Operation successful', 'success');
    expect(spy).toHaveBeenCalledWith('Operation successful', '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2500,
      panelClass: ['success-snackbar'],
    });
  });

  it('test_openSB_with_empty_string_action', () => {
    const spy = spyOn(snackBar, 'open');
    service.openSB('Action was empty', '');
    expect(spy).toHaveBeenCalledWith('Action was empty', '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2500,
      panelClass: ['success-snackbar'],
    });
  });
});