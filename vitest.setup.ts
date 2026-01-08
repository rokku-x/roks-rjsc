import '@testing-library/jest-dom'

// Polyfill dialog showModal/close for JSDOM environment used in tests
if (typeof HTMLElement !== 'undefined') {
    if (!(HTMLElement.prototype as any).showModal) {
        (HTMLElement.prototype as any).showModal = function () {
            // noop for tests
        }
    }
    if (!(HTMLElement.prototype as any).close) {
        (HTMLElement.prototype as any).close = function () {
            // noop for tests
        }
    }
}
