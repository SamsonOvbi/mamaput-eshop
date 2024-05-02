import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackbarService } from 'src/app/shared/services/snackBar/snackbar.service';
import { ForgotPasswordComponent } from './forgot-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class AuthServiceMock {
    forgotPassword(data: any) {
        return of({ message: 'Success' });
    }
}

class MatDialogRefMock {
    close() { }
}

describe('ForgotPasswordComponent', () => { 
    let component: ForgotPasswordComponent;
    let authService: AuthService;
    let snackbarService: SnackbarService;
    let dialogRef: MatDialogRef<ForgotPasswordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, MatDialogModule, MatSnackBarModule,
                BrowserAnimationsModule, // Ensure this is included if your component uses animations
            ],
            declarations: [ForgotPasswordComponent],
            providers: [
                FormBuilder,
                SnackbarService,
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: MatDialogRef, useClass: MatDialogRefMock },
            ],
        }).compileComponents();

        authService = TestBed.inject(AuthService);
        snackbarService = TestBed.inject(SnackbarService);
        dialogRef = TestBed.inject(MatDialogRef);
        component = TestBed.createComponent(ForgotPasswordComponent).componentInstance;
        component.ngOnInit();
    });

    it('test_handleSubmit_handles_forgotPassword_success', () => {
        const snackbarSpy = spyOn(snackbarService, 'openSB').and.callThrough();
        const dialogRefSpy = spyOn(dialogRef, 'close').and.callThrough();
        component.forgotPasswordForm.controls['email'].setValue('test@example.com');
        component.handleSubmit();
        expect(dialogRefSpy).toHaveBeenCalled();
        expect(snackbarSpy).toHaveBeenCalledWith('Success', ''); // Updated to match the actual call
    });

      it('test_handleSubmit_handles_forgotPassword_error', () => {
        spyOn(authService, 'forgotPassword').and.returnValue(throwError(() => new Error('Error')));
        const snackbarSpy = spyOn(snackbarService, 'openSB').and.callThrough();
        component.forgotPasswordForm.controls['email'].setValue('test@example.com');
        component.handleSubmit();
        expect(snackbarSpy).toHaveBeenCalledWith('Something went wrong!! PLease try again!!', 'error');
      });

      it('test_handleSubmit_handles_forgotPassword_success', () => {
        const snackbarSpy = spyOn(snackbarService, 'openSB').and.callThrough();
        const dialogRefSpy = spyOn(dialogRef, 'close').and.callThrough();
        component.forgotPasswordForm.controls['email'].setValue('test@example.com');
        component.handleSubmit();
        expect(dialogRefSpy).toHaveBeenCalled();
        expect(snackbarSpy).toHaveBeenCalledWith('Success', '');
      });


});