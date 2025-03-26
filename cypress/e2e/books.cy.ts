describe('Books Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4200/books');
    });
    it('should display the books page', () => {
        cy.get('.book-card').should('have.length.greaterThan', 0);
      });
    it('should filter books when using the search', () => {
    // Store initial book count
    let initialCount = 3;
    cy.get('.book-card').then($cards => {
        initialCount = $cards.length;
    });
     // Search for a specific query
     cy.get('input[placeholder*="Search"]').type('Gatsby');
    
     // Check that we have fewer books and they contain the search term
     cy.get('.book-card').should($cards => {
       expect($cards.length).to.be.lessThan(initialCount);
     });
     
     cy.get('.book-card').should('contain', 'Gatsby');
     
     // Clear search
     cy.get('button[aria-label="Clear"]').click();
     
     // Verify we're back to our initial state
     cy.get('.book-card').should('have.length', initialCount);
   });
   it('should open book details when clicking on a book', () => {
    // Click the first book
    cy.get('button').contains('View Details').click();
    
    // Check that the dialog opened
    cy.get('mat-dialog-container').should('be.visible');
    cy.get('mat-dialog-container h2').should('exist');
    
    // Close the dialog
    cy.get('button mat-icon').contains('close').click();
    cy.get('mat-dialog-container').should('not.exist');
  });
  it('should allow editing a book', () => {
    // Get the first book's title for comparison
    let originalTitle = '';
    cy.get('.book-card .book-title').first().then($title => {
      originalTitle = $title.text();
    });
    
    // Click edit on the first book
    cy.get('.book-card .book-actions button').first().click();
    
    // Check that the edit dialog opened
    cy.get('mat-dialog-container').should('be.visible');
    cy.get('mat-dialog-container h2').should('contain', 'Edit Book');
    
    // Change the title
    cy.get('input[formControlName="title"]').clear().type('Test Title');
    
    // Save changes
    cy.get('button').contains('Save Changes').click();
    
    // Verify the snackbar appears
    cy.get('mat-snack-bar-container').should('contain', 'Book updated successfully');
    
    // Verify the book title changed
    cy.get('.book-card .book-title').first().should('contain', 'Test Title')
    .and($newTitle => {
        expect($newTitle.text()).not.to.equal(originalTitle);
      });
  });
  it('should allow adding a new book', () => {
    // Click add new book button
    cy.get('button').contains('Add Book').click();
    
    // Check that the dialog opened
    cy.get('mat-dialog-container').should('be.visible');
    cy.get('mat-dialog-container h2').should('contain', 'Add New Book');
    
    // Fill in the form
    cy.get('input[formControlName="title"]').type('Test New Book');
    cy.get('input[formControlName="author"]').type('Test author');
    cy.get('textarea[formControlName="description"]').type('This is a book created in an E2E test');
    cy.get('input[formControlName="coverImageUrl"]').type('assets/images/test-image.png');
    cy.get('input[formControlName="price"]').type('10');
    cy.get('mat-checkbox').click();
    
    // Save the new book
    cy.get('button.submit-button').click();
    
    // Verify the snackbar appears
    cy.get('mat-snack-bar-container').should('contain', 'Book added successfully');
    
    // Verify the new book appears in the list
    cy.get('.book-card .book-title').should('contain', 'Test New Book');
  });
  it('should allow deleting a book', () => {
    // Store initial book count
    let initialCount = 3;
    cy.get('.book-card').then($cards => {
      initialCount = $cards.length;
    });
    
    // Click delete button on the first book (2nd button in actions)
    cy.get('.book-card .book-actions button').eq(1).click();
    
    // Confirm deletion in the browser dialog
    cy.on('window:confirm', () => true);
    
    // Verify the snackbar appears
    cy.get('mat-snack-bar-container').should('contain', 'Book deleted successfully');
    
    // Verify we have one fewer book
    cy.get('.book-card').should('have.length', initialCount - 1);
  });
//   it('should handle real-time events', () => {
//     // Wait for a real-time event to occur (this may need adjustment based on your event timing)
//     cy.wait(15000); // Wait for event generator interval (15s + buffer)
    
//     // Check that an event notification appears
//     cy.get('simple-snack-bar').should('exist');
    
//     // Click on the event notification
//     cy.get('simple-snack-bar span').contains('View').click();
    
//     // Verify we can see the updated data
//     cy.get('.book-card').should('exist');
//   });
  it('should handle real-time events', () => {
    // Store initial data for comparison
    const initialBookData: {title?: string; author?: string; count?: number} = {};
    cy.get('.book-card').first().find('.book-title').invoke('text').then(text => {
      initialBookData.title = text;
    });
    cy.get('.book-card').first().find('.book-author').invoke('text').then(text => {
      initialBookData.author = text;
    });
    cy.get('.book-card').then($cards => {
      initialBookData.count = $cards.length;
    });
    
    // Wait for a real-time event to occur
    cy.wait(15000); // Wait for event generator interval (15s + buffer)
    
    // Check that a snackBar notification appears
    cy.get('mat-snack-bar-container').should('exist').should('be.visible');
    
    // Verify that the snackBar contains one of the expected event messages
    cy.get('mat-snack-bar-container').then($snackBar => {
      const text = $snackBar.text();
      const hasValidEventMessage = 
        text.includes('has been added') || 
        text.includes('has been updated') || 
        text.includes('has been removed');
      
      expect(hasValidEventMessage).to.be.true;
    });
    
    // Based on the snackBar message, verify correct data changes
    cy.get('mat-snack-bar-container').invoke('text').then(text => {
      if (text.includes('has been added')) {
        // For create events, verify a new book was added
        cy.get('.book-card').should('have.length.greaterThan', initialBookData.count);
      } 
      else if (text.includes('has been updated')) {
        // For update events, we can't check specific fields as easily with the snackBar approach,
        // but we can at least verify books still exist
        cy.get('.book-card').should('have.length', initialBookData.count);
      } 
      else if (text.includes('has been removed')) {
        // For delete events, verify a book was removed
        cy.get('.book-card').should('have.length.lessThan', initialBookData.count);
      }
    });
    
    // Test user interaction with the snackBar by clicking 'View' action button
    cy.get('mat-snack-bar-container button').contains('View').click();
    
    // This should trigger the viewBookDetails method on non-delete events
    // We can verify a dialog appears (for create or update events)
    // or that nothing happens (for delete events)
    cy.get('mat-snack-bar-container').invoke('text').then(text => {
      if (!text.includes('has been removed')) {
        // For non-delete events, dialog should appear
        cy.get('mat-dialog-container').should('be.visible');
        
        // Close the dialog after verification
        cy.get('button mat-icon').contains('close').click();
      }
    });
})
})