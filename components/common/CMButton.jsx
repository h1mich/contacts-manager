import React from 'react';
import PropTypes from 'prop-types';

export default class CMButton extends React.Component {
  render() {
    const { color, onClick, disabled, children, style } = this.props;

    return disabled ?
      <div style={ {
        ...styles.button,
        ...styles.disabled,
        ...style
      } }>
        <span style={ styles.label }>{ children }</span>
      </div> :
      <div className={ color == 'blue' ? 'blue-hover' : 'red-hover' }
           onClick={ onClick }
           style={ {
             ...styles.button,
             background: color == 'blue' ? 'rgb(15, 33, 76)' : 'red',
             ...style
           } }>
        <span style={ styles.label }>{ children }</span>
      </div>;
  }
}

CMButton.propTypes = {
  color: PropTypes.oneOf(['blue', 'red']).isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  children: PropTypes.string.isRequired,
  style: PropTypes.object
};

const styles = {
  button: {
    color: 'white',
    cursor: 'pointer',
    margin: '0 10px 10px 10px',
    height: '40px',
    position: 'relative'
  },
  disabled: {
    background: 'gray',
    cursor: 'default'
  },
  label: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-40%)',
    textAlign: 'center',
    width: '100%'
  }
};