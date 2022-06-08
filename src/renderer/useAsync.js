import * as React from 'react'
import { useRef, useState, useCallback, useEffect } from 'react'
import useForceUpdate from './useForceUpdate'

const STATES = ['idle', 'pending', 'resolved', 'rejected']
export default function useAsync(asyncFunction, immediate = true){
  const forceUpdate = useForceUpdate()
  const ctx = useRef()

  const setState = state => {
    ctx.state = STATES[state]
    STATES.forEach((name, index) => {
      ctx[name] = index === state
    })
    forceUpdate()
  }

  if (ctx.state === undefined) setState(0)

  ctx.call = useCallback(
    options => {
      if (ctx.promise) throw new Error(`already executing`)
      ctx.promise = new Promise((resolve, reject) => {
        asyncFunction(options).then(resolve, reject)
      }).then(
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
    () => { if (immediate && ctx.state === STATES['0']) ctx.call() },
    [ctx.call, immediate, ctx.state]
  )

  return ctx
}
