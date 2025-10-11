# Examples

This directory contains example usage of the components in the library.

## ExampleApp.tsx

A comprehensive example showing:
- Form with Input components
- Card component with title and footer
- Button variants (primary, secondary, danger)
- Button sizes (small, medium, large)
- Input validation and error handling

To use these components in your project:

```bash
npm install roks-rjsc
```

Then import and use them:

```tsx
import { Button, Card, Input } from 'roks-rjsc';

function MyComponent() {
  return (
    <Card title="My Card">
      <Input label="Username" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```
