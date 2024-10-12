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
/**
 * Subscribes to events that match the given filter.
 * @param filter - The filter to match events.
 * @param callback - The callback to execute when an event matches the filter.
 * @returns Function to unsubscribe from the events.
 */
export declare const busSubscribe: <T extends EventBusMessage<string, unknown>>(filter: Filter<T>, callback: (event: EventAction<T>) => void) => (() => void);
/**
 * Dispatches an event to all subscribers that match the event type.
 * @param topic - The event topic to dispatch.
 * @param message - Message associated with the event.
 */
export declare const busDispatch: <T extends EventBusMessage<string, unknown>>(topic: T['topic'], message: T['message']) => void;
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
export declare const useEventBus: <T extends EventBusMessage<string, unknown>>(topic: T['topic'], callback: (message: T['message']) => void, deps?: unknown[]) => void;
export {};
