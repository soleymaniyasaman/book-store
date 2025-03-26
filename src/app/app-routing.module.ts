import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './features/home-page/home.component';
import { AboutComponent } from './features/about-page/about.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'books',
    loadChildren: () => import('./features/books-page/books.module').then(m => m.BooksModule)
  },  // Lazy load the BooksModule
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled', // Scroll to top of page when navigating
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }