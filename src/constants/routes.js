import React from 'react';
import {NavLink} from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import {Assets, Home, Publish, Login, Profile, Settings, VlogEditor, ConfigureVlog, RenderVlog, NotFound} from '../containers';

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
  header: true,
};

const home = {
  name: 'Home',
  icon: 'home',
  path: '/home',
  component: Home,
  header: {
    left: <NavLink to="/profile"><FontAwesome name="user"/></NavLink>,
    right: <NavLink to="/settings"><FontAwesome name="cog"/></NavLink>
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
  name: 'Add Vlog',
  icon: 'film',
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
    left: backButton
  }
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

export const navBarRoutes = [home, addVlog, publish];

const allRoutes = [notFound, login, home, assets, addVlog, settings, profile, publish, vlogEditor, configureVlog, renderVlog];

export default allRoutes;
