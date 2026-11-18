import React, { Component } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
import styles from './Footer.module.sass';
import CONSTANTS from '../../constants';

class Footer extends Component {
  topFooterItemsRender = item => (
    <div key={item.title}>
      <h4>{item.title}</h4>
      {item.items.map(i => (
<<<<<<< HEAD
        i.toLowerCase().includes('how it works') ? (
          <Link key={i} to="/how-it-works">
            {i}
          </Link>
        ) : (
          <a key={i} href="https://google.com">
            {i}
          </a>
        )
=======
        <a key={i} href='https://google.com'>
          {i}
        </a>
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
      ))}
    </div>
  );

  topFooterRender () {
    return CONSTANTS.FooterItems.map(item => this.topFooterItemsRender(item));
  }

  render () {
    return (
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div>{this.topFooterRender()}</div>
        </div>
      </div>
    );
  }
}

export default Footer;
