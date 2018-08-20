import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import {Provider} from 'mobx-react';
import {Router} from 'react-router';
import {AddVlogStore, SessionStore, ProfileStore, VlogsStore} from './src/stores';
import App from './src/containers/App';

export const history = createBrowserHistory();

const addVlogStore = new AddVlogStore();
const profileStore = new ProfileStore();
const sessionStore = new SessionStore();
const vlogsStore = new VlogsStore();

sessionStore.initialize();

const stores = {
  addVlog: addVlogStore,
  profile: profileStore,
  session: sessionStore,
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
