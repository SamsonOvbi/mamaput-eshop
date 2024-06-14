import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../helpers/auth.service';
import { ForgotPasswordComponent } from './forgot-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';

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
    let messageDialogService: MessageDialogService;
    let dialogRef: MatDialogRef<ForgotPasswordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, MatDialogModule,
                BrowserAnimationsModule, // Ensure this is included if your component uses animations
            ],
            declarations: [ForgotPasswordComponent],
            providers: [
                FormBuilder,
                messageDialogService,
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: MatDialogRef, useClass: MatDialogRefMock },
            ],
        }).compileComponents();

        authService = TestBed.inject(AuthService);
        messageDialogService = TestBed.inject(MessageDialogService);
        dialogRef = TestBed.inject(MatDialogRef);
        component = TestBed.createComponent(ForgotPasswordComponent).componentInstance;
        component.ngOnInit();
    });

    it('test_handleSubmit_handles_forgotPassword_success', () => {
        const messageDialogSpy = spyOn(messageDialogService, 'openMessageDlg').and.callThrough(); 
        const dialogRefSpy = spyOn(dialogRef, 'close').and.callThrough();
        component.forgotPasswordForm.controls['email'].setValue('test@example.com');
        component.handleSubmit();
        expect(dialogRefSpy).toHaveBeenCalled();
        expect(messageDialogSpy).toHaveBeenCalledWith({message: 'Success', type: 'success'});
    });

      it('test_handleSubmit_handles_forgotPassword_error', () => {
        spyOn(authService, 'forgotPassword').and.returnValue(throwError(() => new Error('Error')));
        const messageDialogSpy = spyOn(messageDialogService, 'openMessageDlg').and.callThrough(); 
        component.forgotPasswordForm.controls['email'].setValue('test@example.com');
        component.handleSubmit();
        expect(messageDialogSpy).toHaveBeenCalledWith({message: 'Something went wrong!! PLease try again!!', type: 'error'});
        
      });

      it('test_handleSubmit_handles_forgotPassword_success', () => {
        const messageDialogSpy = spyOn(messageDialogService, 'openMessageDlg').and.callThrough(); 
        const dialogRefSpy = spyOn(dialogRef, 'close').and.callThrough();
        component.forgotPasswordForm.controls['email'].setValue('test@example.com');
        component.handleSubmit();
        expect(dialogRefSpy).toHaveBeenCalled();
        expect(messageDialogSpy).toHaveBeenCalledWith({message: 'Success', type: 'success'});
      });


});