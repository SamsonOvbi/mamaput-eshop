import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserInfo } from 'src/app/models';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ForgotPasswordComponent } from 'src/app/features/auth/dialogs/forgot-password/forgot-password.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() sidenav!: MatSidenav;
  categories: [] = [];
  searchForm: FormGroup;
  appName = '';
  itemsCount: number = 0;
  currentUser: UserInfo | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private titleService: Title,
    private sharedService: SharedService,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService
  ) {
    this.searchForm = this.formBuilder.group({
      name: [''],
    });
  }
  ngOnInit() {
    this.appName = this.sharedService.titleBlog;
    this.titleService.setTitle(`Core Header - ${this.sharedService.titleBlog}`);
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    this.cartService.currentCart.subscribe((x) => (this.itemsCount = x.itemsCount));
    this.productService.getCategories().subscribe((categories) => (this.categories = categories));
    localStorage.setItem('allCategories', JSON.stringify(this.categories));
  }
  onSubmit() {
    this.router.navigate(['/search'], {
      queryParams: { name: this.searchForm.controls.name.value },
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  forgotPasswordAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(ForgotPasswordComponent, dialogConfig);
  }

}
