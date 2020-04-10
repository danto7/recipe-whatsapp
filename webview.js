const { remote } = require('electron');
const path = require('path');

const webContents = remote.getCurrentWebContents();
const { session } = webContents;

setTimeout(() => {
  const elem = document.querySelector('.landing-title.version-title');
  if (elem && elem.innerText.toLowerCase().includes('google chrome')) {
    window.location.reload();
  }
}, 1000);

window.addEventListener('beforeunload', async () => {
  try {
    session.flushStorageData();
    session.clearStorageData({
      storages: ['appcache', 'serviceworkers', 'cachestorage', 'websql', 'indexdb'],
    });

    const registrations = await window.navigator.serviceWorker.getRegistrations();

    registrations.forEach((r) => {
      r.unregister();
      console.log('ServiceWorker unregistered');
    });
  } catch (err) {
    console.err(err);
  }
});

module.exports = (Franz) => {
  const title = document.querySelector('title');
  const getMessages = function getMessages() {
    const match = /^\((\d+)\) WhatsApp/gm.exec(title.innerText)
    if(match){
      Frant.setBadge(parseInt(match[1]))
    }else{
      console.warn("Couldn't parse badge count from title.")
      Franz.setBadge(0);
    }
  };

  Franz.injectCSS(path.join(__dirname, 'service.css'));
  Franz.loop(getMessages);
};
