import React from 'react';
import {NavLink} from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import AddVlog from '../components/AddVlog';
import Home from '../components/Home';
import Login from '../components/Login';
import Profile from '../components/Profile';
import Settings from '../components/Settings';
import VlogList from '../components/VlogList';

const backButton = <NavLink to="/home"><FontAwesome name="angle-left"/> Back</NavLink>;

const login = {
  name: 'Login',
  icon: 'sign-in-alt',
  path: '/',
  component: Login
};

const home = {
  name: 'Home',
  icon: 'home',
  path: '/home',
  component: Home,
  headerLeft:  <NavLink to="/profile"><FontAwesome name="user"/></NavLink>,
  headerRight: <NavLink to="/settings"><FontAwesome name="cog"/></NavLink>,
};

const savedVlogs = {
  name: 'Saved Vlogs',
  icon: 'save',
  path: '/saved-vlogs',
  component: VlogList
};

const addVlog = {
  name: 'Add Vlog',
  icon: 'film',
  path: '/add-vlog',
  component: AddVlog
};

const FinishedVlogs = {
  name: 'Finished Vlogs',
  icon: 'check',
  path: '/finished-vlogs',
  component: VlogList
};

const myVlogs = {
  name: 'My Vlogs',
  icon: 'list-ul',
  path: '/my-vlogs',
  component: VlogList
};

const settings = {
  name: 'Settings',
  icon: 'cog',
  path: '/settings',
  component: Settings,
  headerLeft: backButton
};

const profile = {
  name: 'Profile',
  icon: 'user',
  path: '/profile',
  component: Profile,
  headerLeft: backButton,
};

const vlogList = {
  name: 'Vlog List',
  icon: 'user',
  path: '/vlog-list',
  component: VlogList
};

export const navBarRoutes = [home, savedVlogs, addVlog, FinishedVlogs, myVlogs];

const allRoutes = [login, home, savedVlogs, addVlog, FinishedVlogs, myVlogs, settings, profile, vlogList];

export default allRoutes;
