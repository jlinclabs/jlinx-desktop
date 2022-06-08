const Path = require('path')
const { app, ipcMain, BrowserWindow } = require('electron')

const queries = {}
const commands = {}

ipcMain.handle('execQuery', async (event, queryName, options) => {
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

ipcMain.handle('execCommand', async (event, commandName, options) => {
  if (!(commandName in commands))
    throw new Error(`command "${commandName}" is not defined`)
  console.log('execCommand', commandName, options)
  return await commands[commandName](options)
})

function handleQuery(queryName, handler){
  if (queryName in queries)
    throw new Error(`query "${queryName}" is already defined`)
  queries[queryName] = handler
}

function handleCommand(commandName, handler){
  if (commandName in commands)
    throw new Error(`command "${commandName}" is already defined`)
  commands[commandName] = handler
}

function execCommand(commandName, options){
  const window = getAllWindows.getFocusedWindow()
  window.webContents.send('execCommand', options)
}

handleCommand('ping', ({ id }) => {
  return { pong: id }
})

handleQuery('__inspect', () => {
  return {
    queries: Object.keys(queries),
    commands: Object.keys(commands),
  }
})

module.exports = {
  handleQuery,
  handleCommand,
  execCommand,
}
