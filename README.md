# roks-rjsc

A collection of reusable React components built with TypeScript. This library provides a set of common UI components that can be easily integrated into any React project.

## Installation

```bash
npm install roks-rjsc
```

or

```bash
yarn add roks-rjsc
```

## Usage

Import the components you need from the library:

```tsx
import { Button, Card, Input } from 'roks-rjsc';

function App() {
  return (
    <div>
      <Card title="Welcome">
        <Input 
          label="Name" 
          placeholder="Enter your name"
          onChange={(value) => console.log(value)}
        />
        <Button variant="primary" size="medium">
          Submit
        </Button>
      </Card>
    </div>
  );
}
```

## Components

### Button

A versatile button component with multiple variants and sizes.

**Props:**
- `variant`: `'primary' | 'secondary' | 'danger'` (default: `'primary'`)
- `size`: `'small' | 'medium' | 'large'` (default: `'medium'`)
- All standard button HTML attributes

**Example:**
```tsx
<Button variant="primary" size="large" onClick={() => alert('Clicked!')}>
  Click Me
</Button>
```

### Card

A card container component with optional title and footer.

**Props:**
- `title`: string (optional)
- `footer`: React.ReactNode (optional)
- `className`: string (optional)
- `style`: React.CSSProperties (optional)

**Example:**
```tsx
<Card 
  title="Card Title"
  footer={<Button>Action</Button>}
>
  Card content goes here
</Card>
```

### Input

A text input component with label, error, and helper text support.

**Props:**
- `label`: string (optional)
- `error`: string (optional)
- `helperText`: string (optional)
- `onChange`: (value: string) => void (optional)
- All standard input HTML attributes

**Example:**
```tsx
<Input 
  label="Email"
  placeholder="Enter your email"
  error="Invalid email"
  onChange={(value) => console.log(value)}
/>
```

## Development

### Build the library

```bash
npm run build
```

This will create the production-ready bundle in the `dist` folder.

### Watch mode

```bash
npm run dev
```

This will watch for changes and rebuild automatically.

## Publishing to npm

1. Make sure you're logged in to npm:
   ```bash
   npm login
   ```

2. Update the version in `package.json`:
   ```bash
   npm version patch|minor|major
   ```

3. Publish to npm:
   ```bash
   npm publish
   ```

The `prepublishOnly` script will automatically build the library before publishing.

## License

MIT
