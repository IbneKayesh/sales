# Implementation Best Practices & Maintenance Guide

## Quick Start After Improvements

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm start
```
This will start both the backend server and frontend dev server concurrently.

### 3. Build for Production
```bash
npm run build
```

---

## Architectural Overview

```
┌─────────────────────────────────────────────┐
│         App.jsx (with Provider)             │
│  ┌──────────────────────────────────────┐  │
│  │  NotificationProvider                │  │
│  │  ┌────────────────────────────────┐  │  │
│  │  │ AppContent                     │  │  │
│  │  │ ├─ useSchemaData Hook          │  │  │
│  │  │ ├─ Header                      │  │  │
│  │  │ └─ TabContent                  │  │  │
│  │  │    ├─ ErdBoard                 │  │  │
│  │  │    ├─ ModulesPanel             │  │  │
│  │  │    └─ TablesPanel              │  │  │
│  │  └────────────────────────────────┘  │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## Key Design Patterns

### 1. Custom Hooks Pattern
**File**: `src/hooks/useSchemaData.js`

Encapsulates all data fetching logic:
- State management for modules, tables, columns, features
- Loading and error states
- Retry/refresh logic
- No prop drilling needed

**Benefits**:
- Reusable across components
- Centralized API logic
- Easy to test and mock
- Cleaner component code

### 2. Context Provider Pattern
**File**: `src/context/NotificationContext.jsx`

Global state without prop drilling:
- Notifications accessible from any component
- Simple `useNotification()` hook API
- Automatic cleanup with timeouts
- Type-safe notifications (success, error, warning, info)

**Benefits**:
- No prop drilling for notifications
- Consistent user feedback
- Easy to extend with more context

### 3. Component Composition Pattern
**Files**: `LoadingState`, `EmptyState`, `ErrorState`, `TabContent`

Reusable components for common states:
- Consistent UI for loading, error, and empty states
- Reduced code duplication
- Easy to maintain and update

**Benefits**:
- DRY principle (Don't Repeat Yourself)
- Consistent user experience
- Easy to test
- Scalable to new components

---

## Code Organization Standards

### Component Files
```javascript
// ✅ GOOD: Clear structure
import { useState } from 'react';
import { useNotification } from '../context/NotificationContext';

export default function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);
  const { addNotification } = useNotification();
  
  const handleAction = async () => {
    try {
      // logic here
      addNotification('Success!', 'success');
    } catch (err) {
      addNotification(err.message, 'error');
    }
  };

  return (
    <div>
      {/* JSX here */}
    </div>
  );
}
```

### Hook Files
```javascript
// ✅ GOOD: Named exports and clear documentation
import { useState, useCallback } from 'react';

/**
 * Custom hook for managing schema data
 * @returns {Object} Data state and fetch function
 */
export function useSchemaData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    // implementation
  }, []);

  return { data, loading, error, fetchData };
}
```

---

## Error Handling Patterns

### API Error Handling
```javascript
// ✅ GOOD: Comprehensive error handling
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Request failed');
    }
    
    const result = await res.json();
    addNotification('Operation successful!', 'success');
    onSuccess(result);
  } catch (err) {
    console.error('Error:', err);
    addNotification(err.message, 'error');
  }
};
```

### User Confirmation
```javascript
// ✅ GOOD: Confirm destructive actions
const handleDelete = async (id) => {
  if (!window.confirm('Delete this item? This cannot be undone.')) {
    return; // User cancelled
  }
  
  try {
    const res = await fetch(`/api/item/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
    addNotification('Deleted successfully!', 'success');
    onDelete(id);
  } catch (err) {
    addNotification(err.message, 'error');
  }
};
```

---

## State Management Best Practices

### ✅ DO:
- Use custom hooks for shared logic
- Use Context for global state (notifications, theme)
- Keep state as close to component as possible
- Use `useCallback` for event handlers
- Keep effects focused and side-effect free

### ❌ DON'T:
- Prop drill more than 2 levels
- Create too many useState calls (group related state)
- Store derived data in state (calculate on render)
- Use Context for frequently changing data
- Create inline components in render

---

## Performance Optimization Tips

### Code Splitting
Consider lazy loading heavy components:
```javascript
import { lazy, Suspense } from 'react';

const TablesPanel = lazy(() => import('./components/TablesPanel'));

