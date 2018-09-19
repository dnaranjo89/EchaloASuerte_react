import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { translate } from 'react-i18next';
import classnames from 'classnames/bind';
import STYLES from './RafflePage.scss';
import Page from '../../Page/Page';
import SectionPanel from '../../SectionPanel/SectionPanel';
import withFormValidation from '../../withValidation/withFormValidation';
import withFieldValidation from '../../withValidation/withFieldValidation';
import MultiValueInput from '../../MultiValueInput/MultiValueInput';
import WizardForm from '../../WizardForm/WizardForm';
import GeneralDetailsSection from '../../CommonSections/GeneralDetailsSection';
import WhenToTossSection from '../../CommonSections/WhenToTossSection';

const c = classnames.bind(STYLES);

const ValidatedMultiValueInput = withFieldValidation(MultiValueInput);

const ParticipantsSection = ({ participants, onFieldChange, t }) => (
  <SectionPanel title={t('who_will_participate')}>
    <ValidatedMultiValueInput
      name="participants"
      label={t('participants')}
      labelDisplayList={t('list_of_participants')}
      value={participants}
      placeholder="David, María, ..."
      onChange={e => {
        onFieldChange('participants', e.target.value);
      }}
      messageEmpty={t('you_havent_add_any_participants')}
      fullWidth
      data-component="Raffle__participants-field"
      inputProps={{ 'data-component': 'Raffle__participants-field-input' }}
      validators={[{ rule: 'required' }]}
    />
  </SectionPanel>
);
ParticipantsSection.propTypes = {
  participants: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

const PrizesSection = ({ prizes, onFieldChange, t }) => (
  <SectionPanel title={t('detail_about_winners')}>
    <ValidatedMultiValueInput
      name="prizes"
      label={t('prizes')}
      labelDisplayList={t('list_of_prizes')}
      placeholder="PS4"
      messageEmpty={t('no_prizes_selected')}
      value={prizes}
      onChange={e => onFieldChange('prizes', e.target.value)}
      data-component="Raffle__prizes-field"
      inputProps={{ 'data-component': 'Raffle__prizes-field-input' }}
      validators={[{ rule: 'required' }]}
    />
  </SectionPanel>
);
PrizesSection.propTypes = {
  prizes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

const GeneralDetailsForm = withFormValidation(GeneralDetailsSection);
const ParticipantsForm = withFormValidation(ParticipantsSection);
const PrizesForm = withFormValidation(PrizesSection);
const WhenToTossForm = withFormValidation(WhenToTossSection);

const RafflePage = props => {
  const { values, onFieldChange, handlePublish, t } = props;

  const steps = [
    {
      label: t('step_label_general_details'),
      render: wizardProps => (
        <GeneralDetailsForm
          title={values.title}
          description={values.description}
          onFieldChange={props.onFieldChange}
          t={props.t}
          {...wizardProps}
        />
      ),
    },
    {
      label: t('step_label_participants'),
      render: wizardProps => (
        <ParticipantsForm
          participants={values.participants}
          onFieldChange={props.onFieldChange}
          t={props.t}
          {...wizardProps}
        />
      ),
    },
    {
      label: t('step_prizes'),
      render: wizardProps => (
        <PrizesForm
          numberOfWinners={values.numberOfWinners}
          prizes={values.prizes}
          onFieldChange={onFieldChange}
          t={t}
          {...wizardProps}
        />
      ),
    },
    {
      label: t('step_label_when_to_toss'),
      render: wizardProps => (
        <WhenToTossForm
          dateScheduled={values.dateScheduled}
          onFieldChange={onFieldChange}
          checkErrors={() => undefined}
          t={t}
          {...wizardProps}
        />
      ),
    },
  ];

  return (
    <Page htmlTitle={t('raffle_html_title')} className={c('RafflePage')}>
      <Typography color="primary" variant="display1">
        {t('raffle_default_title')}
      </Typography>
      <WizardForm
        steps={steps}
        // initialStep={1}
        onSubmit={handlePublish}
        submitButtonLabel={t('publish_raffle')}
      />
    </Page>
  );
};

RafflePage.propTypes = {
  values: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    participants: PropTypes.arrayOf(PropTypes.string).isRequired,
    prizes: PropTypes.arrayOf(PropTypes.string).isRequired,
    numberOfWinners: PropTypes.number.isRequired,
    winners: PropTypes.arrayOf(PropTypes.string).isRequired,
    dateScheduled: PropTypes.instanceOf(Date),
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  handlePublish: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default translate('RafflePage')(RafflePage);
