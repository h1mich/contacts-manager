import axios from 'axios';
import keycode from 'keycode';
import React from 'react';
import { connect } from 'react-redux';
import { CMButton, CMModal, CMInput } from './common';
import PropTypes from 'prop-types';
import config from '../config.json';

class NewContactModal extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      phone: '',
      comment: ''
    };
  }

  render() {
    return (
      <CMModal onClose={ this.props.onClose }>
        <div style={ styles.root }>
          <div style={ styles.header }>
            NEW CONTACT
            <div style={ styles.cross } onClick={ this.props.onClose }/>
          </div>
          <div>
            <CMInput isValid={ this.isNameValid() }
                     value={ this.state.name }
                     autoFocus="autofocus"
                     onChange={ event => this.setState({ name: event.target.value }) }
                     onKeyDown={ event => this.maybeSubmit(event) }
                     placeholder="Name"
                     type="text"/>

            <CMInput isValid={ this.isPhoneValid() }
                     value={ this.state.phone }
                     onChange={ event => this.setState({ phone: event.target.value }) }
                     onKeyDown={ event => this.maybeSubmit(event) }
                     placeholder="Phone"
                     type="text"/>

            <CMInput isValid={ true }
                     value={ this.state.comment }
                     onChange={ event => this.setState({ comment: event.target.value }) }
                     onKeyDown={ event => this.maybeSubmit(event) }
                     placeholder="Comment (optional)"
                     type="text"/>

            <CMButton color="blue"
                      onClick={ () => this.submit() }
                      disabled={ !this.isPhoneValid() || !this.isNameValid() }>
              NEW CONTACT
            </CMButton>
          </div>
        </div>
      </CMModal>
    );
  }

  submit() {
    this.props.dispatch({ type: 'LOADING', value: true });
    axios.post('/api/contact', {
      name: this.state.name,
      phone: this.state.phone,
      comment: this.state.comment,
      username: this.props.credentials.username,
      password: this.props.credentials.password
    }).then(response => {
      this.props.dispatch({ type: 'ADD_CONTACT', contact: response.data });
      this.props.onClose();
    }).catch(console.error);
  }

  maybeSubmit(event) {
    if (event.which == keycode.codes['enter'] && this.isPhoneValid() && this.isNameValid()) this.submit();
  }

  isPhoneValid() {
    return new RegExp(config.phoneFormat).test(this.state.phone);
  }

  isNameValid() {
    return new RegExp(config.nameFormat).test(this.state.name);
  }
}

NewContactModal.propTypes = {
  credentials: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    credentials: state.credentials
  };
}

const styles = {
  root: {
    width: '400px',
    background: 'white',
    border: '1px solid rgb(15, 33, 76)'
  },
  header: {
    background: 'rgb(15, 33, 76)',
    height: '40px',
    position: 'relative',
    fontSize: '20px',
    color: 'white',
    padding: '10px'
  },
  cross: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    height: '20px',
    width: '20px',
    backgroundImage: 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDMxLjExMiAzMS4xMTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMxLjExMiAzMS4xMTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPjxwb2x5Z29uIHBvaW50cz0iMzEuMTEyLDEuNDE0IDI5LjY5OCwwIDE1LjU1NiwxNC4xNDIgMS40MTQsMCAwLDEuNDE0IDE0LjE0MiwxNS41NTYgMCwyOS42OTggMS40MTQsMzEuMTEyIDE1LjU1NiwxNi45NyAgIDI5LjY5OCwzMS4xMTIgMzEuMTEyLDI5LjY5OCAxNi45NywxNS41NTYgIiBmaWxsPSIjRkZGRkZGIi8+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    cursor: 'pointer'
  }
};

export default connect(mapStateToProps)(NewContactModal);