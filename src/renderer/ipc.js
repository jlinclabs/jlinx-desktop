import useAsync from './useAsync'
import { useCallback } from 'react'

const { ipcRenderer } = window.electron

// SENDING QUERIES AND COMMANDS

function wrapIpcMethod(funcName){
  async function wrappedIpcCall(...args){
    console.log(funcName, ...args)
    try{
      const result = await ipcRenderer[funcName](...args)
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


// RECIEVING QUERIES AND COMMANDS


const queries = {}
const commands = {}

ipcRenderer.handle('execQuery', async (event, queryName, options) => {
  if (!(queryName in queries))
    throw new Error(`query "${queryName}" is not defined`)
  console.log('execQuery', queryName, options)
  try{
    const result = await queries[queryName](options)
    console.log('execQuery', queryName, options, 'resolved', result)
    return result
  }catch(error){
    console.log('execQuery', queryName, options, 'rejected', error)
    throw error
  }
})

ipcRenderer.handle('execCommand', async (event, commandName, options) => {
  if (!(commandName in commands))
    throw new Error(`command "${commandName}" is not defined`)
  console.log('execCommand', commandName, options)
  return await commands[commandName](options)
})

export function handleQuery(queryName, handler){
  if (queryName in queries)
    throw new Error(`query "${queryName}" is already defined`)
  queries[queryName] = handler
}

export function handleCommand(commandName, handler){
  if (commandName in commands)
    throw new Error(`command "${commandName}" is already defined`)
  commands[commandName] = handler
}


handleCommand('ping', ({ id }) => {
  return { pong: id }
})
