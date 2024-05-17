import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  appTitle!: string;
  appTwitter!: string;
  currentYear!: number;

  constructor(private sharedService: SharedService,) { }

  ngOnInit(): void {
    this.appTitle = this.sharedService.appTitle;
    this.appTwitter = `https://twitter.com/${this.appTitle}`;
    this.currentYear = new Date().getFullYear();
  }

}
