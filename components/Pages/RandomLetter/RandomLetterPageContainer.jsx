import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { withTranslation } from '../../../i18n';
import RandomLetterPage from './RandomLetterPage.jsx';
import RandomLetterQuickPage from './RandomLetterQuickPage.jsx';
import withTracking from '../../../hocs/withTracking.jsx';
import { toss, publish } from '../../../utils/api';
import { URL_SLUG_LETTER } from '../../../constants/urlSlugs';

const urlSlug = URL_SLUG_LETTER;

const getInitialValues = (previousDraw, t) => {
  const dateScheduled = new Date();
  dateScheduled.setHours(dateScheduled.getHours() + 1);
  const initialValues = {
    title: t('field_default_title'),
    description: '',
    numberOfResults: previousDraw?.values.numberOfResults || '1',
    allowRepeated: previousDraw?.values.allowRepeated || false,
    dateScheduled,
  };
  return initialValues;
};
const getInitialPrivateId = previousDraw => previousDraw?.privateId;
const getInitialQuickResult = previousDraw => previousDraw?.results[0];
const initialLoadingRequest = false;
const initialApiError = false;

const RandomLetterPageContainer = props => {
  const { draw: previousDraw, track, t } = props;

  const [privateId, setPrivateId] = useState(getInitialPrivateId(previousDraw));
  const [values, setValues] = useState(getInitialValues(previousDraw, t));
  const [quickResult, setQuickResult] = useState(getInitialQuickResult(previousDraw));
  const [APIError, setAPIError] = useState(initialApiError);
  const [loadingRequest, setLoadingRequest] = useState(initialLoadingRequest);
  const router = useRouter();

  const isPublic = router.asPath.includes('public');

  useEffect(() => {
    setQuickResult(getInitialQuickResult(previousDraw));
    setPrivateId(getInitialPrivateId(previousDraw));
    setLoadingRequest(initialLoadingRequest);
    setAPIError(initialApiError);
    setValues(getInitialValues(previousDraw, t));
  }, [previousDraw, t]);

  const onFieldChange = (fieldName, value) => {
    setQuickResult(null);
    setPrivateId(null);
    setValues(previousState => ({
      ...previousState,
      [fieldName]: value,
    }));
  };

  const handleToss = () => {
    toss({
      values,
      privateId,
      urlSlug,
      track,
      setLoadingRequest,
      setAPIError,
      setQuickResult,
    });
  };

  const handlePublish = () => {
    publish({
      values,
      urlSlug,
      track,
      setLoadingRequest,
      setAPIError,
    });
  };

  const handleCheckErrorsInConfiguration = () => undefined;

  return isPublic ? (
    <RandomLetterPage
      apiError={APIError}
      loadingRequest={loadingRequest}
      values={values}
      onFieldChange={onFieldChange}
      handlePublish={handlePublish}
      handleCheckErrorsInConfiguration={handleCheckErrorsInConfiguration}
    />
  ) : (
    <RandomLetterQuickPage
      apiError={APIError}
      loadingRequest={loadingRequest}
      values={values}
      quickResult={quickResult}
      onFieldChange={onFieldChange}
      handleToss={handleToss}
      handleCheckErrorsInConfiguration={handleCheckErrorsInConfiguration}
    />
  );
};

RandomLetterPageContainer.propTypes = {
  draw: PropTypes.shape({
    values: PropTypes.shape({
      rangeMax: PropTypes.string.isRequired,
      rangeMin: PropTypes.string.isRequired,
      numberOfResults: PropTypes.string.isRequired,
      allowRepeated: PropTypes.bool.isRequired,
    }),
    privateId: PropTypes.string.isRequired,
    results: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  track: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

RandomLetterPageContainer.defaultProps = {
  draw: null,
};

export default withTracking(withTranslation('DrawLetter')(RandomLetterPageContainer));