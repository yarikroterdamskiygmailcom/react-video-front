import React from 'react';
import {NavLink} from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import {Assets, Home, ForgotPassword, Publish, Login, Profile, Settings, VlogEditor, ConfigureVlog, RenderVlog, NotFound, Logout, VlogDetails} from '../containers';
import styles from './styles.scss';

const backButton = <NavLink to="/home"><FontAwesome name="angle-left"/> Back</NavLink>;

const notFound = {
  name: 'Not Found',
  icon: null,
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
  icon: null,
  path: '/forgot-password',
  component: ForgotPassword,
  header: {
    left: <NavLink to={login.path}><FontAwesome name="angle-left"/> Back</NavLink>
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

const assets = {
  name: 'Assets',
  path: '/assets',
  component: Assets,
  header: {
    left: backButton
  }
};

const addVlog = {
  name: 'Edit Vlog',
  icon: 'camera',
  path: '/edit-vlog',
  component: VlogEditor,
  header: {
    left: backButton
  }
};

const publish = {
  name: 'Publish',
  icon: 'share-alt',
  path: '/publish',
  component: Publish,
  header: true,
  navBar: true
};

const settings = {
  name: 'Settings',
  icon: 'cog',
  path: '/settings',
  component: Settings,
  header: {
    left: backButton
  }
};

const profile = {
  name: 'Profile',
  icon: 'user',
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
  icon: null,
  path: '/edit-vlog',
  component: VlogEditor,
  header: {
    left: backButton
  }
};

const configureVlog = {
  name: 'Configure Vlog',
  icon: null,
  path: '/configure-vlog',
  component: ConfigureVlog,
  header: {
    left: <NavLink to={vlogEditor.path}><FontAwesome name="angle-left"/> Back</NavLink>
  }
};

const renderVlog = {
  name: 'Render Vlog',
  icon: null,
  path: '/render-vlog',
  component: RenderVlog,
  header: {
    left: <NavLink to={configureVlog.path}><FontAwesome name="angle-left"/> Back</NavLink>
  }
};

const vlogDetails = {
  name: 'Vlog details',
  icon: null,
  path: '/vlog-details',
  component: VlogDetails,
  header: {
    left: backButton
  }
};

export const navBarRoutes = [home, addVlog, profile];

const allRoutes = [notFound, login, logout, forgotPassword, home, assets, addVlog, settings, profile, publish, vlogEditor, configureVlog, renderVlog, vlogDetails];

export default allRoutes;
