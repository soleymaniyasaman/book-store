import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ThemeService } from '../../../core/services/theme.service';
// import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isDarkMode$: Observable<boolean>;
  // eventGeneratorActive = true;

  constructor(
    private themeService: ThemeService,
    // private eventService: EventService
  ) {
    this.isDarkMode$ = this.themeService.theme$.pipe(
      map(theme => theme === 'dark')
    );
  }

  ngOnInit(): void {
    // Start the event generator
    // this.eventService.startEventGenerator();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // toggleEventGenerator(): void {
  //   if (this.eventGeneratorActive) {
  //     this.eventService.stopEventGenerator();
  //     this.eventGeneratorActive = false;
  //   } else {
  //     this.eventService.startEventGenerator();
  //     this.eventGeneratorActive = true;
  //   }
  // }
}