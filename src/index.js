import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';
import {Router} from 'react-router';
import {VlogEditorStore, SessionStore, ProfileStore, VlogsStore, AssetsStore, VlogConfigStore, VlogDetailsStore, TemplatesStore, SettingsStore} from './stores';
import App from './containers/App';
import {history} from './constants/routes';
import './scss/main.scss';

export const sessionStore = new SessionStore();
const assetsStore = new AssetsStore();
const profileStore = new ProfileStore();
const vlogConfigStore = new VlogConfigStore();
export const vlogEditorStore = new VlogEditorStore();
const vlogDetailsStore = new VlogDetailsStore();
const vlogsStore = new VlogsStore();
const templatesStore = new TemplatesStore();
const settingsStore = new SettingsStore();

sessionStore.initialize();

const stores = {
  assets: assetsStore,
  profile: profileStore,
  session: sessionStore,
  vlogConfig: vlogConfigStore,
  vlogDetails: vlogDetailsStore,
  vlogEditor: vlogEditorStore,
  vlogs: vlogsStore,
  templates: templatesStore,
  settings: settingsStore
};

const renderApp = () =>
  ReactDOM.render(
    <Provider {...stores}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>,
    document.getElementById('app')
  );

renderApp();

module.hot.accept(renderApp);
