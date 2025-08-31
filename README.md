# TaskM8 Pro — Vue.js Task Management Application

## Introduction & Architectural Overview

TaskM8 Pro is a modern task management application built with Vue 3, TypeScript, and Tailwind CSS. Since the position I'm under consideration for is **Senior Software Engineer — Front-End**, I chose to focus heavily on frontend architecture, state management, user experience, and modern development practices.

After years of primarily working with React, I found building this application with Vue 3's Composition API refreshing and intuitive. The declarative nature of Vue's templates combined with the powerful reactivity system made for an excellent developer experience, especially when managing complex component interactions and state updates.

This implementation demonstrates production-ready frontend architecture patterns suitable for enterprise applications. The focus on user experience, error handling, and maintainable code structure showcases modern Vue.js development practices.

The mock service with configurable failure rates allows for comprehensive testing of error scenarios without requiring a backend infrastructure, making it ideal for frontend-focused development and demonstration purposes.

### Core Architectural Decisions

**Frontend-First Approach**: Given the role requirements, I prioritized creating a robust, scalable frontend architecture with clean separation of concerns, comprehensive error handling, and excellent user experience patterns.

**Vue 3 + Composition API**: Leverages Vue's modern reactive system for clean, reusable component logic and excellent TypeScript integration.

**Pinia State Management**: Implements a centralized store pattern for predictable state updates, optimistic UI updates, and seamless error recovery.

**Component-Driven Development**: Modular, reusable components with clear prop interfaces and event contracts.

**Progressive Enhancement**: Built with accessibility, responsive design, and graceful error handling from the ground up.

## Repository & Demo

- **Repository**: https://github.com/NickyJayJay/challenge-vue2-ui
- **Live Demo**: https://challenge-vue2-ui.onrender.com/

## Installation & Running

```bash
# Clone the repository
git clone https://github.com/NickyJayJay/challenge-vue2-ui.git
cd challenge-vue2-ui/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000` in development mode.

## Technology Stack & Rationale

### Vite Build Tool

**Rationale**: I chose Vite over traditional bundlers like Webpack for several reasons:

- **Fast HMR**: Sub-second hot reloads during development improve developer productivity
- **ES modules native**: Better tree-shaking and smaller bundle sizes
- **Zero-config TypeScript**: Built-in TypeScript support without complex configuration
- **Modern by default**: Optimized for modern development workflows and deployment targets
- **Excellent Vue integration**: First-class support for Vue SFC (Single File Components)

### Mock Data Service with Error Simulation

**Rationale**: The `taskService.ts` implements a realistic API simulation that includes:

- **10% failure rate**: By default, the service has a 10% chance of simulating network failures, allowing you to experience the comprehensive error handling system
- **Realistic delays**: Network latency simulation (200-500ms) for authentic user experience testing
- **Adjustable failure rate**: You can modify the `shouldFail()` function in `src/services/taskService.ts` to adjust the failure probability:

```typescript
// Change this line to adjust failure rate:
const shouldFail = () => Math.random() < 0.1; // 10% failure rate
const shouldFail = () => Math.random() < 0.0; // No failures
const shouldFail = () => Math.random() < 0.8; // 80% failure rate
```

This approach demonstrates production-ready error handling without requiring a backend service.

### Form Validation Architecture

**Rationale**: I implemented a comprehensive validation system that includes:

- **Real-time validation**: Field-level validation for immediate feedback
- **Schema-based validation**: Centralized validation rules in `src/utils/validation.ts`
- **Input sanitization**: Automatic trimming and cleanup of user input
- **Accessibility-first**: Proper ARIA labels, error associations, and screen reader support
- **Progressive disclosure**: Validation errors appear contextually and non-intrusively

The validation system supports complex rules (title length, special characters in assignee IDs, date validation) while maintaining a clean, reusable API.

### Global State Management with Pinia

**Rationale**: I migrated from local component state to Pinia for several architectural benefits:

- **Predictable state updates**: Centralized mutations ensure consistent data flow
- **Optimistic UI updates**: Tasks update immediately in the UI, with rollback on errors
- **Global error handling**: Centralized error management with toast notifications
- **Developer experience**: Excellent TypeScript integration and Vue DevTools support
- **Composition API integration**: Seamless integration with Vue 3's modern patterns

The store architecture separates concerns clearly:

- **Actions**: Handle async operations and side effects
- **Getters**: Computed derived state (filtered tasks, statistics)
- **State**: Single source of truth for application data

### Tailwind CSS Integration

**Rationale**: I moved from scoped component styles to Tailwind CSS for:

- **Utility-first approach**: Rapid development with consistent design tokens
- **Smaller bundle sizes**: Only used utilities are included in the final CSS
- **Responsive design**: Built-in responsive utilities for mobile-first development
- **Maintenance benefits**: No CSS specificity wars or orphaned styles
- **Team consistency**: Standardized spacing, colors, and component patterns

The implementation includes:

- **Responsive grid**: Mobile-first responsive layout system
- **Dark mode ready**: CSS custom properties for theme switching

### Toast Notification System

**Rationale**: I implemented a sophisticated notification system using `vue-toastification`:

- **Rich error handling**: Network errors include retry functionality with automatic retry buttons
- **Success feedback**: Positive reinforcement for completed actions
- **Smart timeout management**: Different timeout durations based on message importance
- **Non-blocking UX**: Notifications don't interrupt the user's workflow
- **Accessibility**: Proper ARIA live regions for screen readers

**Key Features**:

- **Retry mechanism**: Failed network requests can be retried directly from the toast
- **Contextual messaging**: Different messages for different actions (task created, completed, etc.)
- **Toast queuing**: Multiple notifications are handled gracefully
- **Custom components**: Rich content with buttons and interactive elements

## Testing Strategy

**Rationale**: I've implemented partial but targeted testing focusing on the most critical and complex parts of the application:

### Unit Testing

- **Form Validation Logic**: Complete test coverage of the validation.ts utility functions, including edge cases for title length requirements, assignee ID format validation, date validation, and input sanitization
- **Business Logic**: Tests cover all validation rules, error conditions, and data transformation functions that form the core of the application's reliability

### Integration Testing

- **App Component**: Integration tests that verify the complete user workflow from task creation through status updates, ensuring proper component communication and state management
- **Component Interactions**: Tests validate that form submission, task updates, and error handling work correctly across component boundaries

### Running Tests

```bash
# Run all tests
npm run test
```

### Testing Tools Used

- **Vitest**: The test runner
- **Testing Library**: User-centric testing approaches focusing on behavior
