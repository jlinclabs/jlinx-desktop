const Path = require('path')
const { app } = require('electron')
const { handleQuery, handleCommand } = require('./ipc')

handleQuery('getConfig', async (...args) => {
  const jlinx = await getJlinx()
  return await jlinx.config.read(...args)
})

handleQuery('getHypercoreStatus', async (...args) => {
  const jlinx = await getJlinx()
  await jlinx.ready()
  await jlinx.server.connected()
  const status = await jlinx.server.hypercore.status()
  return status
})

handleQuery('getAllKeys', async () => {
  const jlinx = await getJlinx()
  const keys = await jlinx.keys.all()
  return keys.map(keyPair => ({
    publicKey: keyPair.publicKeyAsString,
    type: keyPair.type,
    createdAt: keyPair.createdAt,
  }))
})

handleCommand('createKey', async (opts) => {
  const jlinx = await getJlinx()
  let keyPair
  if (opts.type === 'signing')
    keyPair = await jlinx.keys.createSigningKeyPair()
  else if (opts.type === 'encrypting')
    keyPair = await jlinx.keys.createEncryptingKeyPair()
  else
    throw new Error(`invalid type "${opts.type}"`)
  return keyPair
})

handleQuery('getDidDocument', async (did) => {
  console.log('???getDidDocument', {did})
  if (!did) return
  const jlinx = await getJlinx()
  return await jlinx.resolveDid(did)
})


handleCommand('resolveDid', async (did) => {
  const jlinx = await getJlinx()
  if (!did) return
  return await jlinx.resolveDid(did)
})

handleQuery('getAllDids', async (...args) => {
  const jlinx = await getJlinx()
  const dids = await jlinx.dids.all(...args)
  const didDocuments = await Promise.all(
    dids.map(did => jlinx.resolveDid(did))
  )
  return didDocuments
})

handleCommand('trackDid', async (...args) => {
  const jlinx = await getJlinx()
  return await jlinx.dids.track(...args)
})

handleCommand('untrackDid', async (...args) => {
  const jlinx = await getJlinx()
  return await jlinx.dids.untrack(...args)
})

handleCommand('createDid', async (...args) => {
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
