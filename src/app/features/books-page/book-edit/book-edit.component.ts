import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Book } from '../../../core/models/book.model';
import { BookService } from '../../../core/services/book.service';

interface DialogData {
  book: Book | null; // null is for creating a new book
}

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.scss']
})
export class BookEditComponent implements OnInit {
  bookForm!: FormGroup;
  isNew: boolean = false;
  formTitle: string = '';

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    public dialogRef: MatDialogRef<BookEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isNew = !data.book;
    this.formTitle = this.isNew ? 'Add New Book' : 'Edit Book';
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.bookForm = this.fb.group({
      title: [this.data.book?.title || '', [Validators.required, Validators.maxLength(100)]],
      author: [this.data.book?.author || '', [Validators.required, Validators.maxLength(100)]],
      description: [this.data.book?.description || '', [Validators.required, Validators.maxLength(500)]],
      price: [this.data.book?.price || null, [Validators.required, Validators.min(0)]],
      coverImageUrl: [
        this.data.book?.coverImageUrl || null,
        Validators.required
      ],
      isAvailable: [this.data.book?.isAvailable ?? true],
    });
    console.log("bookform",this.bookForm.get('coverImageUrl')?.value);

  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      return;
    }
    
    const bookData = this.bookForm.value;
    
    if (this.isNew) {
      // create new book
      const newBook = this.bookService.addBook(bookData);
      this.dialogRef.close(newBook);
    } else {
      // Update existing book
      const updatedBook = this.bookService.updateBook(this.data.book!.id, bookData);
      this.dialogRef.close(updatedBook);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }


  removeCoverImage(): void {
    this.bookForm.get('coverImageUrl')?.setValue('');
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // create a local object URL and Upload the file and get back a URL
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        this.bookForm.get('coverImageUrl')?.setValue(imageUrl);
      };
      reader.readAsDataURL(file);
      
      // reset the file input for future uploads
      (event.target as HTMLInputElement).value = '';
    }
  }
  previewImage(): void {
    const imageUrl = this.bookForm.get('coverImageUrl')?.value;
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  }
}