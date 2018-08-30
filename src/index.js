import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import {Provider} from 'mobx-react';
import {Router} from 'react-router';
import {VlogEditorStore, SessionStore, ProfileStore, VlogsStore, AssetsStore, VlogConfigStore, VlogRenderStore} from './stores';
import App from './containers/App';

export const history = createBrowserHistory();

const assetsStore = new AssetsStore();
const profileStore = new ProfileStore();
const sessionStore = new SessionStore();
const vlogConfigStore = new VlogConfigStore();
const vlogEditorStore = new VlogEditorStore();
const vlogRenderStore = new VlogRenderStore();
const vlogsStore = new VlogsStore();

sessionStore.initialize();

const stores = {
  assets: assetsStore,
  profile: profileStore,
  session: sessionStore,
  vlogConfig: vlogConfigStore,
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
