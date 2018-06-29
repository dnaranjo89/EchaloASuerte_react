import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import classNames from 'classnames/bind';
import STYLES from './TossButton.scss';

const c = classNames.bind(STYLES);
const TossButton = ({ label, onClick }) => (
  <div data-component={'SubmitDrawButton'} className={c('TossButton')}>
    <Button variant="raised" color="primary" onClick={onClick}>
      {label}
    </Button>
  </div>
);

TossButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TossButton;