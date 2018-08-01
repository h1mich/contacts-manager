import _ from 'lodash';
import ReactDOM from 'react-dom';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import cookies from 'js-cookie';
import App from './components/App';

const store = createStore((state, action) => {
  // Initial declaration of the redux state.
  if (state == undefined) return {
    // The credentials of the current user.
    credentials: cookies.get('username') || cookies.get('password') ? {
      username: cookies.get('username'),
      password: cookies.get('password')
    } : null,

    // The user that is logged in at the moment.
    currentUser: null,

    // Whether the global loader should be displayed.
    loading: false,

    // List of contacts of the current user. It isn't stored
    // inside of currentUser because it's being used quite frequently
    // and it is simpler when it is closer to the root of the store.
    contacts: [],

    // Filter values for the contacts table.
    filters: {
      name: '',
      phone: '',
      comment: ''
    },

    // It used in order to show an error when there is no enough room for the app.
    windowSize: {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    },

    // Sort value for the contacts table.
    sorting: 'NAME_ASC'
  };

  if (action.type == 'LOGIN') return {
    ...state,
    loading: false,
    credentials: {
      username: action.data.username,
      password: action.data.password
    },
    currentUser: {
      hasDummies: action.data.hasDummies
    },
    contacts: action.data.contacts
  };

  if (action.type == 'CREDENTIALS_ERROR') return {
    ...state,
    loading: false,
    credentials: null
  };

  if (action.type == 'LOADING') return {
    ...state,
    loading: action.value
  };

  if (action.type == 'LOGOUT') return {
    ...state,
    credentials: null,
    currentUser: null,
    contacts: [],
    sorting: 'NAME_ASC',
    filters: {
      name: '',
      phone: '',
      comment: ''
    }
  };

  if (action.type == 'ADD_CONTACT') {
    state.contacts.push(action.contact);
    return {
      ...state,
      contacts: _.clone(state.contacts),
      loading: false
    };
  }

  if (action.type == 'DELETE_CONTACT') {
    state.contacts = _.reject(state.contacts, { id: action.id });
    return {
      ...state,
      contacts: _.clone(state.contacts),
      loading: false
    };
  }

  if (action.type == 'EDIT_CONTACT') {
    let contact = _.find(state.contacts, { id: action.contact.id });
    contact.phone = action.contact.phone;
    contact.name = action.contact.name;
    contact.comment = action.contact.comment;
    return {
      ...state,
      contacts: _.clone(state.contacts),
      loading: false
    };
  }

  if (action.type == 'EDIT_FILTER') return {
    ...state,
    filters: {
      ...state.filters,
      [action.name]: action.value
    }
  };

  if (action.type == 'DUMMIES') return {
    ...state,
    contacts: action.contacts,
    currentUser: {
      ...state.currentUser,
      hasDummies: true
    },
    loading: false
  };

  if (action.type == 'SORTING') return {
    ...state,
    sorting: action.value
  };

  if (action.type == 'RESIZE') return {
    ...state,
    windowSize: {
      width: action.width,
      height: action.height
    }
  };

  throw `ACTION TYPE "${action.type}" NOT FOUND IN REDUX`;
});

ReactDOM.render(
  <Provider store={ store }>
    <Router>
      <App/>
    </Router>
  </Provider>,
  // Do not render in the document.body component because it
  // might introduce conflicts with the browser's extensions.
  document.querySelector('#root')
);