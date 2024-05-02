import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Location } from '@angular/common';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  previousRoute: string = '';
  user: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageDialogService: MessageDialogService,
    private authService: AuthService,
    private location: Location,
  ) {
    this.profileForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.email],
      password: [''],
      repeatPassword: [''],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  ngOnInit(): void {
    this.authService.currentUser.subscribe((x) => {
      if (!x) { return; }
      this.user = x;      
      this.profileForm.patchValue({ username: this.user.username });
      this.profileForm.patchValue({ email: this.user.email });
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if profileForm is invalid
    if (this.profileForm.invalid) {
      return;
    }
    const message = 'Profile updated successfully';
    const { username, email, password } = this.profileForm.controls;
    const reqBody = { username: username.value, email: email.value, password: password.value };
    this.loading = true;
    this.authService.updateProfile(reqBody).subscribe({
      next: (data) => {
        this.messageDialogService.openMessageDlg({message: message, type: 'success'});
        this.loading = false;
        this.location.back();
      },
      error: (err: any) => {
        this.messageDialogService.openMessageDlg({message: err, type: 'error'});
        this.loading = false;
      },
      
    });
  }

  goBack() {
    this.location.back();
  }

}