import React from 'react';
import {NavLink} from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import {Home, AddVlog, Publish, Login, Profile, Settings} from '../containers';

const backButton = <NavLink to="/home"><FontAwesome name="angle-left"/> Back</NavLink>;

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

const addVlog = {
  name: 'Add Vlog',
  icon: 'film',
  path: '/add-vlog',
  component: AddVlog,
  header: true,
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

export const navBarRoutes = [home, addVlog, publish];

const allRoutes = [login, home, addVlog, settings, profile, publish];

export default allRoutes;
