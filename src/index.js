import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';
import {Router} from 'react-router';
import {VlogEditorStore, SessionStore, ProfileStore, VlogsStore, AssetsStore, TemplateEditorStore, TemplateStore, SettingsStore, ProjectStore, OverlayStore} from './stores';
import App from './containers/App';
import {history} from './constants/routes';
import './scss/main.scss';

export const sessionStore = new SessionStore();
const assetsStore = new AssetsStore();
const templateEditorStore = new TemplateEditorStore();
const profileStore = new ProfileStore();
export const vlogEditorStore = new VlogEditorStore();
const vlogsStore = new VlogsStore();
export const templateStore = new TemplateStore();
const settingsStore = new SettingsStore();
const projectStore = new ProjectStore();
const overlayStore = new OverlayStore();

sessionStore.initialize();

const stores = {
  assets: assetsStore,
  profile: profileStore,
  session: sessionStore,
  vlogEditor: vlogEditorStore,
  vlogs: vlogsStore,
  templateEditor: templateEditorStore,
  template: templateStore,
  settings: settingsStore,
  project: projectStore,
  overlay: overlayStore
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
