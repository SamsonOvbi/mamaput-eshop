import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AllConstants } from 'src/app/shared/constants';
import { AuthService } from 'src/app/shared/services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  animations: [
    trigger('state', [
      state('done', style({
        opacity: 1
      })),
      transition('void => *', [
        style({opacity: 0}),
        animate('1s')
      ]),
    ])
  ]
}) 
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  responseMessage: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageDialogService: MessageDialogService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: [null, [Validators.required, Validators.email],],
    });
  }

  handleSubmit() {
    let formData = this.forgotPasswordForm.value;

    this.authService.forgotPassword(formData).subscribe({
      next: (resp: any) => {
        this.responseMessage = resp?.message || AllConstants.emailSent;
        this.dialogRef.close();
        this.messageDialogService.openMessageDlg({message: this.responseMessage, type: 'success'});
      },
      error: (error: any) => {
        if (error.error?.message){
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = AllConstants.genericError;
        }
        this.messageDialogService.openMessageDlg({message: this.responseMessage, type: 'error'});
      },
    });
  }

}
