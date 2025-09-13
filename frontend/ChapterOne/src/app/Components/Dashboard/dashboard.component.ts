import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/Services/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  theme: string = 'light';
  username: string = 'Admin';

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.themeService.setTheme(savedTheme);
      this.theme = savedTheme;
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(this.theme);
  }

  closeOthers(event: Event) {
    const details = event.target as HTMLDetailsElement;

    if (details.open) {
      const allDetails = document.querySelectorAll('.sidebarMiddle details');
      allDetails.forEach((d) => {
        if (d !== details) {
          (d as HTMLDetailsElement).open = false;
        }
      });
    }
  }
}
