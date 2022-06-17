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
    const appUserDoc = await this.jlinx.get(appAccount.appUserId)
    const promise = appUserDoc.waitForUpdate()
      .then(
        async () => {
          debug('appUserDoc updated', appUserDoc)
          await appUserDoc.update()
          const [header, ...events] = await appUserDoc.allJson()
          debug('appUserDoc header', header)
          debug('appUserDoc events', events)
          const newEvents = events
            .map((event, index) => {
              return {...event, id: `${appUserDoc.id}/${index}`}
            })
            .filter(event => !this._seen.has(event.id))
            .reverse()
          for (const event of newEvents){
            if (event && event.event === 'login-requested'){
              // const age = new Date() - new Date(event.at)
              // TODO check age
              this._seen.add(event.id)
              this._onLoginRequest({
                ...event,
                host: appAccount.host,
              })
              break
            }
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
    const appUserDoc = await this.jlinx.get(docId)
    return await appUserDoc.getJson(index)
  }
}
