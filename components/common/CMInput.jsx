import React from 'react';
import PropTypes from 'prop-types';

// So far this reusable component has little reusable properties
// but in the perspective this amount of properties might grow tremendously.
export default class CMInput extends React.Component {
  render() {
    // The property "isValid" shouldn't get to the real DOM element.
    const { isValid, ...others } = this.props;

    const inputStyles = {
      ...styles.input,
      border: `2px solid ${isValid ? 'rgb(15, 33, 76)' : 'rgb(255, 25, 25)'}`
    };

    return (
      <input { ...others } style={ inputStyles }/>
    );
  }
}

CMInput.propTypes = {
  isValid: PropTypes.bool.isRequired
};

const styles = {
  input: {
    display: 'block',
    outline: 'none',
    padding: '10px',
    margin: '10px',
    width: 'calc(100% - 20px)',
    fontWeight: '100',
    fontSize: '16px'
  }
};