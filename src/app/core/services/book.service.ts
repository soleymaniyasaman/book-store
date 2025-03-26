import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Book } from '../models/book.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private booksSubject = new BehaviorSubject<Book[]>([
    {
      id: uuidv4(),
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
      coverImageUrl: '../assets/images/gatsby.jpg',
      price: 9.99,
      isAvailable: true,
    },
    {
      id: uuidv4(),
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      description: 'The story of a young girl confronting racial injustice in a small Southern town.',
      coverImageUrl: '../assets/images/Mockingbird.jpg',
      price: 9.99,
      isAvailable: true,
    },
    {
      id: uuidv4(),
      title: '1984',
      author: 'George Orwell',
      description: 'A dystopian novel set in a totalitarian society.',
      coverImageUrl: '../assets/images/1984.jpg',
      price: 9.99,
      isAvailable: false,
    }
  ]);

  books$: Observable<Book[]> = this.booksSubject.asObservable();

  constructor() { }

  getBooks(): Observable<Book[]> {
    return this.books$;
  }

  getBookById(id: string): Observable<Book | undefined> {
    return this.books$.pipe(
      map(books => books.find(book => book.id === id))
    );
  }

  addBook(book: Omit<Book, 'id'>): Book {
    const newBook: Book = {
      ...book,
      id: uuidv4(),
    };
    
    const currentBooks = this.booksSubject.getValue();
    this.booksSubject.next([...currentBooks, newBook]);
    
    return newBook;
  }

  updateBook(id: string, updates: Partial<Book>): Book | null {
    const currentBooks = this.booksSubject.getValue();
    const bookIndex = currentBooks.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      return null;
    }
    
    const updatedBook: Book = {
      ...currentBooks[bookIndex],
      ...updates,
    };
    
    const updatedBooks = [...currentBooks];
    updatedBooks[bookIndex] = updatedBook;
    
    this.booksSubject.next(updatedBooks);
    
    return updatedBook;
  }

  deleteBook(id: string): boolean {
    const currentBooks = this.booksSubject.getValue();
    const filteredBooks = currentBooks.filter(book => book.id !== id);
    
    if (filteredBooks.length === currentBooks.length) {
      return false;
    }
    
    this.booksSubject.next(filteredBooks);
    return true;
  }

  searchBooks(term: string): Observable<Book[]> {
    return this.books$.pipe(
      map(books => {
        const searchTerm = term.toLowerCase().trim();
        if (!searchTerm) {
          return books;
        }
        
        return books.filter(book => 
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm) ||
          book.description.toLowerCase().includes(searchTerm)
        );
      })
    );
  }
}