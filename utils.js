export function debounce(func, delay) {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            func(...args)
        }, delay)
    }
}

export function encodePayload(text) {
    return btoa(encodeURIComponent(JSON.stringify(text)))
}

export function decodePayload(payload) {
    try {
        const text = JSON.parse(decodeURIComponent(atob(payload)))
        if (typeof text.htmlText === 'string'
            || typeof text.cssText === 'string'
            || typeof text.scriptText === 'string') {
            return text
        }
    } catch (err) {
    }
}