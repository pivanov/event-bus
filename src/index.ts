import { useEffect, useCallback } from 'react';

// Add a type for the event bus message
export type EventBusMessage<T extends string = string, M = unknown> = {
  topic: T;
  message: M;
};

/**
 * Base event type representing an action with a topic and associated data.
 */
type EventAction<T extends EventBusMessage> = {
  topic: T['topic'];
  data: T['message'];
};

/**
 * Type-safe event subscriber callback based on the event.
 */
type Filter<T extends EventBusMessage> = T['topic'] | ((event: EventAction<T>) => boolean);

type Subscriber<T extends EventBusMessage> = [Filter<T>, (event: EventAction<T>) => void];

const subscribers = new Set<Subscriber<EventBusMessage>>();

/**
 * Subscribes to events that match the given filter.
 * @param filter - The filter to match events.
 * @param callback - The callback to execute when an event matches the filter.
 * @returns Function to unsubscribe from the events.
 */
export const busSubscribe = <T extends EventBusMessage>(
  filter: Filter<T>,
  callback: (event: EventAction<T>) => void
): (() => void) => {
  const newSubscriber: Subscriber<T> = [filter, callback];
  subscribers.add(newSubscriber as Subscriber<EventBusMessage>);

  return () => {
    subscribers.delete(newSubscriber as Subscriber<EventBusMessage>);
  };
};

/**
 * Dispatches an event to all subscribers that match the event type.
 * @param topic - The event topic to dispatch.
 * @param message - Message associated with the event.
 */
export const busDispatch = <T extends EventBusMessage>(
  topic: T['topic'],
  message: T['message']
): void => {
  const eventAction: EventAction<T> = { topic, data: message };

  subscribers.forEach(([filter, callback]) => {
    try {
      if (
        (typeof filter === 'string' && filter === eventAction.topic) ||
        (typeof filter === 'function' && filter(eventAction as EventAction<EventBusMessage>))
      ) {
        callback(eventAction as EventAction<EventBusMessage>);
      }
    } catch (error) {
      console.error(`Error in event bus subscriber for topic "${topic}":`, error);
    }
  });
};

/**
 * React hook to subscribe to events.
 * @param topic - The event topic to subscribe to.
 * @param callback - The callback to execute when an event matches the topic.
 * @param deps - The dependencies for the useEffect hook.
 *
 * @example
 * // Usage in a React component
 * useEventBus<IEventBusMessage>("@@-message", (message) => {
 *   console.log("Received message:", message);
 * });
 */
export const useEventBus = <T extends EventBusMessage>(
  topic: T['topic'],
  callback: (message: T['message']) => void,
  deps: unknown[] = []
): void => {
  const memoizedCallback = useCallback((event: EventAction<T>) => {
    callback(event.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...deps]);

  useEffect(() => {
    const unsubscribe = busSubscribe<T>(topic, memoizedCallback);
    return unsubscribe;
  }, [topic, memoizedCallback]);
};
