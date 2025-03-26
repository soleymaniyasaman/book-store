import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Book } from '../../../core/models/book.model';
import { BookService } from '../../../core/services/book.service';
import { BookEditComponent } from '../book-edit/book-edit.component';
import { MatSnackBar } from '@angular/material/snack-bar';

interface DialogData {
  bookId: string;
}

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  book: Book | undefined;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private bookService: BookService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<BookDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.loadBook();
  }

  private loadBook(): void {
    this.bookService.getBookById(this.data.bookId).subscribe({
      next: book => this.book = book
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  editBook(): void {    
    const editDialogRef = this.dialog.open(BookEditComponent, {
      width: '500px',
      data: { book: this.book }
    });
    editDialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh book data
        this.loadBook();
        
        this.snackBar.open('Book updated successfully', 'Close', {
          duration: 3000
        });
      }
    });
  }

  deleteBook(): void {
    if (!this.book) return;
    if (confirm(`Are you sure you want to delete "${this.book.title}"?`)) {
      const deleted = this.bookService.deleteBook(this.book.id);
      
      if (deleted) {
        this.snackBar.open('Book deleted successfully', 'Close', {
          duration: 3000
        });
        this.dialogRef.close(true);
      } else {
        this.snackBar.open('Failed to delete book', 'Close', {
          duration: 3000
        });
      }
    }
  }

}