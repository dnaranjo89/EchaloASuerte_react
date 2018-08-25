import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { RaffleApi } from 'echaloasuerte-js-sdk';
import PublishedRafflePage from './PublishedRafflePage';

const raffleApi = new RaffleApi();

class PublishedRafflePageContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      participants: [],
      numberOfWinners: 1,
      prizes: [],
      result: null,
      isOwner: false,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const drawId = this.props.match.params.drawId;
    const draw = await raffleApi.raffleRead(drawId);
    const { private_id: privateId, title, description, participants, prizes } = draw;

    let result;
    if (draw.results.length) {
      const lastToss = draw.results[0];
      if (lastToss.value) {
        result = lastToss;
      } else {
        result = lastToss;
      }
    }
    this.setState({
      title,
      description,
      participants: participants.map(participant => participant.name),
      prizes: prizes.map(prize => prize.name),
      result,
      isOwner: Boolean(privateId),
    });
  }

  render() {
    const {
      title,
      description,
      participants,
      numberOfWinners,
      prizes,
      result,
      isOwner,
    } = this.state;
    return (
      <PublishedRafflePage
        title={title}
        description={description}
        participants={participants}
        numberOfWinners={numberOfWinners}
        result={result}
        prizes={prizes}
        onToss={this.onToss}
        isOwner={isOwner}
        onFieldChange={this.onFieldChange}
      />
    );
  }
}

PublishedRafflePageContainer.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default PublishedRafflePageContainer;
