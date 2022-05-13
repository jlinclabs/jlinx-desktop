const Path = require('path')
const { app, ipcMain } = require('electron')

const handle = (eventType, handler) =>
  ipcMain.handle(`jlinx:${eventType}`, handler)

handle('config', async (event, ...args) => {
  const jlinx = await getJlinx()
  return await jlinx.config.read(...args)
})

handle('hypercore:status', async (event, ...args) => {
  const jlinx = await getJlinx()
  await jlinx.ready()
  await jlinx.server.connected()
  const status = await jlinx.server.hypercore.status()
  return status
})

handle('dids:resolve', async (event, did) => {
  const jlinx = await getJlinx()
  if (!did) return
  return await jlinx.resolveDid(did)
})

handle('dids:all', async (event, ...args) => {
  const jlinx = await getJlinx()
  const dids = await jlinx.dids.all(...args)
  const didDocuments = await Promise.all(
    dids.map(did => jlinx.resolveDid(did))
  )
  return didDocuments
})

handle('dids:track', async (event, ...args) => {
  const jlinx = await getJlinx()
  return await jlinx.dids.track(...args)
})

handle('dids:untrack', async (event, ...args) => {
  const jlinx = await getJlinx()
  return await jlinx.dids.untrack(...args)
})

handle('dids:create', async (event, ...args) => {
  const jlinx = await getJlinx()
  return await jlinx.createDid(...args)
})

getJlinx().then(jlinx => jlinx.ready())

async function getJlinx(){
  if (!getJlinx.jlinx){
    const { default: JlinxApp } = await import('jlinx-app')
    getJlinx.jlinx = new JlinxApp({
      storagePath: Path.join(app.getPath('userData'), 'jlinx'),
    })
  }
  return getJlinx.jlinx
}
