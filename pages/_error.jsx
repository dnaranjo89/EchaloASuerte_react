import React from 'react';
import Error from 'next/error';
import * as Sentry from '@sentry/node';

import ErrorPage from '../components/Pages/ErrorPage/ErrorPage.jsx';

// eslint-disable-next-line react/prop-types
const MyError = ({ statusCode, hasGetInitialPropsRun, err }) => {
  if (!hasGetInitialPropsRun && err) {
    /**
     * getInitialProps is not called in case of
     * https://github.com/zeit/next.js/issues/8592. As a workaround, we pass
     * err via _app.js so it can be captured
     */
    Sentry.captureException(err);
  }
  // TO IMPROVE
  // We are handling 404 errors here as well. We would like to use the pages/404.js page but
  // Nextjs generates that page statically on build, so there is currently no way to translate that page if it's static
  // (the 404 page cannot have getInitialProps)
  return <ErrorPage statusCode={statusCode} />;
};

MyError.getInitialProps = async ({ res, err, asPath }) => {
  const baseInitialProps = {
    namespacesRequired: ['Common'],
  };

  const errorInitialProps = await Error.getInitialProps({ res, err });

  const initialProps = {
    ...baseInitialProps,
    ...errorInitialProps,
  };

  /**
   * Workaround for https://github.com/zeit/next.js/issues/8592, mark when
   * getInitialProps has run
   */
  errorInitialProps.hasGetInitialPropsRun = true;

  if (res) {
    /**
     * Running on the server, the response object is available.
     *
     * Next.js will pass an err on the server if a page's `getInitialProps`
     * threw or returned a Promise that rejected
     */

    if (res.statusCode === 404) {
      // Sentry.withScope(scope => {
      // Uncomment the following code if we want to log 404s
      //   scope.setExtra('page', asPath);
      //   scope.setTag('pageNotFound', asPath);
      //   Sentry.captureMessage('Page not found');
      // });
      return { ...initialProps, statusCode: 404 };
    }

    if (err) {
      Sentry.captureException(err);

      return initialProps;
    }
  } else {
    /**
     * Running on the client (browser).
     *
     * Next.js will provide an err if:
     * - a page's `getInitialProps` threw or returned a Promise that rejected
     * - an exception was thrown somewhere in the React lifecycle (render,
     *   componentDidMount, etc) that was caught by Next.js's React Error
     *   Boundary. Read more about what types of exceptions are caught by Error
     *   Boundaries: https://reactjs.org/docs/error-boundaries.html
     */

    // eslint-disable-next-line no-lonely-if
    if (err) {
      Sentry.captureException(err);

      return initialProps;
    }
  }
  /**
   * If this point is reached, getInitialProps was called without any
   * information about what the error might be. This is unexpected and may
   * indicate a bug introduced in Next.js, so record it in Sentry
   */
  Sentry.captureException(new Error(`_error.js getInitialProps missing data at path: ${asPath}`));

  return initialProps;
};

export default MyError;
