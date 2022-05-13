
const { ipcRenderer } = electron

const invoke = (eventType, ...args) =>
  window.electron.ipcRenderer.invoke(`jlinx:${eventType}`, ...args)

const invoker = eventType => (...args) => invoke(eventType, ...args)

const jlinx = {
  config: invoker('config'),
  dids: {
    resolve: invoker('dids:resolve'),
    all: invoker('dids:all'),
    create: invoker('dids:create'),
    replicate: invoker('dids:replicate'),
    track: invoker('dids:track'),
    untrack: invoker('dids:untrack'),
  },
  hypercore: {
    status: invoker('hypercore:status'),
  },
}

window.jlinx = jlinx

module.exports = jlinx
