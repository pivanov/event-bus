import { useEffect, useCallback } from 'react';
const subscribers = new Set();
/**
 * Subscribes to events that match the given filter.
 * @param filter - The filter to match events.
 * @param callback - The callback to execute when an event matches the filter.
 * @returns Function to unsubscribe from the events.
 */
export const busSubscribe = (filter, callback) => {
    const newSubscriber = [filter, callback];
    subscribers.add(newSubscriber);
    return () => {
        subscribers.delete(newSubscriber);
    };
};
/**
 * Dispatches an event to all subscribers that match the event type.
 * @param topic - The event topic to dispatch.
 * @param message - Message associated with the event.
 */
export const busDispatch = (topic, message) => {
    const eventAction = { topic, data: message };
    subscribers.forEach(([filter, callback]) => {
        try {
            if ((typeof filter === 'string' && filter === eventAction.topic) ||
                (typeof filter === 'function' && filter(eventAction))) {
                callback(eventAction);
            }
        }
        catch (error) {
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
export const useEventBus = (topic, callback, deps = []) => {
    const memoizedCallback = useCallback((event) => {
        callback(event.data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, ...deps]);
    useEffect(() => {
        const unsubscribe = busSubscribe(topic, memoizedCallback);
        return unsubscribe;
    }, [topic, memoizedCallback]);
};
