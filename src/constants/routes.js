import React from 'react';
import {NavLink, Redirect} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import FontAwesome from 'react-fontawesome';
import {Home, ForgotPassword, Publish, Login, Profile, Settings, VlogEditor, ConfigureVlog, RenderVlog, NotFound, Logout, VlogDetails, Template, Customize, Share} from '../containers';
import {DeleteVlog} from '../components';
import styles from './styles.scss';

export const history = createBrowserHistory();

const backButton = <FontAwesome className={styles.icon} name="angle-left" onClick={history.goBack}/>;

const notFound = {
  name: 'Not Found',
  path: '/not-found',
  component: NotFound,
  header: true
};

const login = {
  name: 'Login',
  icon: 'sign-in-alt',
  path: '/',
  component: Login,
};

const logout = {
  name: 'Logout',
  path: '/logout',
  component: Logout
};

const forgotPassword = {
  name: 'Forgot Password',
  path: '/forgot-password',
  component: ForgotPassword,
  header: {
    left: backButton
  }
};

const home = {
  name: 'Home',
  icon: 'home',
  path: '/home',
  component: Home,
  header: {
    center: <div className={styles.homeHeader}></div>
  },
  navBar: true
};

const editVlog = {
  name: 'Vlog Editor',
  path: '/edit-vlog',
  component: VlogEditor,
  header: {
    left: backButton
  }
};

const publish = {
  name: 'Publish',
  icon: 'publish',
  path: '/publish',
  component: Publish,
  header: true,
  navBar: true
};

const settings = {
  name: 'Settings',
  path: '/settings',
  component: Settings,
  header: {
    left: backButton
  }
};

const profile = {
  name: 'Profile',
  icon: 'profile',
  path: '/profile',
  component: Profile,
  header: {
    left: <NavLink to="/settings"><FontAwesome className={styles.icon} name="cog"/></NavLink>,
    right: <NavLink to="/logout"><FontAwesome className={styles.icon} name="sign-out"/></NavLink>
  },
  navBar: true
};

const vlogEditor = {
  name: 'Edit Vlog',
  path: '/edit-vlog',
  component: VlogEditor,
  header: {
    left: backButton
  }
};

const configureVlog = {
  name: 'Configure Vlog',
  path: '/configure-vlog',
  component: ConfigureVlog,
  header: {
    left: backButton
  }
};

const renderVlog = {
  name: 'Render Vlog',
  path: '/render-vlog',
  component: RenderVlog,
  header: {
    left: backButton
  },
  navBar: true
};

const vlogDetails = {
  name: 'Vlog details',
  path: '/vlog-details',
  component: VlogDetails,
  header: {
    left: backButton,
  }
};

const template = {
  name: 'Template',
  path: '/template',
  component: Template,
  header: {
    left: backButton
  },
};

const customize = {
  name: 'Customize',
  path: '/customize',
  component: Customize,
  header: {
    left: backButton
  }
};

const share = {
  name: 'Share',
  path: '/share',
  component: Share,
  header: {
    left: backButton
  }
};

export const navBarRoutes = [home, editVlog, profile];

const allRoutes = [notFound, login, logout, forgotPassword, home, editVlog, settings, profile, publish, vlogEditor, configureVlog, renderVlog, vlogDetails, template, customize, share];

export default allRoutes;
