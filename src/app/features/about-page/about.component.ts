import { Component } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  isDarkMode$: Observable<boolean>;
  
  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.theme$.pipe(
      map(theme => theme === 'dark')
    );
    console.log("isDarkMode",this.themeService.getCurrentTheme());
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

// Import map operator
import { map } from 'rxjs/operators';