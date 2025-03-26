export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    coverImageUrl: string;
    price: number;
    isAvailable: boolean;
  }
  
  export interface BookEvent {
    type: 'create' | 'update' | 'delete';
    book: Book;
    timestamp: Date;
    property?: string; // For tracking specific property updates
    previousValue?: any; // For tracking the previous value
  }