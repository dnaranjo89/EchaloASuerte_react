import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import FacebookLoginDraw from './FacebookLoginDraw';

class FacebookLoginDrawContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        title: '',
        description: '',
        prizes: [],
        numberOfWinners: 1,
        winners: [],
        dateScheduled: null,
        whenToToss: 'manual',
      },
    };
  }

  onFieldChange = (fieldName, value) => {
    this.setState(previousState => ({
      values: {
        ...previousState.values,
        ...{
          [fieldName]: value,
        },
      },
    }));
  };

  handlePublish = async () => {
    this.props.history.push(`${this.props.location.pathname}/3`);
  };

  render() {
    return (
      <div>
        <FacebookLoginDraw
          values={this.state.values}
          onFieldChange={this.onFieldChange}
          handlePublish={this.handlePublish}
        />
      </div>
    );
  }
}

FacebookLoginDrawContainer.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};

export default FacebookLoginDrawContainer;
