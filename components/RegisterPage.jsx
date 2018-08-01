import axios from 'axios';
import keycode from 'keycode';
import React from 'react';
import { connect } from 'react-redux';
import { CMButton, CMInput, CMErrorModal } from './common';
import config from '../config.json';

class RegisterPage extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      usernameTakenError: false
    };
  }

  render() {
    return (
      <div style={ styles.root }>
        <div style={ styles.tabs }>
          <div className="blue-hover"
               onClick={ () => this.props.history.push('/login') }
               style={ styles.hiddenTab }>Log in</div>
          <div style={ styles.activeTab }>Register</div>
        </div>

        <CMInput isValid={ this.isUsernameValid() }
                 placeholder="Username"
                 onKeyDown={ event => this.submitOnEnter(event) }
                 onChange={ event => this.setState({ username: event.target.value }) }
                 autoFocus="autofocus"
                 value={ this.state.username }
                 type="text"/>

        <CMInput isValid={ this.isPasswordValid() }
                 placeholder="Password"
                 onKeyDown={ event => this.submitOnEnter(event) }
                 onChange={ event => this.setState({ password: event.target.value }) }
                 value={ this.state.password }
                 type="password"/>

        <CMButton color="blue"
                  onClick={ () => this.register() }
                  disabled={ !this.isUsernameValid() || !this.isPasswordValid() }>
          REGISTER
        </CMButton>
        {
          this.state.usernameTakenError ?
            <CMErrorModal onClose={ () => this.setState({ usernameTakenError: false }) }>
              This username is already taken.
            </CMErrorModal> :
            null
        }
      </div>
    );
  }

  submitOnEnter(event) {
    if (event.which == keycode.codes['enter'] && this.isUsernameValid() && this.isPasswordValid()) this.register();
  }

  isUsernameValid() {
    return new RegExp(config.usernameFormat).test(this.state.username);
  }

  isPasswordValid() {
    return new RegExp(config.passwordFormat).test(this.state.password);
  }

  register() {
    this.props.dispatch({ type: 'LOADING', value: true });
    axios.post('/api/register', {
      username: this.state.username,
      password: this.state.password,
      generate: this.state.generate
    }).then(response => {
      // This error is handled here because in catch callback should be only
      // serious errors like unavailable server on database error.
      if (response.data == 'username-taken-error') {
        this.setState({ usernameTakenError: true });
        // Remove focus from the active input to forbid the user to write while the modal is open.
        document.activeElement.blur();
      } else {
        // The user isn't logged in just in order to force him to use more functionality :)
        this.props.history.push('/login');
      }
      // No matter success or error the loader should be hidden.
      this.props.dispatch({ type: 'LOADING', value: false });
    });
  }
}

const styles = {
  root: {
    width: '400px',
    margin: 'auto',
    background: 'white',
    border: '1px solid rgb(15, 33, 76)'
  },
  tabs: {
    overflow: 'hidden',
    height: '40px'
  },
  hiddenTab: {
    float: 'left',
    width: '50%',
    height: '100%',
    background: 'rgb(15, 33, 76)',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    cursor: 'pointer'
  },
  activeTab: {
    float: 'left',
    width: '50%',
    height: '100%',
    background: 'white',
    color: 'black',
    fontSize: '18px',
    padding: '10px',
    textAlign: 'center'
  },
  input: {
    display: 'block',
    outline: 'none',
    padding: '10px',
    margin: '10px',
    width: 'calc(100% - 20px)',
    fontWeight: 100,
    fontSize: '16px'
  },
  logo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    color: 'white',
    fontSize: '18px'
  }
};

export default connect()(RegisterPage);