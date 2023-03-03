export const Debounce = <T extends (...args: any[]) => any> (callback: T, delay: number) => {
    type TimerHandle = ReturnType<typeof setTimeout>;
    let timer: TimerHandle;

    return (...args: Parameters<T>) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
};