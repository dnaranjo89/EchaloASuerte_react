import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames/bind';
import STYLES from './Advert.module.scss';

const c = classnames.bind(STYLES);

const Advert = () => {
  useEffect(() => {
    if (window) (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);
  const isMobile = useSelector(state => state.userRequest.isMobile);
  console.log('isMobile', isMobile);

  const style = { display: 'inline-block', width: '728px', height: '90px' };

  return (
    <div className={c('Advert')}>
      <ins
        className={c('adsbygoogle')}
        style={style}
        data-ad-client="ca-pub-1409219619115807"
        data-ad-slot={isMobile ? '1221986757' : '2400047490'}
      />
    </div>
  );
};

export default Advert;
