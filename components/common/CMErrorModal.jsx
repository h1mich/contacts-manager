import React from 'react';
import CMModal from './CMModal';
import PropTypes from 'prop-types';

// The modal which should be used throughout the app
// to ensure the design consistency.
export default class CMErrorModal extends React.Component {
  render() {
    return (
      <CMModal onClose={ this.props.onClose }>
        <div style={ styles.root }>
          { this.props.children }
          <div style={ styles.cross } onClick={ this.props.onClose } />
        </div>
      </CMModal>
    );
  }
}

CMErrorModal.propTypes = {
  children: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

const styles = {
  root: {
    background: 'red',
    color: 'white',
    padding: '20px 60px 20px 20px',
    border: '1px solid rgb(15, 33, 76)',
    fontSize: '20px',
    position: 'relative'
  },
  cross: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    height: '25px',
    width: '25px',
    backgroundImage: 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDMxLjExMiAzMS4xMTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMxLjExMiAzMS4xMTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPjxwb2x5Z29uIHBvaW50cz0iMzEuMTEyLDEuNDE0IDI5LjY5OCwwIDE1LjU1NiwxNC4xNDIgMS40MTQsMCAwLDEuNDE0IDE0LjE0MiwxNS41NTYgMCwyOS42OTggMS40MTQsMzEuMTEyIDE1LjU1NiwxNi45NyAgIDI5LjY5OCwzMS4xMTIgMzEuMTEyLDI5LjY5OCAxNi45NywxNS41NTYgIiBmaWxsPSIjRkZGRkZGIi8+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '25px',
    cursor: 'pointer'
  }
};
