import { environment } from '../utils';
import { TYPE_APP_ENV_TEST, TYPE_APP_ENV_LOCAL } from '../constants/environment';

const MINIMUM_TIME = 500;
const VARIABLE_TIME = 400;

/**
 * This function delays the execution of `request` by a random amount of milliseconds
 * when the elapsed time from `tsStart` until now was shorter than a minimum.
 * @param {function} request Function to run
 * @param {function} tsStart Timestamp of the moment when something starts executing
 * @returns {void}
 */
const throttle = async (request, tsStart) => {
  const tsEnd = new Date().getTime();
  const randomDelay = Math.floor(Math.random() * VARIABLE_TIME + MINIMUM_TIME);
  const tsDelta = tsEnd - tsStart;
  if ([TYPE_APP_ENV_TEST, TYPE_APP_ENV_LOCAL].includes(environment)) {
    // Do not throttle requests in integration tests
    request();
    console.log('request', request);
  } else {
    setTimeout(request, randomDelay - tsDelta);
  }
};

export default throttle;
