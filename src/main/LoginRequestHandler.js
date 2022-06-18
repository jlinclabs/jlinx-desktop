const Debug = require('debug')
const debug = Debug('jlinx:LoginRequestHandler')

// TODO rename to LoginRequestsWatcher
module.exports = class LoginRequestHandler {
  constructor(opts){
    this.jlinx = opts.jlinx
    this.appAccounts = opts.appAccounts
    this._onLoginRequest  = opts.onLoginRequest
    this._appUsers = new Map() // id => AppUser
    this._seen = new Map() // id => Set (of seen sessionRequestIds)
    this.appAccounts.on('put', id => {
      this._watch(id)
    })
    this.appAccounts.on('delete', id => {
      this._stopWatching(id)
    })
    this.appAccounts.ids().then(ids => {
      for (const id of ids) this._watch(id)
    })
  }

  _watch (appAccountId) {
    (async () => {
      const appAccount = await this.appAccounts.get(appAccountId)
      debug('_watch', { appAccount })
      const appUser = await this.jlinx.get(appAccount.appUserId)
      await appUser.update()
      if (appUser.appAccountId !== appAccountId){
        throw new Error(
          `appAccountId missmatch ` +
          `${appUser.appAccountId} !== ${appAccountId}`
        )
      }
      debug('_watch', { appUser })
      this._appUsers.set(appAccountId, appUser)
      this._seen.set(appAccountId, new Set())
      await this._getNewSessionRequests(appAccountId)
      this._waitForNextUpdate(appAccountId)
    })().catch(error => {
      console.error('FAILED TO WATCH AppAccount', appAccountId, error)
    })
  }

  _watching(appAccountId){
    return this._appUsers.has(appAccountId)
  }

  _stopWatching(appAccountId){
    this._appUsers.delete(appAccountId)
    this._seen.delete(appAccountId)
  }

  async _getNewSessionRequests(appAccountId){
    const appUser = this._appUsers.get(appAccountId)
    const seen = this._seen.get(appAccountId)
    const sessionRequests = await appUser.getSessionRequests()
    const newSessionRequests = []
    for (const sessionRequest of sessionRequests){
      if (seen.has(sessionRequest.sessionRequestId)) continue
      seen.add(sessionRequest.sessionRequestId)
      newSessionRequests.push(sessionRequest)
    }
    return newSessionRequests
  }

  _waitForNextUpdate(appAccountId){
    if (!this._watching(appAccountId)) { debug(`ABORT ${appAccountId}`); return}
    const appUser = this._appUsers.get(appAccountId)
    debug('waiting for', appUser.appAccountId)
    appUser.waitForUpdate().then(
      async () => {
        if (!this._watching(appAccountId)) { debug(`ABORT ${appAccountId}`); return}
        await appUser.update()
        debug('appUser updated', appUser)
        const [newSessionRequest] = await this._getNewSessionRequests(appAccountId)
        debug({ newSessionRequest })
        if (newSessionRequest){
          this._onLoginRequest({
            ...newSessionRequest,
            appAccountId,
            id: `${appAccountId}/${newSessionRequest.sessionRequestId}`,
            host: appUser.host,
          })
        }
      },
      error => {
        debug(`LoginRequestHandler wait failed for ${appUser.appAccountId}`, error)
      }
    )
    .then(() => { this._waitForNextUpdate(appAccountId) })
  }


  async get(id){
    const [ appAccountId, sessionRequestId ] = id.split('/')
    const appAccount = await this.appAccounts.get(appAccountId)
    const appUser = this._appUsers.get(appAccountId)
    const sessionRequests = await appUser.getSessionRequests()
    const sessionRequest = sessionRequests.find(sr =>
      sr.sessionRequestId === sessionRequestId)
    if (sessionRequest) return {
      sessionRequest,
      appAccount,
    }
  }

  async resolve(id, accept){
    const [ appAccountId, sessionRequestId ] = id.split('/')
    const appAccount = await this.jlinx.get(appAccountId)
    await appAccount.update()
    return await appAccount.resolveSessionRequest(sessionRequestId, accept)
  }

}
