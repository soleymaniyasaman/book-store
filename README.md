# Book Store

A dynamic Angular application that demonstrates state management, real-time event handling, and responsive design.

## Features

- **Real-time Updates**: Changes to the book catalog are automatically propagated throughout the application every 15 seconds
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Theme Support**: Toggle between light and dark modes
- **State Management**: Uses RxJS for reactive state management
- **Event Sourcing**: Tracks individual property changes (edit, add, delete) as distinct events

## Technology Stack

- **Angular 18**: Version 18 was used due to time constraints and limited familiarity with version 19, given the impending launch of my current project
- **TypeScript**: For type-safe code
- **RxJS**: For reactive state management
- **Angular Material**: UI component library
- **SCSS**: For advanced styling with theme support
- **Cypress**: For end-to-end testing

## Project Structure

The project follows a feature-based structure:

```
books-app/
├── src/
│   ├── app/
│   │   ├── core/                 # Core functionality (services, models, etc.)
│   │   ├── shared/               # Shared components (header, footer, book card)
│   │   ├── features/             # Feature modules (home, books, about)
│   │   └── ...                   # App root components
│   ├── assets/                   # Static assets
│   ├── styles/                   # Global styles
│   └── ...
└── cypress/                      # E2E tests
```


## Getting Started

### Prerequisites

- Node.js (v20+)
- npm (v10+)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/soleymaniyasaman/book-store.git
   cd book-store
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

## Running Tests

### End-to-End Tests

```
npm run cypress
```

This will open the Cypress Test Runner, allowing you to run and debug the E2E tests interactively.


## Build

To build the application for production:

```
npm run build
```

The build artifacts will be stored in the `dist/` directory.


## Application Features

### Home Page

- Featured books section
- Quick access to books page

### Books Page

- Grid display of all books
- Search functionality
- Add, edit, and delete books
- Real-time event notifications
- Detail view via popup dialog

### About Page

- Information about the application
- Light/dark mode toggle

## Real-Time Event System

The application simulates a real-time environment by periodically dispatching mock events:

- **Create Events**: Adding new books to the catalog
- **Update Events**: Modifying existing book properties
- **Delete Events**: Removing books from the catalog

These events are visually indicated to the user and automatically update the UI.
