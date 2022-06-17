const Debug = require('debug')
const debug = Debug('jlinx:LoginRequestHandler')

module.exports = class LoginRequestHandler {
  constructor(opts){
    this.jlinx = opts.jlinx
    this.appAccounts = opts.appAccounts
    this._onLoginRequest  = opts.onLoginRequest

    this._map = new Map()
    this._seen = new Set()
    this.appAccounts.on('put', id => {
      this._waitForNextUpdate(id)
    })
    this.appAccounts.on('delete', id => {
      // this._stopTracking(id)
      this._map.delete(id)
    })
    this.appAccounts.ids().then(ids => {
      debug(`this.appAccounts.ids()`, ids)
      ids.forEach(id => this._waitForNextUpdate(id))
    })
  }

  async _waitForNextUpdate(appAccountId){
    debug('WATCHING FOR LOGIN REQUEST ON', appAccountId)
    const appAccount = await this.appAccounts.get(appAccountId)
    debug({ appAccount })
    const appUser = await this.jlinx.get(appAccount.appUserId)
    const promise = appUser.waitForUpdate()
      .then(
        async () => {
          debug('appUser updated', appUser)
          await appUser.update()
          // const [header, ...events] = await appUser.allJson()
          const sessionRequests = await appUser.getSessionRequests()
          debug('appUser sessionRequests', sessionRequests)
          const newSessionRequests = sessionRequests
            .filter(sr => !this._seen.has(sr.id))
            .reverse()

          for (const sessionRequest of newSessionRequests){
            this._seen.add(sessionRequest.id)
            this._onLoginRequest({
              ...sessionRequest,
              host: appAccount.host,
            })
            break
          }
        },
        error => {
          console.error(`LoginRequestHandler failed to wait for update for appAccount "${id}"`, error)
        }
      )
      .then(() => {
        this._waitForNextUpdate(appAccountId)
      })
      .catch(error => {
        console.error('_waitForNextUpdate', error)
      })
  }

  async get(id){
    const [docId, index] = id.split('/')
    // const appAccount = await this.appAccounts.get(appAccountId)
    const appUser = await this.jlinx.get(docId)
    return await appUser.getJson(index)
  }
}
