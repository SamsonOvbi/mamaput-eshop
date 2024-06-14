import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AllConstants } from 'src/app/shared/constants';
import { AuthService } from '../../helpers/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
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
  authSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];

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

    this.authSubscription = this.authService.forgotPassword(formData).subscribe({
      next: (resp: any) => {
        this.responseMessage = resp?.message || AllConstants.emailSent;
        this.messageDialogService.openMessageDlg({message: this.responseMessage, type: 'success'});
        this.dialogRef.close();        
      },
      error: (err: any) => {
        console.log({err});
        // this.responseMessage = err?.message || AllConstants.genericError;
        console.error(err);
        const errorMsg = AllConstants.genericError;
        this.messageDialogService.openMessageDlg({ message: errorMsg, type: 'error' });
        // this.messageDialogService.openMessageDlg({message: this.responseMessage, type: 'error'});
      },
    });
    this.subscriptions.push(this.authSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
