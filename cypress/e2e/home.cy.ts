describe('Home Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4200');
    });
    it('should display the books page', () => {
        cy.get('h1').should('contain', 'Welcome to my Book Store');
        cy.get('.hero-description').should('have.length.greaterThan', 0);
    });
    
});