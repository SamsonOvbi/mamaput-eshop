import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { Title } from '@angular/platform-browser';
import { User } from 'src/app/models/user';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';

@Component({
  selector: 'app-admin-user-edit',
  templateUrl: './admin-user-edit.component.html',
  styleUrls: ['./admin-user-edit.component.css'],
})
export class AdminUserEditComponent implements OnInit {
  form: FormGroup;
  user: User = {
    _id: '',
    username: '',
    isAdmin: false,
  };
  loading = false;
  error = false;

  submitted = false;
  returnUrl: string;

  constructor(
    private titleService: Title,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageDialogService: MessageDialogService,
    private userService: UserService
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      isAdmin: ['', Validators.required],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const userId = routeParams.get('id');
    if (userId) {
      this.userService.getUser(userId).subscribe({
        next: (user: User) => {
          this.user = user;
          this.loading = false;
          this.form.patchValue({ username: user.username });
          this.form.patchValue({ isAdmin: user.isAdmin });
          this.titleService.setTitle(`Admin Edit User ${user._id}`);
        },
        error: (err: any) => {
          this.error = true;
          this.messageDialogService.openMessageDlg({message: err, type: 'error'});
        },
        
      });
    } else {
      this.messageDialogService.openMessageDlg({message: 'User Not Found', type: 'error'});
    }
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    const message = 'User updated successfully';
    const { username, isAdmin } = this.form.controls;
    const user = { _id: this.user._id, username: username.value, isAdmin: isAdmin.value, }
    this.loading = true;
    this.userService.update(user).subscribe({
      next: () => {
        this.messageDialogService.openMessageDlg({message: message, type: 'success'});
        this.loading = false;
        this.router.navigate(['/admin/users']);
      },
      error: (err: any) => {
        this.messageDialogService.openMessageDlg({message: err, type: 'error'});
        this.loading = false;
      },
      
    });
  }
}
