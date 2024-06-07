import { useEffect } from 'react';

/**
 * Type representing an event action with a type and optional data.
 * @template D - Data associated with the event action.
 * @template T - Type of the event action.
 */
type TEventAction<D extends unknown | undefined = unknown, T extends string = string> = {
  type: T;
} & D;

/**
 * Type representing a filter for event actions.
 * Can be a string, array of strings, regular expression, or a function.
 */
type TFilter = string | string[] | RegExp | ((event: TEventAction) => boolean);

const subscribers: Set<[TFilter, (event: TEventAction) => void]> = new Set();

/**
 * Subscribes to events that match the given filter.
 * @template T - Data associated with the event action.
 * @param {TFilter} filter - The filter to match events.
 * @param {(event: TEventAction<T>) => void} callback - The callback to execute when an event matches the filter.
 * @returns {(() => void) | undefined} - Function to unsubscribe from the events or undefined if no filter or callback is provided.
 */
export const busSubscribe = <T extends unknown | undefined>(
  filter: TFilter,
  callback: (event: TEventAction<T>) => void,
): (() => void) | undefined => {
  if (!filter || !callback) {
    return;
  }

  const newSubscriber = [filter, callback] as [TFilter, (event: TEventAction) => void];

  if (Array.from(subscribers).some((subscriber) => subscriber[0] === filter && subscriber[1] === callback)) {
    return;
  }

  subscribers.add(newSubscriber);

  return () => {
    subscribers.delete(newSubscriber);
  };
};

/**
 * Dispatches an event to all subscribers that match the event type.
 * @template D - Data associated with the event action.
 * @param {string | TEventAction<D>} event - The event to dispatch.
 */
export const busDispatch = <D extends unknown | undefined>(event: string | TEventAction<D>): void => {
  let type = '';
  let args: TEventAction<D>;
  if (typeof event === 'string') {
    type = event;
    args = { type } as TEventAction<undefined>;
  } else {
    type = event.type;
    args = event;
  }

  // Notify relevant subscribers
  subscribers.forEach(([filter, callback]): void => {
    if (
      typeof filter === 'string' && filter !== type
      || Array.isArray(filter) && !filter.includes(type)
      || filter instanceof RegExp && !filter.test(type)
      || typeof filter === 'function' && !filter(args)
    ) {
      return;
    }

    callback(args);
  });
};

/**
 * React hook to subscribe to events and dispatch events.
 * @template D - Data associated with the event action.
 * @param {TFilter} type - The filter to match events.
 * @param {(event: TEventAction<D>) => void} callback - The callback to execute when an event matches the filter.
 * @param {unknown[]} [deps=[]] - The dependencies for the useEffect hook.
 * @returns {<D>(event: string | TEventAction<D>) => void} - Function to dispatch events.
 *
 * @example
 * // Usage in a React component
 * useEventBus<{ data: string }>('event-type', (event) => {
 *   console.log(event.data);
 * });
 */
export const useEventBus = <D extends unknown | undefined>(
  type: TFilter,
  callback: (event: TEventAction<D>) => void,
  deps: unknown[] = [],
): <D extends unknown>(event: string | TEventAction<D>) => void => {
  useEffect(() => {
    const unsubscribe = busSubscribe<TEventAction<D>>(type, callback);
    return unsubscribe;
  }, [type, callback, deps]);

  return busDispatch;
};
