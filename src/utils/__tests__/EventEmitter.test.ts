import EventEmitter from '../EventEmitter'

type Events = {
    ping: { msg: string }
}

describe('EventEmitter', () => {
    it('calls listeners on emit and supports once', () => {
        const e = new EventEmitter<Events>()
        const cb = vi.fn()
        e.on('ping', (d) => cb(d.msg))
        e.emit('ping', { msg: 'hello' })
        expect(cb).toHaveBeenCalledWith('hello')

        const onceCb = vi.fn()
        e.once('ping', (d) => onceCb(d.msg))
        e.emit('ping', { msg: 'again' })
        e.emit('ping', { msg: 'again2' })
        expect(onceCb).toHaveBeenCalledTimes(1)
    })

    it('removeAllListeners prevents further calls', () => {
        const e = new EventEmitter<Events>()
        const cb = vi.fn()
        e.on('ping', (d) => cb(d.msg))
        e.emit('ping', { msg: '1' })
        e.removeAllListeners()
        e.emit('ping', { msg: '2' })
        expect(cb).toHaveBeenCalledTimes(1)
    })
})
