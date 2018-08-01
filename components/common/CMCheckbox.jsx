import React from 'react';
import PropTypes from 'prop-types';

export default class CMCheckbox extends React.Component {
  render() {
    const { onChange, value, children } = this.props;

    return (
      <div className="light-white-hover"
           onClick={ onChange }
           style={ styles.field }>
        <input style={ styles.input }
               checked={ value }
               onChange={ () => void('') /* prevents meaningless react warning */ }
               type="checkbox"/>
        <div style={ styles.label }>{ children }</div>
      </div>
    );
  }
}

CMCheckbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
  children: PropTypes.string.isRequired
};

const styles = {
  field: {
    position: 'relative',
    margin: '0 10px 10px 10px',
    cursor: 'pointer',
    height: '40px',
    border: '2px solid rgb(15, 33, 76)'
  },
  input: {
    position: 'absolute',
    top: '9px',
    left: '10px'
  },
  label: {
    position: 'absolute',
    top: '10.5px',
    left: '35px'
  }
};