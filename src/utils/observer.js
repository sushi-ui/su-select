export default (key, cb, ctx) => {
  Object.defineProperty(ctx, key, {
    get() {
      return ctx[`$_${key}`]
    },
    set(value) {
      ctx[`$_${key}`] = value
      ctx[`${cb}`]()
    }
  })
}
