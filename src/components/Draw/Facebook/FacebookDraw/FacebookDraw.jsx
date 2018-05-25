import React, { Fragment } from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
// import { FB, Facebook, FacebookApiException } from 'fb';

import DrawPanel from '../../../DrawPanel/DrawPanel';
import SectionPanel from '../../../SectionPanel/SectionPanel';
import MultiValueInput from '../../../MultiValueInput/MultiValueInput';
import MultiValueDisplay from '../../../MultiValueDisplay/MultiValueDisplay';

const FacebookDraw = props => {
  console.log('asd');

  const { values, isLoggedInFB, ownedPages, onGetLikes, onFieldChange, handlePublish, t } = props;

  return (
    <Grid container>
      <Helmet>
        <title>{t('facebook_draw_html_title')}</title>
      </Helmet>
      <Grid item xs={6}>
        <DrawPanel>
          <Grid item sm={12}>
            <SectionPanel>
              {isLoggedInFB ? (
                <Paper>
                  You are logged in. These are the pages were we got access:
                  <ul>{ownedPages.map(page => <li>{page.pageName}</li>)}</ul>
                </Paper>
              ) : (
                <Fragment>
                  <Typography variant="body1" gutterBottom>
                    Login with facebook so we can automatically get the participants from the people
                    who liked a particular post or photo you published
                  </Typography>
                  <div className={}>
                    <div
                      className="fb-login-button"
                      data-max-rows="1"
                      data-size="large"
                      data-button-type="continue_with"
                      data-show-faces="false"
                      data-auto-logout-link="false"
                      data-use-continue-as="false"
                      data-scope="manage_pages"
                    />
                  </div>
          
                </Fragment>
              )}
            </SectionPanel>
            <SectionPanel>
              Now paste here the link to the post you want to check
              <TextField
                label={t('post_or_photo_url')}
                margin="normal"
                onChange={e => onFieldChange('url', e.target.value)}
                value={values.url}
                type="text"
                fullWidth
                disabled={!isLoggedInFB}
              />
              <Button
                variant="raised"
                color="primary"
                onClick={onGetLikes}
                disabled={!isLoggedInFB}
              >
                {t('check_participants')}
              </Button>
            </SectionPanel>
            <SectionPanel>
              <MultiValueDisplay
                name="participants"
                label={props.t('participants')}
                values={values.participants}
                placeholder="David"
              />
              <TextField
                label={props.t('number_of_winners')}
                placeholder="1"
                margin="normal"
                onChange={e => onFieldChange('numberOfWinners', e.target.value)}
                value={values.numberOfWinners}
                type="number"
              />
            </SectionPanel>
            <div>
              {/* TODO do stuff here about inmediate publish or scheduled draw */}
              <Button variant="raised" color="primary" onClick={handlePublish}>
                {props.t('publish_draw')}
              </Button>
            </div>
          </Grid>
        </DrawPanel>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={16} direction="row" alignItems="center">
          <Grid item xs={10}>
            <Paper>{t('facebook_draw_seo_description')}</Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

FacebookDraw.propTypes = {
  values: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string.isRequired,
    participants: PropTypes.arrayOf(PropTypes.string),
    prizes: PropTypes.arrayOf(PropTypes.string),
    numberOfWinners: PropTypes.number,
    dateScheduled: PropTypes.string,
  }).isRequired,
  isLoggedInFB: PropTypes.bool,
  ownedPages: PropTypes.arrayOf(
    PropTypes.shape({
      pageName: PropTypes.string.isRequired,
      accessToken: PropTypes.string.isRequired,
    }),
  ),
  t: PropTypes.func.isRequired,
  onGetLikes: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  handlePublish: PropTypes.func.isRequired,
};

FacebookDraw.defaultProps = {
  isLoggedInFB: false,
  ownedPages: [],
};

export default translate('FacebookDraw')(FacebookDraw);
