import jlinx from './jlinx'
import { useState, useRef, useEffect, useCallback } from 'react'

function useQuery(makeQuery, args = []){
  const [state, setState] = useState('loading')
  const query = useRef()
  query.state = state
  query.loaded = state === 'loaded'
  query.loading = state === 'loading'

  useEffect(
    () => {
      if (query.state === 'loading' && !query.promise) {
        query.promise = Promise.resolve(makeQuery()).then(
          result => {
            query.result = result
            setState('loaded')
          },
          error => {
            console.error(error)
            query.error = error
            setState('error')
          }
        )
        setState('loading')
      }
    },
    [state, ...args]
  )
  return query
}

function useCommand(execCommand, args = []){
  const [state, setState] = useState('idle') // idle | executing | success | failure
  const cmd = useRef()
  cmd.isIdle = state === 'idle'
  cmd.isExecuting = state === 'executing'
  cmd.isSuccess = state === 'success'
  cmd.isFailure = state === 'failure'
  cmd.exec = useCallback(
    (...args) => {
      if (cmd.isExecuting) throw new Error('already executing')
      cmd.promise = Promise.resolve(execCommand(...args)).then(
        result => {
          cmd.result = result
          setState('success')
        },
        error => {
          console.error(error)
          cmd.error = error
          setState('failure')
        }
      )
      setState('executing')
    },
    []
  )
  return cmd
}

export const useJlinxHypercoreStatusQuery = () =>
  useQuery(() => jlinx.hypercore.status())

export const useJlinxAllDidsDocumentsQuery = () =>
  useQuery(() => jlinx.dids.all())

export const useJlinxDidDocumentQuery = (did) =>
  useQuery(() => jlinx.dids.resolve(did), [did])

export const useJlinxDidCreateCommand = (options) =>
  useCommand(() => jlinx.dids.create(options), [options])
