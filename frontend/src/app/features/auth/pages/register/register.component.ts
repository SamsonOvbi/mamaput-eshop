import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../helpers/auth.service';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
import { Subscription } from 'rxjs';
import { AllConstants } from 'src/app/shared/constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  authSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageDialogService: MessageDialogService,
    private authService: AuthService,
  ) {
    if (this.authService.currentUserValue) { this.router.navigate(['/']); }

    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit() { }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    const { username, email, password } = this.form.controls;
    const reqBody = { username: username.value, email: email.value, password: password.value };
    this.loading = true;
    this.authSubscription = this.authService.register(reqBody).subscribe({
      next: (data) => {
        this.router.navigate([this.returnUrl]);
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
