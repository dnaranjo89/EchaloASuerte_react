import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';

const GenerateResultsButton = props => (
  <Button color="primary" onClick={props.handleToss}>
    {props.label}
  </Button>
);

GenerateResultsButton.propTypes = {
  label: PropTypes.string.isRequired,
  handleToss: PropTypes.func.isRequired,
};

export default GenerateResultsButton;
