import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from 'src/app/shared/services/auth.service';
import { ForgotPasswordComponent } from '../../dialogs/forgot-password/forgot-password.component';
import { Location } from '@angular/common';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

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
    const reqBody = { email: email.value, password: password.value};
    this.loading = true;
    this.authService.login(reqBody).pipe(first()).subscribe({
      next: (data) => {
        // this.router.navigate([this.returnUrl]);
        this.location.back();
      },
      error: (error: any) => {
        this.messageDialogService.openMessageDlg({message: error, type: 'error'});
        this.loading = false;
      },
      
    });
  }

  forgotPasswordAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(ForgotPasswordComponent, dialogConfig);
  }

}
