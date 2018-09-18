import React from 'react';
import {NavLink, Redirect} from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import {Assets, Home, ForgotPassword, Publish, Login, Profile, Settings, VlogEditor, ConfigureVlog, RenderVlog, NotFound, Logout, VlogDetails} from '../containers';
import styles from './styles.scss';

const backButton = <NavLink to="/home"><FontAwesome name="angle-left"/> Back</NavLink>;

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
    left: <NavLink to="/profile"><FontAwesome name="chevron-left"/> Back</NavLink>,
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
    left: <NavLink to={vlogEditor.path}><FontAwesome name="angle-left"/> Back</NavLink>
  }
};

const renderVlog = {
  name: 'Render Vlog',
  path: '/render-vlog',
  component: RenderVlog,
  header: {
    left: <NavLink to={configureVlog.path}><FontAwesome name="angle-left"/> Back</NavLink>
  }
};

const vlogDetails = {
  name: 'Vlog details',
  path: '/vlog-details',
  component: VlogDetails,
  header: {
    left: backButton
  }
};

export const navBarRoutes = [home, addVlog, profile];

const allRoutes = [notFound, login, logout, forgotPassword, home, assets, editVlog, addVlog, settings, profile, publish, vlogEditor, configureVlog, renderVlog, vlogDetails];

export default allRoutes;
