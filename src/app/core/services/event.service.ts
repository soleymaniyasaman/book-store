import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Book, BookEvent } from '../models/book.model';
import { BookService } from './book.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class EventService implements OnDestroy {
  private eventSubject = new Subject<BookEvent>();
  private destroy$ = new Subject<void>();
  private eventGeneratorSubscription: Subscription | null = null;
  
  events$: Observable<BookEvent> = this.eventSubject.asObservable();
  
  // Sample book data for random event generation
  private sampleBooks: Partial<Book>[] = [
    {
      id: uuidv4(),
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      description: 'A story of teenage angst and alienation.',
      coverImageUrl: '../assets/images/catcher.jpg',
      price: 9.99,
      isAvailable: true,
    },
    {
      id: uuidv4(),
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      description: 'A romantic novel of manners.',
      coverImageUrl: '../assets/images/pride.jpg',
      price: 9.99,
      isAvailable: true,
    },
    {
      id: uuidv4(),
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      description: 'A fantasy novel about the adventures of a hobbit.',
      coverImageUrl: '../assets/images/hobbit.jpg',
      price: 9.99,
      isAvailable: true,
    }
  ];
  
  // Properties that can be randomly updated
  private updateableProperties: (keyof Book)[] = [
    'title', 'author', 'description', 'price', 'isAvailable'
  ];

  constructor(private bookService: BookService) {}

  startEventGenerator(intervalMs: number): void {
    // Stop any existing generator
    this.stopEventGenerator();
    
    // Start a new generator
    this.eventGeneratorSubscription = interval(intervalMs)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.generateRandomEvent();
      });
  }

  stopEventGenerator(): void {
    if (this.eventGeneratorSubscription) {
      this.eventGeneratorSubscription.unsubscribe();
      this.eventGeneratorSubscription = null;
    }
  }

  private generateRandomEvent(): void {
    // Get current books
    let books: Book[] = [];
    this.bookService.getBooks().subscribe(currentBooks => {
      books = currentBooks;
    }).unsubscribe();

    // Random event type
    const eventType = this.getRandomEventType();
    let event: BookEvent;

    switch (eventType) {
      case 'create':
        const newBook = this.bookService.addBook(
          this.sampleBooks[Math.floor(Math.random() * this.sampleBooks.length)] as any
        );
        event = {
          type: 'create',
          book: newBook,
          timestamp: new Date()
        };
        break;
        
      case 'update':
        if (books.length === 0) return;
        
        const bookToUpdate = books[Math.floor(Math.random() * books.length)];
        const propertyToUpdate = this.updateableProperties[
          Math.floor(Math.random() * this.updateableProperties.length)
        ];
        const previousValue = bookToUpdate[propertyToUpdate];
        let newValue: any;
        
        // Generate new value based on property type
        switch (propertyToUpdate) {
          case 'title':
          case 'author':
          case 'description':
            newValue = `${bookToUpdate[propertyToUpdate]} (Updated)`;
            break;
          case 'price':
            newValue = bookToUpdate.price + Math.floor(Math.random() * 10) + 1;
            break;
          case 'isAvailable':
            newValue = !bookToUpdate.isAvailable;
            break;
          default:
            newValue = previousValue;
        }
        
        const update = {
          [propertyToUpdate]: newValue
        };
        
        const updatedBook = this.bookService.updateBook(bookToUpdate.id, update);
        if (!updatedBook) return;
        console.log('Updated book:', updatedBook);
        event = {
          type: 'update',
          book: updatedBook,
          timestamp: new Date(),
          property: propertyToUpdate,
          previousValue
        };
        break;
        
      case 'delete':
        if (books.length <= 3) return; // Keep at least 3 books
        
        const bookToDelete = books[Math.floor(Math.random() * books.length)];
        const deleted = this.bookService.deleteBook(bookToDelete.id);
        
        if (!deleted) return;
        
        event = {
          type: 'delete',
          book: bookToDelete,
          timestamp: new Date()
        };
        break;
        
      default:
        return;
    }

    // Emit the event
    this.eventSubject.next(event);
    console.log('Event generated:', event);
  }

  private getRandomEventType(): 'create' | 'update' | 'delete' {
    const rand = Math.random();
    if (rand < 0.2) return 'create';
    if (rand < 0.8) return 'update';
    return 'delete';
  }

  // Method to emit custom events (for testing or manual triggering)
  emitEvent(event: BookEvent): void {
    this.eventSubject.next(event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopEventGenerator();
  }
}