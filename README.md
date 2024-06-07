
# event-bus

A versatile and lightweight event bus implementation with a React hook for easy integration. This package provides a simple way to manage events in your JavaScript or TypeScript applications, and it seamlessly integrates with React for managing component-level events.

## Installation

Install the package using npm:

```bash
npm install @pivanov/event-bus
```

## Usage

### Basic Example

First, import the `useEventBus` and `busDispatch` functions from the package. Use the `useEventBus` hook to subscribe to events and `busDispatch` to dispatch events.

```tsx
import React from 'react';
import { useEventBus, busDispatch } from '@pivanov/event-bus';

interface MyEvent {
  data: string;
}

function App() {
  // Subscribe to 'my-event'
  useEventBus<MyEvent>('my-event', (event) => {
    console.log('Event received:', event.data);
  });

  // Dispatch 'my-event' when the button is clicked
  return (
    <button onClick={() => busDispatch<MyEvent>({ type: 'my-event', data: 'Hello World!' })}>
      Dispatch Event
    </button>
  );
}

export default App;
```

### Advanced Usage

You can use more complex filters, such as regular expressions or functions, to control which events trigger your callback.

```tsx
import React from 'react';
import { useEventBus, busDispatch } from '@pivanov/event-bus';

interface MyEvent {
  data: string;
}

function App() {
  // Subscribe to events that match a pattern
  useEventBus<MyEvent>(/my-event-*/, (event) => {
    console.log('Pattern matched event:', event.data);
  });

  // Dispatch different events
  return (
    <div>
      <button onClick={() => busDispatch<MyEvent>({ type: 'my-event-1', data: 'Event 1' })}>
        Dispatch Event 1
      </button>
      <button onClick={() => busDispatch<MyEvent>({ type: 'my-event-2', data: 'Event 2' })}>
        Dispatch Event 2
      </button>
    </div>
  );
}

export default App;
```

## API

### `useEventBus(type, callback, deps)`

- **type**: The event type to subscribe to. Can be a string, array of strings, regular expression, or function.
- **callback**: The function to call when an event of the specified type is dispatched.
- **deps**: Optional array of dependencies for the `useEffect` hook.

### `busDispatch(event)`

- **event**: The event to dispatch. Can be a string or an object with a `type` property.

## License

MIT