// In render:
<Suspense fallback={<LoadingState />}>
  <TablesPanel {...props} />
</Suspense>
```

### Memoization
For expensive computations:
```javascript
import { useMemo } from 'react';

const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);
```

### List Rendering
Always use unique keys:
```javascript
// ✅ GOOD
{items.map(item => <Item key={item.id} {...item} />)}

// ❌ BAD
{items.map((item, index) => <Item key={index} {...item} />)}
```

---

## Testing Strategies

### Unit Tests (Jest + React Testing Library)
```javascript
import { render, screen } from '@testing-library/react';
import EmptyState from './EmptyState';

test('renders empty state with title', () => {
  render(<EmptyState title="No data" icon="○" />);
  expect(screen.getByText('No data')).toBeInTheDocument();
});
```

### Integration Tests
```javascript
test('module creation workflow', async () => {
  render(<ModulesPanel modules={[]} {...props} />);
  const input = screen.getByPlaceholderText('e.g. HR, CRM');
  
  await user.type(input, 'HR Module');
  await user.click(screen.getByText('+ Add Module'));
  
  expect(mockFetch).toHaveBeenCalledWith('/api/modules', expect.any(Object));
});
```

---

## CSS Organization

### Design Tokens
All colors, spacing, and fonts are defined as CSS variables:
```css
:root {
  --page-bg: #000000;
  --card-bg: #ffffff;
  --text-primary: #0a0a0b;
  --text-secondary: #52525b;
  --accent: #000000;
  --sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

### Naming Convention
Use BEM (Block Element Modifier) pattern:
```css
.card { }           /* Block */
.card-header { }    /* Element */
.card-header.active { } /* Modifier */
```

### Breakpoints
Mobile-first responsive design:
```css
@media (max-width: 860px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}
```

---

## Deployment Checklist

- [ ] Run linter: `npm run lint`
- [ ] Build successfully: `npm run build`
- [ ] Test on latest browsers
- [ ] Test on mobile devices
- [ ] Check console for errors
- [ ] Verify API endpoints
- [ ] Test error states
- [ ] Check notification system
- [ ] Test search/filter functionality
- [ ] Verify database connection
- [ ] Load test with many modules/tables
- [ ] Test offline behavior (if applicable)

---

## Common Issues & Solutions

### Issue: Notifications not showing
**Solution**: Ensure `NotificationProvider` wraps the app in `main.jsx`:
```javascript
ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationProvider>
    <App />
  </NotificationProvider>
);
```

### Issue: Search not filtering results
**Solution**: Check that search state is lowercase and comparison is case-insensitive:
```javascript
const filtered = items.filter(item =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### Issue: Loading state not showing
**Solution**: Ensure `useSchemaData` hook is called and loading state is checked:
```javascript
const { loading } = useSchemaData();
if (loading) return <LoadingState />;
```

---

## Future Enhancement Ideas

### Phase 2 Features
1. **Advanced Search**: Full-text search, filters, sorting
2. **Keyboard Shortcuts**: Cmd+K for search, Cmd+S for save
3. **Export/Import**: CSV, JSON export and import
4. **Collaboration**: Real-time updates, user comments
5. **History**: Undo/Redo functionality

### Phase 3 Features
1. **Dark Mode**: Theme toggle with localStorage
2. **Custom Themes**: User-defined color schemes
3. **Plugins**: Extension system for custom views
4. **Mobile App**: React Native version
5. **API Documentation**: Auto-generated from schema

---

## Resources & References

- **React Docs**: https://react.dev
- **Design System**: See CSS variables in index.css
- **API Schema**: See server/schema.js
- **Database**: PostgreSQL schema in docs/

---

## Support & Maintenance

### Adding a New Feature
1. Create feature branch: `git checkout -b feature/my-feature`
2. Create component in appropriate directory
3. Add to main App.jsx or appropriate parent
4. Add styles to index.css
5. Add error handling with notifications
6. Test thoroughly
7. Create pull request

### Updating Styles
1. Edit relevant section in index.css
2. Test on all screen sizes
3. Verify contrast ratios for accessibility
4. Check animation performance

### Adding API Endpoints
1. Update server/schema.js
2. Add route to server/index.js
3. Update useSchemaData hook
4. Add error handling
5. Test with frontend

---

**Last Updated**: May 21, 2026
**Version**: 2.0 (Production Ready)
