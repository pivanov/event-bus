# @pivanov/event-bus

A versatile and lightweight event bus implementation with a React hook for easy integration.

## Installation

Install the package using npm:

```bash
npm install @pivanov/event-bus
```

Or using yarn:

```bash
yarn add @pivanov/event-bus
```

## Usage

### Basic Example

First, import the `useEventBus` and `busDispatch` functions from the package. Define your event interface, then use the `useEventBus` hook to subscribe to events and `busDispatch` to dispatch events.

```tsx
import React from 'react';
import { useEventBus, busDispatch } from '@pivanov/event-bus';

// Define your event interface
interface MyEventBusMessage {
  topic: string;
  message: string;
}

export const ComponentA = () =>  {
  // Dispatch '@@-message' when the button is clicked
  const handleClick = () => {
    busDispatch<MyEventBusMessage>("@@-message", "Hello World!");
  };

  return (
    <button onClick={handleClick}>
      Dispatch Message
    </button>
  );
};

export const ComponentB = () =>  {
  const [message, setMessage] = useState('');

  // Subscribe to topic '@@-message'
  useEventBus<MyEventBusMessage>("@@-message", (message) => {
    console.log('Message received:', message);
    setMessage(message);
  });

  return (
    <>
      Message: {message}
    <>
  );
};
```

## API

### `busSubscribe<T>(filter, callback)`

- **filter**: The event topic to subscribe to, or a function that returns true for events to handle.
- **callback**: The function to call when an event of the specified type is dispatched.
- Returns a function to unsubscribe.

### `busDispatch<T>(topic, message)`

- **topic**: The event topic to dispatch.
- **message**: The message payload for the event.

### `useEventBus<T>(topic, callback, deps?)`

- **topic**: The event topic to subscribe to.
- **callback**: The function to call when an event of the specified topic is dispatched.
- **deps**: Optional array of dependencies for the useEffect hook.

## TypeScript Support

This package is written in TypeScript and provides full type definitions. You can define your own event interfaces to ensure type safety when using the event bus. Your event interface should extend the following structure:

```typescript
interface YourEventInterface {
  topic: string;
  message: unknown;
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Testing

To run the tests for this package, use the following command:
