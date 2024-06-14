import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { User } from 'src/app/features/auth/models/user';
import { UserService } from 'src/app/features/auth/user.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';

@Component({
  selector: 'app-admin-users-history',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
})
export class AdminUsersComponent implements OnInit {
  loading = true;
  error = false;
  users: User[] = [];
  userService: UserService;
  displayedColumns: string[] = ['_id', 'name', 'email', 'isAdmin', 'action'];

  constructor(
    private titleService: Title,
    private sharedService: SharedService,
    private router: Router,
    private messageDialogService: MessageDialogService,
    private route: ActivatedRoute,
    userService: UserService,
    private cd: ChangeDetectorRef,
  ) {
    this.userService = userService;
  }

  ngOnInit() {
    this.getUsers();
  }

  private getUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data: any) => {
        this.users = data;
        this.titleService.setTitle(`Admin User - ${this.sharedService.appTitle}`);
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.error = true;
        this.messageDialogService.openMessageDlg({message: err, type: 'error'});
      },
      
    });
  }

  deleteUser(id: string): void {    
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          const message = `User deleted successfully`;
          this.users = this.users.filter((user) => user._id !== id);
          this.messageDialogService.openMessageDlg({message: message, type: 'success'});
        },
        error: ((err) => {
          console.log(err);
          this.messageDialogService.openMessageDlg({message: err, type: 'error'});
        })
      });
    }
  }

}
