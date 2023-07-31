// 节流，一定时间内只能运行一次
export function throttle(fn,transport) {
    let timer = null;
    return (...arg) => {
        console.log(timer)
        if (timer) return;
        timer = setTimeout(() => {
            console.log('写入timer')
            clearTimeout(timer)
            timer = null
        }, 1000);
        fn.call(transport, ...arg)
    }
}
export function debouce(fn, fn2, term) {
    let debounceTimer = null
    return (...arg) => {
        fn.call(term, ...arg)
        debounceTimer && clearTimeout(debounceTimer)
        debounceTimer = setTimeout( () => {
            fn2.call(term);
            console.log('执行 deboune')
        }, 1000)
    }
}