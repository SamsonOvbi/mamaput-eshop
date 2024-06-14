import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '../../helpers/auth.service';
import { ForgotPasswordComponent } from '../../dialogs/forgot-password/forgot-password.component';
import { Location } from '@angular/common';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
import { Subscription } from 'rxjs';
import { AllConstants } from 'src/app/shared/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  authSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private messageDialogService: MessageDialogService,
    private authService: AuthService,
    private location: Location,
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit() { }

  onSubmit() {
    this.submitted = true;
    // stop here if loginForm is invalid
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.controls;
    const reqBody = { email: email.value, password: password.value };
    this.loading = true;
    // console.log({ reqBody });
    this.authSubscription = this.authService.login(reqBody).pipe(first()).subscribe({
      next: (data) => {
        // this.router.navigate([this.returnUrl]);
        this.location.back();
      },
      error: (err: any) => {
        console.error(err);
        const errorMsg = AllConstants.genericError;
        this.messageDialogService.openMessageDlg({ message: errorMsg, type: 'error' });
        this.loading = false;
      },

    });
    this.subscriptions.push(this.authSubscription);
  }

  forgotPasswordAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(ForgotPasswordComponent, dialogConfig);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
