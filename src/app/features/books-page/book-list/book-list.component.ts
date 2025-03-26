import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Book, BookEvent } from '../../../core/models/book.model';
import { BookService } from '../../../core/services/book.service';
import { EventService } from '../../../core/services/event.service';
import { BookEditComponent } from '../book-edit/book-edit.component';
import { BookDetailComponent } from '../book-detail/book-detail.component';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, OnDestroy {
  books$: Observable<Book[]>; 
  searchQuery: string = '';
  private destroy$ = new Subject<void>();
  private searchTrigger$ = new Subject<string>(); // Triggers search with typing pause 


  constructor(
    private bookService: BookService,
    private eventService: EventService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.books$ = this.bookService.getBooks(); // Initialize book list
  }

  ngOnInit(): void {
    this.eventService.startEventGenerator(15000); // Start the event generator every 15 sec
    
    // Listen for events and display notifications
    this.eventService.events$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => this.displayEventNotification(event));
    
      // Set up search with typing pause to avoid excessive requests
      this.searchTrigger$
        .pipe(
          takeUntil(this.destroy$),
          debounceTime(300),
          distinctUntilChanged()
        )
        .subscribe(searchTerm => {
          this.books$ = this.bookService.searchBooks(searchTerm);
          console.log('searching for:', searchTerm);
        });
    }

  // Cleanup subscriptions and eventGenerator when the component is destroyed
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.eventService.stopEventGenerator();
  }
  // Triggers book search when user types
  triggerSearch(): void {
    this.searchTrigger$.next(this.searchQuery);
  }

  // Clears the search field
  resetSearch(): void {
    this.searchQuery = '';
    this.searchTrigger$.next('');
  }


  // Opens the edit dialog, preventing detail view from opening
  editBook(book: Book, event: Event): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(BookEditComponent, {
      width: '500px',
      data: { book }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result:', result);
      if (result) {
        this.snackBar.open('Book updated successfully', 'Close', { duration: 3000 });
      }
    });
  }

  // Deletes a book after user confirmation
  removeBook(book: Book, event: Event): void {
    event.stopPropagation();
    
    const confirmDelete = confirm(`Are you sure you want to delete "${book.title}"?`);
    if (confirmDelete) {
      const wasDeleted = this.bookService.deleteBook(book.id);
      
      if (wasDeleted) {
        this.snackBar.open('Book deleted successfully', 'Close', { duration: 3000 });
      }
    }
  }

  // Opens a dialog to add a new book
  addBook(): void {
    const dialogRef = this.dialog.open(BookEditComponent, {
      width: '500px',
      data: { book: null }
    });
    
    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.snackBar.open('Book added successfully', 'Close', { duration: 3000 });
      }
    });
  }

  // Displays notification based on the latest book event
  private displayEventNotification(event: BookEvent): void {
    let message = '';
    switch (event.type) {
      case 'create':
        message = `New book "${event.book.title}" has been added`;
        break;
        case 'update':
        let availability = event.property === "isAvailable" ? 'availability' : event.property;
        message = event.property 
          ? `Book "${event.book.title}", ${availability} has been updated`
          : `Book "${event.book.title}" has been updated`;
        break;
      case 'delete':
        message = `Book "${event.book.title}" has been removed`;
        break;
    }
    
    this.snackBar.open(message, 'View', { duration: 4000 })
      .onAction().subscribe(() => {
        if (event.type !== 'delete') {
          this.viewBookDetails(event.book);
        }
      });
  }
  // Opens book details in a dialog
  viewBookDetails(book: Book): void {
    this.dialog.open(BookDetailComponent, {
      width: '600px',
      data: { bookId: book.id }
    });
  }

}
