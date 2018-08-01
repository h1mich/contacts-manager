import keycode from 'keycode';
import React from 'react';
import PropTypes from 'prop-types';

export default class CMModal extends React.Component {
  componentDidMount() {
    // There has to be a ref to the listener in order for it to be removed
    this.listener = event => (event.which == keycode.codes['esc'] ? this.props.onClose() : null);
    document.addEventListener('keydown', this.listener);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.listener);
  }

  render() {
    return (
      <div style={styles.root} onClick={event => this.onBackdropClick(event)}>
        <div style={styles.container}>{this.props.children}</div>
      </div>
    );
  }

  onBackdropClick(event) {
    // Call onClose only if the click happened on the backdrop
    // i.e. ignore clicks which happen on the content.
    if (event.target == event.currentTarget) this.props.onClose();
  }
}

CMModal.propTypes = {
  children: PropTypes.element.isRequired,
  onClose: PropTypes.func.isRequired
};

const styles = {
  root: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'rgba(0, 0, 0, 0.5)'
  },
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)'
  }
};
