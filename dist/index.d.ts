export type TEventAction<D extends unknown | undefined = unknown, T extends string = string> = {
    type: T;
} & D;
export type TFilter = string | string[] | RegExp | ((event: TEventAction) => boolean);
export declare const busSubscribe: <T extends unknown>(filter: TFilter, callback: (event: TEventAction<T>) => void) => (() => void) | undefined;
export declare const busDispatch: <D extends unknown>(event: string | TEventAction<D>) => void;
export declare const useEventBus: <D extends unknown>(type: TFilter, callback: (event: TEventAction<D>) => void, deps?: unknown[]) => <D_1 extends unknown>(event: string | TEventAction<D_1, string>) => void;
