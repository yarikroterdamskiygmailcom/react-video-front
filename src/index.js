import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';
import {Router} from 'react-router';
import {VlogEditorStore, SessionStore, ProfileStore, VlogsStore, AssetsStore, TemplateEditorStore, TemplateStore, SettingsStore, ProjectStore, OverlayStore} from './stores';
import App from './containers/App';
import {history} from './constants/routes';
import './scss/main.scss';
import {Toast, Overlay} from './components';

export const sessionStore = new SessionStore();
const assetsStore = new AssetsStore();
const templateEditorStore = new TemplateEditorStore();
const profileStore = new ProfileStore();
export const vlogEditorStore = new VlogEditorStore();
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
  templateEditor: templateEditorStore,
  template: templateStore,
  settings: settingsStore,
  project: projectStore,
  overlay: overlayStore
};

const renderApp = () =>
  ReactDOM.render(
    <Provider {...stores}>
      <React.Fragment>
        <Router history={history}>
          <App />
        </Router>
        <Overlay />
        <Toast />
      </React.Fragment>
    </Provider>,
    document.getElementById('app')
  );

renderApp();
