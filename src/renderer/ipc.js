import useAsync from './useAsync'
import { useCallback } from 'react'


function wrapIpcMethod(funcName){
  async function wrappedIpcCall(...args){
    console.log(funcName, ...args)
    try{
      const result = await window.electron.ipcRenderer[funcName](...args)
      console.log(funcName, ...args, 'resolved', result)
      return result
    }catch(error){
      console.error(funcName, ...args, 'rejected', error)
      throw error
    }
  }
  return wrappedIpcCall
}

export const execQuery = wrapIpcMethod('execQuery')
export const execCommand = wrapIpcMethod('execCommand')

window.execQuery = execQuery
window.execCommand = execCommand

export function useQuery(queryName, options){
  return useAsync(
    useCallback(
      () => execQuery(queryName, options),
      [queryName]
    ),
    true
  )
}

export function useCommand(commandName, options = {}, immediate = false){
  return useAsync(
    useCallback(
      moreOptions => execCommand(commandName, {
        ...options,
        ...moreOptions
      }),
      [commandName]
    ),
    immediate
  )
}
