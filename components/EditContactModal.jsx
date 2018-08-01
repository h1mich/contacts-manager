import keycode from 'keycode';
import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CMButton, CMModal, CMInput } from './common';
import config from '../config.json';

class EditContactModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.contact.name,
      phone: this.props.contact.phone,
      comment: this.props.contact.comment,
      contactNotFound: false
    };
  }

  render() {
    return (
      <CMModal onClose={ this.props.onClose }>
        <div style={ styles.root }>
          <div style={ styles.header }>
            EDIT CONTACT
            <div style={ styles.cross } onClick={ () => this.props.onClose(false) }/>
          </div>
          <div>
            <CMInput value={ this.state.name }
                     isValid={ this.isNameValid() }
                     autoFocus="autofocus"
                     onChange={ event => this.setState({ name: event.target.value }) }
                     onKeyDown={ event => this.maybeSubmit(event) }
                     placeholder="Name"
                     type="text"/>

            <CMInput value={ this.state.phone }
                     isValid={ this.isPhoneValid() }
                     onChange={ event => this.setState({ phone: event.target.value }) }
                     onKeyDown={ event => this.maybeSubmit(event) }
                     placeholder="Phone"
                     type="text"/>

            <CMInput value={ this.state.comment }
                     isValid={ true }
                     onChange={ event => this.setState({ comment: event.target.value }) }
                     onKeyDown={ event => this.maybeSubmit(event) }
                     placeholder="Comment (optional)"
                     type="text"/>

            <div style={ styles.buttons }>
              <CMButton color="blue"
                        style={ { float: 'left', width: 'calc(50% - 15px)', marginRight: '5px' } }
                        onClick={ () => this.updateContact() }
                        disabled={ !this.isNameValid() || !this.isPhoneValid() }>
                SAVE CONTACT
              </CMButton>

              <CMButton color="red"
                        style={ { float: 'left', width: 'calc(50% - 15px)', marginLeft: '5px' } }
                        onClick={ () => this.deleteContact() }
                        disabled={ false }>
                DELETE CONTACT
              </CMButton>
            </div>
          </div>
        </div>
      </CMModal>
    );
  }

  deleteContact() {
    this.props.dispatch({ type: 'LOADING', value: true });
    axios.delete('/api/contact', {
      data: {
        id: this.props.contact.id,
        username: this.props.credentials.username,
        password: this.props.credentials.password
      }
    }).then(response => {
      if (response.data == 'contact-not-found') this.props.onClose(true);
      else this.props.onClose(false);

      // If the contact was found then it should be deleted
      // as well as if the contact wasn't found it is deleted.
      this.props.dispatch({ type: 'DELETE_CONTACT', id: this.props.contact.id });
    }).catch(console.error);
  }

  updateContact() {
    this.props.dispatch({ type: 'LOADING', value: true });
    axios.put('/api/contact', {
      id: this.props.contact.id,
      name: this.state.name,
      phone: this.state.phone,
      comment: this.state.comment,
      username: this.props.credentials.username,
      password: this.props.credentials.password
    }).then(response => {
      if (response.data == 'contact-not-found') {
        this.props.onClose(true);
        this.props.dispatch({ type: 'DELETE_CONTACT', id: this.props.contact.id });
      } else {
        this.props.dispatch({ type: 'EDIT_CONTACT', contact: response.data });
        this.props.onClose(false);
      }
    }).catch(console.error);
  }

  maybeSubmit(event) {
    if (event.which == keycode.codes['enter'] && this.isNameValid() && this.isPhoneValid()) this.updateContact();
  }

  isNameValid() {
    return new RegExp(config.nameFormat).test(this.state.name);
  }

  isPhoneValid() {
    return new RegExp(config.phoneFormat).test(this.state.phone);
  }
}

EditContactModal.propTypes = {
  credentials: PropTypes.object,
  contact: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

const styles = {
  root: {
    width: '400px',
    background: 'white',
    border: '1px solid rgb(15, 33, 76)'
  },
  header: {
    background: 'rgb(15, 33, 76)',
    color: 'white',
    height: '40px',
    fontSize: '20px',
    padding: '10px',
    position: 'relative'
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
  },
  buttons: {
    overflow: 'hidden'
  }
};

function mapStateToProps(state) {
  return {
    credentials: state.credentials
  };
}

export default connect(mapStateToProps)(EditContactModal);
