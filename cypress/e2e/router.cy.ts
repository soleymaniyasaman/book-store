describe('Navigate between Pages', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4200');
    });
    it('should navigate between pages', () => {
        // Check we're on the home page
        cy.url().should('include', '/');
        cy.get('.hero-section h1').should('contain', 'Welcome to my Book Store');
    
        // Navigate to Books page
        cy.get('a').contains('Books').click();
        cy.url().should('include', '/books');
        cy.get('.add-book-container').should('contain', 'Add Book');
    
        // Navigate to About page
        cy.get('a').contains('About').click();
        cy.url().should('include', '/about');
        cy.get('h1').should('contain', 'About Book Store');
    
        // Navigate back to Home
        cy.get('a').contains('Home').click();
        cy.url().should('include', '/');
      });
});