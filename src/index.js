import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import {Provider} from 'mobx-react';
import {Router} from 'react-router';
import {VlogEditorStore, SessionStore, ProfileStore, VlogsStore, AssetsStore, VlogConfigStore, VlogDetailsStore, VlogRenderStore} from './stores';
import App from './containers/App';
import './scss/main.scss';

export const history = createBrowserHistory();

export const sessionStore = new SessionStore();
const assetsStore = new AssetsStore();
const profileStore = new ProfileStore();
const vlogConfigStore = new VlogConfigStore();
export const vlogEditorStore = new VlogEditorStore();
const vlogDetailsStore = new VlogDetailsStore();
const vlogRenderStore = new VlogRenderStore();
const vlogsStore = new VlogsStore();

sessionStore.initialize();

const stores = {
  assets: assetsStore,
  profile: profileStore,
  session: sessionStore,
  vlogConfig: vlogConfigStore,
  vlogDetails: vlogDetailsStore,
  vlogEditor: vlogEditorStore,
  vlogRender: vlogRenderStore,
  vlogs: vlogsStore
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
