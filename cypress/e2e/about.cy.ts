describe('About Page with Theme', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4200/about');
    });
    it('should toggle between light and dark theme', () => {
        // Clear localStorage to start in light theme
        cy.clearLocalStorage('theme');
        cy.reload();

        // Start in light theme by default
        cy.get('html').should('have.class', 'light-theme');
        
        // Toggle to dark theme
        cy.get('mat-slide-toggle').click();
        cy.get('html').should('have.class', 'dark-theme');
        cy.get('html').should('not.have.class', 'light-theme');
        
        // Toggle back to light theme
        cy.get('mat-slide-toggle').click();
        cy.get('html').should('have.class', 'light-theme');
        cy.get('html').should('not.have.class', 'dark-theme');
      });

      it('should also toggle theme from header', () => {
        // Clear localStorage to start in light theme
        cy.clearLocalStorage('theme');
        cy.reload();
        
        // Start in light theme by default
        cy.get('html').should('have.class', 'light-theme');
        
        // Use header button to toggle theme - select by icon instead of tooltip
        cy.get('mat-toolbar mat-icon').contains('dark_mode').parent('button').click();
        cy.get('html').should('have.class', 'dark-theme');
        
        // Toggle back
        cy.get('mat-toolbar mat-icon').contains('light_mode').parent('button').click();
        cy.get('html').should('have.class', 'light-theme');
      });
    
    
});