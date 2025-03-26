import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Book } from '../../../core/models/book.model';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent {
  @Input() book!: Book;
  @Output() edit = new EventEmitter<Book>();
  @Output() delete = new EventEmitter<Book>();
  @Output() click = new EventEmitter<Book>();

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.book);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.book);
  }

  onClick(): void {
    this.click.emit(this.book);
  }
}