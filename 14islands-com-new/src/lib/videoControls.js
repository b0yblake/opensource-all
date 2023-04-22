const swallowError = () => ({})

export const play = ref => {
  if (typeof ref?.current?.play !== 'function') return
  const promise = ref.current.play()
  if (promise) promise.catch(swallowError)
}

export const pause = ref => {
  if (typeof ref?.current?.pause !== 'function') return
  ref.current.pause()
}
