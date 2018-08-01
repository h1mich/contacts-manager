import axios from 'axios';
import cookies from 'js-cookie';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Switch, Route, withRouter } from 'react-router-dom';
import Header from './Header';
import ContactsPage from './ContactsPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import { CMLoader } from './common';
import { MIN_SCREEN_WIDTH, MIN_SCREEN_HEIGHT } from '../config.json';

class App extends React.Component {
  componentDidMount() {
    // Before the app starts user needs to be authenticated if he has credentials.
    if (this.props.credentials) {
      this.props.dispatch({ type: 'LOADING', value: true });

      axios.post('/api/login', {
        username: this.props.credentials.username,
        password: this.props.credentials.password
      }).then(response => {
        if (response.data == 'credentials-error') {
          // User has invalid credentials in the cookie we need to delete them.
          // It might happen when user manually edited the credentials items.
          cookies.remove('username');
          cookies.remove('password');
          // Just stop loading in order to trigger redux render cycle.
          this.props.dispatch({ type: 'CREDENTIALS_ERROR', value: false });
        } else { // User has valid credentials in the cookie.
          this.props.dispatch({ type: 'LOGIN', data: response.data });
        }
      }).catch(console.error);
    }

    window.addEventListener('resize', () => this.props.dispatch({
      type: 'RESIZE',
      width: document.body.clientWidth,
      height: document.body.clientHeight
    }));
  }

  render() {
    if (this.props.windowSize.width < MIN_SCREEN_WIDTH || this.props.windowSize.height < MIN_SCREEN_HEIGHT) return (
      <div style={ styles.incorrectSizeLabel }>
        Minimal required size of the window is { MIN_SCREEN_WIDTH }x{ MIN_SCREEN_HEIGHT }.
      </div>
    );

    return (
      <div style={ styles.root }>
        <Header/>
        {
          // If there are credentials we need to authenticate the user first.
          this.props.credentials && this.props.currentUser == null ? null :
            <div style={ styles.body }>
              <Switch>
                <Route path="/contacts" component={ ContactsPage }/>
                <Route path="/login" component={ LoginPage }/>
                <Route path="/register" component={ RegisterPage }/>
                <Route render={ () => {
                   // When the user hits any other url he should be redirected.
                   return this.props.currentUser ? <Redirect to="/contacts"/> : <Redirect to="/login"/>;
                 } }/>
              </Switch>
            </div>
        }
        { this.props.loading ? <CMLoader/> : null }
      </div>
    );
  }
}

App.propTypes = {
  windowSize: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  credentials: PropTypes.object
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    windowSize: state.windowSize,
    loading: state.loading,
    credentials: state.credentials
  };
}

const styles = {
  root: {
    height: '100%'
  },
  body: {
    height: 'calc(100% - 40px)',
    display: 'flex'
  },
  incorrectSizeLabel: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)'
  }
};

export default withRouter(connect(mapStateToProps)(App));
