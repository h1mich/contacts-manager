import _ from 'lodash';
import axios from 'axios';
import keycode from 'keycode';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cookies from 'js-cookie';
import { CMButton, CMCheckbox, CMInput, CMErrorModal } from './common';

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      credentialsError: false,
      remember: true
    };
  }

  render() {
    // this.props.currentUser might not be null in case if
    // the user logged in and then pressed the back button.
    if (this.props.currentUser) {
      // The line "you can either" should be long coz otherwise the spaces get removed.
      return (
        <div style={ styles.error }>
          This part of the app is only available for unauthorized users.<br/>
          You can either <span style={ styles.logoutLink } onClick={ () => this.logout() }>log out</span> or <Link to="/contacts">go to contacts</Link>.
        </div>
      );
    }

    return (
      <div style={ styles.root }>
        <div style={ styles.tabs }>
          <div style={ styles.activeTab }>Log in</div>
          <div className="blue-hover"
               onClick={ () => this.props.history.push('/register') }
               style={ styles.hiddenTab }>Register</div>
        </div>

        <CMInput isValid={ !_.isEmpty(this.state.username) }
                 placeholder="Username"
                 onKeyDown={ event => this.submitOnEnter(event) }
                 onChange={ event => this.setState({ username: event.target.value }) }
                 autoFocus="autofocus"
                 value={ this.state.username }
                 type="text"/>

        <CMInput isValid={ !_.isEmpty(this.state.password) }
                 placeholder="Password"
                 onKeyDown={ event => this.submitOnEnter(event) }
                 onChange={ event => this.setState({ password: event.target.value }) }
                 value={ this.state.password }
                 type="password"/>

        <CMCheckbox value={ this.state.remember }
                    onChange={ () => this.setState({ remember: !this.state.remember }) }>
          Remember me on this site
        </CMCheckbox>

        <CMButton color="blue"
                  onClick={ () => this.login() }
                  disabled={ _.isEmpty(this.state.username) || _.isEmpty(this.state.password) }>
          LOG IN
        </CMButton>

        {
          this.state.credentialsError ?
            <CMErrorModal onClose={ () => this.setState({ credentialsError: false }) }>
              Wrong credentials.
            </CMErrorModal> :
            null
        }
      </div>
    );
  }

  submitOnEnter(event) {
    if (event.which == keycode.codes['enter'] && this.state.username && this.state.password) this.login();
  }

  login() {
    this.props.dispatch({ type: 'LOADING', value: true });
    axios.post('/api/login', {
      username: this.state.username,
      password: this.state.password
    }).then(response => {
      // credentials-error is handled here because in catch callback should be only
      // serious errors like unavailable server on database error
      if (response.data == 'credentials-error') {
        this.setState({ credentialsError: true });
        this.props.dispatch({ type: 'LOADING', value: false });
        // Remove focus from the active input to forbid the user to write while the modal is open
        document.activeElement.blur();
      } else {
        this.props.dispatch({ type: 'LOGIN', data: response.data });
        // contacts might be viewed only by authenticated users
        this.props.history.push('/contacts');

        if (this.state.remember) {
          // In a real app there would be token instead of these credentials.
          cookies.set('username', response.data.username);
          cookies.set('password', response.data.password);
        }
      }
    }).catch(console.error);
  }

  logout() {
    cookies.remove('username');
    cookies.remove('password');
    this.props.dispatch({ type: 'LOGOUT' });
  }
}

LoginPage.propTypes = {
  currentUser: PropTypes.object
};

const styles = {
  error: {
    margin: 'auto',
    textAlign: 'center'
  },
  root: {
    width: '400px',
    margin: 'auto',
    border: '1px solid rgb(15, 33, 76)',
    background: 'white'
  },
  tabs: {
    overflow: 'hidden',
    height: '40px'
  },
  activeTab: {
    float: 'left',
    width: '50%',
    height: '100%',
    color: 'black',
    fontSize: '16px',
    padding: '12px 10px 8px 10px',
    textAlign: 'center'
  },
  hiddenTab: {
    float: 'left',
    width: '50%',
    height: '100%',
    color: 'white',
    fontSize: '16px',
    padding: '12px 10px 8px 10px',
    textAlign: 'center',
    cursor: 'pointer',
    background: 'rgb(15, 33, 76)'
  },
  logo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    color: 'white',
    fontSize: '18px'
  },
  logoutLink: {
    textDecoration: 'underline',
    color: 'blue',
    cursor: 'pointer'
  }
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

export default connect(mapStateToProps)(LoginPage);