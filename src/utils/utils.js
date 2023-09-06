// 节流，一定时间内只能运行一次
export function throttle(fn,transport) {
    let timer = null;
    return (...arg) => {
        console.log(timer)
        if (timer) return;
        timer = setTimeout(() => {
            clearTimeout(timer)
            timer = null
        }, 1000);
        fn.call(transport, ...arg)
    }
}
// 防抖
export function debouce(fn, term) {
    let debounceTimer = null
    return (...arg) => {
        fn.call(term.term, ...arg)
        debounceTimer && clearTimeout(debounceTimer)
        debounceTimer = setTimeout( () => {
            term.prompt()
        }, 1000)
    }
}