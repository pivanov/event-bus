import { useEffect } from 'react';
const subscribers = new Set();
export const busSubscribe = (filter, callback) => {
    if (!filter || !callback) {
        return;
    }
    const newSubscriber = [filter, callback];
    // Exit early if subscriber already exists
    if (Array.from(subscribers).some((subscriber) => subscriber[0] === filter && subscriber[1] === callback)) {
        return;
    }
    subscribers.add(newSubscriber);
    // Unsubscribe function
    return () => {
        subscribers.delete(newSubscriber);
    };
};
export const busDispatch = (event) => {
    let type = '';
    let args;
    if (typeof event === 'string') {
        type = event;
        args = { type };
    }
    else {
        type = event.type;
        args = event;
    }
    // Notify relevant subscribers
    subscribers.forEach(([filter, callback]) => {
        if (typeof filter === 'string' && filter !== type
            || Array.isArray(filter) && !filter.includes(type)
            || filter instanceof RegExp && !filter.test(type)
            || typeof filter === 'function' && !filter(args)) {
            return;
        }
        callback(args);
    });
};
export const useEventBus = (type, callback, deps = []) => {
    useEffect(() => {
        const unsubscribe = busSubscribe(type, callback);
        return unsubscribe;
    }, [type, callback, deps]);
    return busDispatch;
};
