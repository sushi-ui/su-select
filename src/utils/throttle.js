export default function throttle(callback, delay) {
  let isThrottled = false
  let args = null
  let context = null

  function wrapper() {
    if (isThrottled) {
      args = arguments
      context = this
      return
    }

    isThrottled = true
    callback.apply(this, arguments)

    setTimeout(() => {
      isThrottled = false
      if (args) {
        wrapper.apply(context, args)
        args = context = null
      }
    }, delay)
  }

  return wrapper
}
