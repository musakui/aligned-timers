class AlignedTimers {
  constructor() {
    const target = new Date(8640000000000000)
    this._events = {
      end: (s) => {},
      change: (s) => {},
      next: (i, t) => ({target}),
      tick: (r, t, s) => console.log(r)
    }
    this._timer = null
    this.stop()
  }

  stop() {
    clearInterval(this._timer)
    this._timer = null
    this._state = {
      state: null,
      target: new Date(undefined)
    }
    return this
  }

  on(e, f) {
    if ( f === undefined ) {
      return this._events[e]
    }
    this._events[e] = f
    return this
  }

  start() {
    const gen = this._generator()
    const next = () => Object.assign(this._state, gen.next().value)

    while ( this.remaining < 1 ) { next() }
    this._events.change(this.state)

    this._timer = setInterval(() => {
      const r = this.remaining
      this._events.tick(r, this.target, this.state)
      if ( r < 1 ) {
        this._events.end(this.state)
        next()
        this._events.change(this.state)
      }
    }, 1000)

    return this
  }

  get state() {
    return this._state.state
  }

  get target() {
    return new Date(this._state.target.getTime())
  }

  get remaining() {
    return Math.round((this.target - Date.now()) / 1000) || 0
  }

  * _generator() {
    let i = 0
    const s = Date.now()
    while (true) yield this._events.next(i++, new Date(s), this.target)
  }
}
