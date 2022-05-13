import * as React from 'react'
import { useRef, useState, useCallback, useEffect } from 'react'

const STATES = ['idle', 'pending', 'resolved', 'rejected']
export default function useAsync(asyncFunction, immediate = true){
  const [state, setState] = useState(0)
  const ctx = useRef()
  ctx.state = STATES[state]
  STATES.forEach((name, index) => { ctx[name] = index === state })

  ctx.call = useCallback(
    options => {
      if (ctx.promise) throw new Error(`already executing`)
      ctx.promise = asyncFunction(options).then(
        result => {
          delete ctx.promise
          ctx.result = result
          setState(2)
        },
        error => {
          delete ctx.promise
          ctx.error = error
          setState(3)
        },
      )
      setState(1)
      return ctx.promise
    },
    [asyncFunction]
  )

  useEffect(
    () => { if (immediate) ctx.call() },
    [ctx.call, immediate]
  )

  return ctx
}
