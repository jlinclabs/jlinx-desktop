const { Notification, BrowserWindow, ipcMain } = require('electron')
const Debug = require('debug')
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
  // hostUrl: 'https://testnet1.jlinx.test', // development
  hostUrl: 'https://testnet1.jlinx.io', // production
  vaultPath: VAULT_PATH,
  vaultKey: TMP_VAULT_KEY
})

const appAccounts = jlinx.vault.recordStore('appAccounts')

const loginRequests = new LoginRequestHandler({
  jlinx,
  appAccounts,
  onLoginRequest(newSessionRequest){
    console.log('NEW LOGIN REQ', newSessionRequest)

    const host = newSessionRequest.host
    const ip = newSessionRequest.sourceInfo?.ip
    const browser = newSessionRequest.sourceInfo?.browser?.name || ''
    const os = newSessionRequest.sourceInfo?.os?.name || ''

    const notification = new Notification({
      // icon // TODO jlinx icon
      title: 'New App Login Request',
      body: `login to ${host} from ${ip} ${browser} ${os}`,
    })

    notification.on('click', () => {
      console.log('NOTIFICATION CLICKED')
      windows = BrowserWindow.getAllWindows()
      win = windows[0]
      // console.log({win})
      win.webContents.send('gotoPage', {
        pageName: 'LoginRequests',
        params: { id: newSessionRequest.id }
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
    value: (doc.value && await doc.value()),
    entries: (doc.entries && await doc.entries()),
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
  return await appAccounts.all()
})

handleQuery('accounts.get', async ({ id }) => {
  const account = await appAccounts.get(id)
  return {
    ...account,
    appAccountStreamUrl: `${jlinx.host.url}/${account.id}/stream`,
    appUserIdStreamUrl: account.appUserId && `${jlinx.host.url}/${account.appUserId}/stream`,
  }
})

handleCommand('accounts.login', async ({ id }) => {
  // const account = await appAccounts.get(id)
  const appAccount = await jlinx.get(id)
  await appAccount.update()
  const loginUrl = await appAccount.generateOnetimeLoginLink()
  return { loginUrl }
})


async function getAppUserOffering(appUserId){
  debug('getAppUserOffering', { appUserId })
  const appUser = await jlinx.get(appUserId)
  await appUser.update()
  debug('getAppUserOffering', { appUser })
  if (appUser.docType !== 'AppUser'){
    debug('getAppUserOffering: appUser.docType !== "AppUser"', appUser.docType)
    throw new Error(`this does not look like an account offering`)
  }
  // await appUser.update()

  debug('getAppUserOffering', {
    appUser,
    _value: appUser._value
  })

  if (!appUser.isOffered){
    throw new Error(`this does not look like an account offering`)
  }
  return appUser
}

handleQuery('accounts.review', async ({ id }) => {
  const appUser = await getAppUserOffering(id)
  return {
    id: appUser.id,
    host: appUser.host,
    // createdAt: now(), // TODO make real
  }
})

handleCommand('accounts.resolve', async ({ id, accept }) => {
  const appUser = await getAppUserOffering(id)
  if (accept) {
    const appAccount = await appUser.acceptOffer()
    // persist app account record
    await appAccounts.put(appAccount.id, {
      id: appAccount.id,
      appUserId: id,
      host: appAccount.host,
      createdAt: now(),
    })
    return {
      appAccountId: appAccount.id,
    }
  }else{
    await appUser.rejectOffer()
  }
})

handleCommand('accounts.delete', async ({ id }) => {
  return await appAccounts.delete(id)
})


handleQuery('loginRequests.get', async ({ id }) => {
  return await loginRequests.get(id)
})

handleCommand('loginRequests.resolve', async ({ id, accept }) => {
  return await loginRequests.resolve(id, accept)
})



