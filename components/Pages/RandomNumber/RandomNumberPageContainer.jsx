import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { withTranslation } from '../../../i18n';
import RandomNumberPage from './RandomNumberPage.jsx';
import RandomNumberQuickPage from './RandomNumberQuickPage.jsx';
import withTracking from '../../../hocs/withTracking.jsx';
import { toss, publish } from '../../../utils/api';

const URL_SLUG = 'number';

const getInitialValues = (previousDraw, t) => {
  const dateScheduled = new Date();
  dateScheduled.setHours(dateScheduled.getHours() + 1);
  const initialValues = {
    title: t('field_default_title'),
    description: '',
    rangeMin: previousDraw?.rangeMin || '1',
    rangeMax: previousDraw?.rangeMax || '10',
    numberOfResults: previousDraw?.numberOfResults || '1',
    allowRepeated: previousDraw?.allowRepeated || false,
    dateScheduled,
  };
  return initialValues;
};
const getInitialPrivateId = previousDraw => previousDraw?.privateId;
const getInitialQuickResult = previousDraw => previousDraw?.lastResult;
const initialLoadingRequest = false;
const initialApiError = false;

const RandomNumberPageContainer = props => {
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
      urlSlug: URL_SLUG,
      track,
      setLoadingRequest,
      setAPIError,
      setQuickResult,
    });
  };

  const handlePublish = () => {
    publish({
      values,
      urlSlug: URL_SLUG,
      track,
      setLoadingRequest,
      setAPIError,
    });
  };

  const handleCheckErrorsInConfiguration = () => {
    const rangeMin = parseInt(values.rangeMin, 10);
    const rangeMax = parseInt(values.rangeMax, 10);
    const numberOfResults = parseInt(values.numberOfResults, 10);
    if (rangeMin >= rangeMax) {
      return t('error_form_invalid_ranges', {
        min: values.rangeMin,
        max: values.rangeMax,
      });
    }
    if (!values.allowRepeated && numberOfResults > rangeMax - rangeMin) {
      return t('error_form_range_not_big_enough');
    }
    return undefined;
  };

  return isPublic ? (
    <RandomNumberPage
      apiError={APIError}
      loadingRequest={loadingRequest}
      values={values}
      onFieldChange={onFieldChange}
      handlePublish={handlePublish}
      handleCheckErrorsInConfiguration={handleCheckErrorsInConfiguration}
    />
  ) : (
    <RandomNumberQuickPage
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

RandomNumberPageContainer.propTypes = {
  draw: PropTypes.shape({
    privateId: PropTypes.string.isRequired,
    rangeMax: PropTypes.string.isRequired,
    rangeMin: PropTypes.string.isRequired,
    numberOfResults: PropTypes.string.isRequired,
    allowRepeated: PropTypes.bool.isRequired,
    quickResult: PropTypes.shape(),
  }),
  track: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

RandomNumberPageContainer.defaultProps = {
  draw: null,
};

export default withTracking(withTranslation('DrawNumber')(RandomNumberPageContainer));
