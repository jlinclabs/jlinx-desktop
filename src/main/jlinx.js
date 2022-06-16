const { Notification, BrowserWindow, ipcMain } = require('electron')
const Debug = require('debug')
const { URL } = require('url')
const Path = require('path')
const b4a = require('b4a')
const { app } = require('electron')
const { handleQuery, handleCommand } = require('./ipc')
const JlinxClient = require('jlinx-client')
const { now, createRandomString } = require('jlinx-util')
const LoginRequestHandler = require('./LoginRequestHandler')
// const JlinxVault = require('jlinx-vault')
// const KeyStore = require('jlinx-vault/key-store')
// const JlinxIdentification = require('jlinx-identification')

const debug = Debug('jlinx:desktop:main')

// TODO generate at init and ask for from user
const TMP_VAULT_KEY = Buffer.from(
  'df60b78893f309f8388c6017d1eac35fbb7e7cc60938a388a5e913ff80356ee3',
  'hex'
)

const VAULT_NAME = process.env.VAULT_NAME || 'jlinx'
const VAULT_PATH = Path.join(app.getPath('userData'), `${VAULT_NAME}.vault`)

const jlinx = new JlinxClient({
  hostUrl: 'https://testnet1.jlinx.test',
  vaultPath: VAULT_PATH,
  vaultKey: TMP_VAULT_KEY
})

const appAccounts = jlinx.vault.recordStore('appAccounts')

const loginRequests = new LoginRequestHandler({
  jlinx,
  appAccounts,
  onLoginRequest(loginRequest){
    console.log('NEW LOGIN REQ', loginRequest)

    const notification = new Notification({
      // icon // TODO jlinx icon
      title: 'New App Login Request',
      body: `${loginRequest.host}`,
    })
    notification.on('click', () => {
      console.log('NOTIFICATION CLICKED')
      windows = BrowserWindow.getAllWindows()
      win = windows[0]
      // console.log({win})
      win.webContents.send('gotoPage', {
        pageName: 'LoginRequests',
        params: { id: loginRequest.id }
      })
      win.show()
    })
    notification.show()
    console.log({ notification })

    setTimeout(
      () => {
        // dont garbage collect me
        console.log({ notification })
      },
      1000 * 60
    )

  }
})


handleQuery('loginRequests', async ({ id }) => {
  return await loginRequests.get(id)
})

handleQuery('documents.all', async (...args) => {
  const docs = await jlinx.all()
  await Promise.all(docs.map(doc => doc.update())) // slow
  return docs.map(doc => {
    return {
      id: doc.id,
      length: doc.length,
      writable: doc.writable,
    }
  })
})

handleCommand('documents.create', async (opts) => {
  const doc = await jlinx.create(opts)
  debug('WTF PANDS', doc.id, doc)
  return doc.id
})

handleQuery('documents.get', async (id) => {
  const doc = await jlinx.get(id)
  await doc.ready()
  debug('documents.get', doc)
  return {
    id,
    docType: doc.docType,
    length: doc.length,
    writable: doc.writable,
    contentType: doc.contentType,
    value: await doc.value(),
    // entries: await doc.all(),
  }
})

handleQuery('documents.change', async (id) => {
  const doc = await jlinx.get(id)
  await doc.waitForUpdate()
})


handleCommand('documents.append', async ({id, block}) => {
  debug('documents.append', { id, block })
  const doc = await jlinx.get(id)
  debug('documents.append', { doc })
  debug('documents.append', doc.ownerSigningKeys)
  await doc.ready()
  if (doc.contentType === 'application/json'){
    doc.append([block])
  } else{
    const buffer = b4a.from(block)
    await doc.append([buffer])
  }
  return { length: doc.length }
})

handleQuery('accounts.all', async () => {
  const ids = await appAccounts.ids()
  console.log({ ids })
  return await appAccounts.all()
})

handleQuery('accounts.get', async ({ id }) => {
  return await appAccounts.get(id)
})

handleQuery('accounts.review', async ({ id }) => {
  debug('accounts.review', { id })
  const doc = await jlinx.get(id)
  debug('accounts.review', { doc })
  const headerJson = await doc.get(0)
  debug('accounts.review',
    headerJson
  )
  const header = await doc.getJson(0)
  debug('accounts.review', { header })
  const { followupUrl } = header
  return {...header, id}
})

handleCommand('accounts.add', async ({ id }) => {
  debug('accounts.add', { id })
  const appUser = await jlinx.get(id)
  debug('accounts.add', { appUser })
  const appUserE1 = await appUser.getJson(0)
  debug('accounts.add', { appUserE1 })
  const { followupUrl, signupSecret } = appUserE1

  const host = new URL(followupUrl).host

  // create our AppAccount document
  const appAccountDoc = await jlinx.createAppAccount({
    host,
    appUser: id,
    signupSecret,
  })

  const appAccount = {
    id: appAccountDoc.id,
    appUser: id,
    host,
    createdAt: now(),
  }

  const appUserUpdated = appUser.waitForUpdate()

  // post AppAccount.id to followupUrl
  const response = await fetch(followupUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      appUserId: id,
      appAccountId: appAccountDoc.id,
      signupSecret
    })
  })
  debug({ response })
  debug(await response.json())

  await appUserUpdated
  await appUser.update()
  console.log({ appUser })
  const appUserE2 = await appUser.getJson(1)
  debug('accounts.add', { appUserE2 })

  // persist id and other data
  await appAccounts.put(appAccount.id, appAccount)

  return appAccount
})

handleCommand('accounts.delete', async ({ id }) => {
  return await appAccounts.delete(id)
})

