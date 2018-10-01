import React from 'react';
import {NavLink, Redirect} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import FontAwesome from 'react-fontawesome';
import {Home, ForgotPassword, Publish, Login, Profile, Settings, VlogEditor, ConfigureVlog, RenderVlog, NotFound, Logout, VlogDetails, Template} from '../containers';
import {DeleteVlog} from '../components';
import styles from './styles.scss';

export const history = createBrowserHistory();

const backButton = <div onClick={history.goBack}><FontAwesome name="angle-left"/> Back</div>;

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

const addVlog = {
  name: 'Add Vlog',
  icon: 'camera',
  path: '/add-vlog',
  component: VlogEditor,
  props: {
    fromScratch: true
  },
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
    left: <NavLink to="/settings"><FontAwesome name="cog"/></NavLink>,
    right: <NavLink to="/logout">Log Out</NavLink>
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
    right: <DeleteVlog/>
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

export const navBarRoutes = [home, addVlog, profile];

const allRoutes = [notFound, login, logout, forgotPassword, home, editVlog, addVlog, settings, profile, publish, vlogEditor, configureVlog, renderVlog, vlogDetails, template];

export default allRoutes;
