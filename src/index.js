import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';
import {Router} from 'react-router';
import {VlogEditorStore, SessionStore, ProfileStore, VlogsStore, AssetsStore, TemplatesStore, SettingsStore, ProjectStore} from './stores';
import App from './containers/App';
import {history} from './constants/routes';
import './scss/main.scss';

export const sessionStore = new SessionStore();
const assetsStore = new AssetsStore();
const profileStore = new ProfileStore();
export const vlogEditorStore = new VlogEditorStore();
const vlogsStore = new VlogsStore();
export const templatesStore = new TemplatesStore();
const settingsStore = new SettingsStore();
const projectStore = new ProjectStore();

sessionStore.initialize();

const stores = {
  assets: assetsStore,
  profile: profileStore,
  session: sessionStore,
  vlogEditor: vlogEditorStore,
  vlogs: vlogsStore,
  templates: templatesStore,
  settings: settingsStore,
  project: projectStore
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