// handleCommand('jlinx.create', async (...args) => {
//   await jlinx.ready()
//   return await jlinx.create(...args)
// })

// handleQuery('jlinx.getLength', async (...args) => {
//   await jlinx.ready()
//   return await jlinx.getLength(...args)
// })

// handleQuery('jlinx.getEntry', async (...args) => {
//   await jlinx.ready()
//   return await jlinx.getEntry(...args)
// })

// handleCommand('jlinx.append', async (...args) => {
//   await jlinx.ready()
//   return await jlinx.append(...args)
// })



// // const identifications = new JlinxIdentifications(jlinx)
// // // TMP using vault for all persistance for now
// const identifications = jlinx.vault.namespace('identifications', 'json')
// Object.assign(identifications, {
//   async getIds(){
//     return await this.get('__ids') || []
//   },
//   async addId(id){
//     // TODO lock this file
//     const ids = new Set(await this.getIds())
//     ids.add(id)
//     await this.set('__ids', [...ids])
//   },
//   async remId(id) {
//     // TODO lock this file
//     const ids = new Set(await this.getIds())
//     ids.delete(id)
//     await this.set('__ids', [...ids])
//   }
// })


// handleQuery('getConfig', async (...args) => {
//   await jlinx.ready()
//   return await jlinx.config.read(...args)
// })

// handleQuery('getHypercoreStatus', async (...args) => {
//   await jlinx.ready()
//   await jlinx.server.connected()
//   const status = await jlinx.server.hypercore.status()
//   return status
// })

handleQuery('getAllIdentifications', async () => {
  // const ids = await identifications.getIds()
  // console.log('getAllIdentifications', { ids })
  // const docs = await Promise.all(
  //   ids.map(async id => {
  //     const doc = await jlinx.get(id)
  //     const ident = new JlinxIdentification(doc)
  //     return ident.value()
  //   })
  // )
})

// handleCommand('createIdentification', async () => {
//   const doc = await jlinx.create()
//   const identification = new JlinxIdentification(doc)
//   await identification.init()
//   await identifications.addId(doc.id)
//   return {
//     id: doc.id,
//   }
// })

// // handleQuery('getAllIdentification', async (id) => {
// //   // const identity = await .create()
// //   const doc = await jlinx.get(id)
// //   const identification = new JlinxIdentification(doc)
// //   await identification.init()
// //   await identifications.addId(doc.id)
// //   // const ids = await identifications.get('__ids') || []
// //   // const identifications = await Promise.all(ids.map(id => identifications.get(id)))
// //   return {
// //     id: doc.id,
// //   }
// // })

// handleQuery('getAllKeys', async () => {
//   await jlinx.ready()
//   const keys = await jlinx.keys.all()
//   return keys.map(keyPair => ({
//     publicKey: keyPair.publicKeyAsString,
//     type: keyPair.type,
//     createdAt: keyPair.createdAt,
//   }))
// })

// handleCommand('createKey', async (opts) => {
//   await jlinx.ready()
//   let keyPair
//   if (opts.type === 'signing')
//     keyPair = await jlinx.keys.createSigningKeyPair()
//   else if (opts.type === 'encrypting')
//     keyPair = await jlinx.keys.createEncryptingKeyPair()
//   else
//     throw new Error(`invalid type "${opts.type}"`)
//   return keyPair
// })

// handleQuery('getDidDocument', async (did) => {
//   console.log('???getDidDocument', {did})
//   if (!did) return
//   await jlinx.ready()
//   return await jlinx.resolveDid(did)
// })


// handleCommand('resolveDid', async ({did}) => {
//   await jlinx.ready()
//   if (!did) return
//   return await jlinx.resolveDid(did)
// })

// handleQuery('getAllDids', async (...args) => {
//   await jlinx.ready()
//   const dids = await jlinx.dids.all(...args)
//   const didDocuments = await Promise.all(
//     dids.map(did => jlinx.resolveDid(did))
//   )
//   return didDocuments
// })

// handleCommand('trackDid', async (...args) => {
//   await jlinx.ready()
//   return await jlinx.dids.track(...args)
// })

// handleCommand('untrackDid', async (...args) => {
//   await jlinx.ready()
//   return await jlinx.dids.untrack(...args)
// })

// handleCommand('createDid', async (...args) => {
//   await jlinx.ready()
//   const didDocument = await jlinx.createDid(...args)
//   await jlinx.replicateDid(didDocument.id)
//   return didDocument
// })

// handleQuery('getAllAccounts', async () => {
//   await jlinx.ready()
//   // return await jlinx.accounts.getAll()
//   return []
// })

// handleCommand('addAccount', async (id) => {
//   await jlinx.ready()
//   console.log('Add Account', id)
//   const doc = await jlinx.get(id)

//   console.log({ doc })

//   // return await jlinx.accounts.add(...args)
//   return {id: 'fake_account_id'}
// // })



// handleCommand('keys.create', async (...args) => {
//   await keys.ready()
//   return await keys.create(...args)
// })

// handleQuery('keys.sign', async (...args) => {
//   await keys.ready()
//   return await keys.sign(...args)
// })

// handleQuery('keys.verify', async (...args) => {
//   await keys.ready()
//   return await keys.verify(...args)
// })




async function fetch (url, options = {}) {
  const { default: fetch } = await import('node-fetch')
  debug('fetch req', { url, options })
  const response = await fetch(url, options)
  if (response.status >= 400) {
    debug('fetch failed', {
      url,
      status: response.status,
      statusText: response.statusText
    })
    throw new Error(`request failed url="${url}"`)
  }
  debug('fetch res', { url, options, status: response.status })
  return response
}
