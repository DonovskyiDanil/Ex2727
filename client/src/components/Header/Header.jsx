import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './Header.module.sass';
import CONSTANTS from '../../constants';
import { clearUserStore } from '../../store/slices/userSlice';
import { getUser } from '../../store/slices/userSlice';
import withRouter from '../../hocs/withRouter';

class Header extends React.Component {
  componentDidMount() {
    const token = localStorage.getItem('accessToken');
    // Only call getUser if we have a valid token and don't have user data yet
    if (token && token !== 'null' && token !== 'undefined' && !this.props.data) {
      this.props.getUser();
    }
  }

  logOut = () => {
    localStorage.clear();
    this.props.clearUserStore();
    this.props.navigate('/login', { replace: true });
  };

  startContests = () => {
    this.props.navigate('/startContest');
  };

  renderLoginButtons = () => {
    if (this.props.data) {
      return (
        <>
          <div className={styles.userInfo}>
            <img
              src={
                this.props.data.avatar === 'anon.png'
                  ? CONSTANTS.ANONYM_IMAGE_PATH
                  : `${CONSTANTS.publicURL}${this.props.data.avatar}`
              }
              alt="user"
            />
            <span>{`Hi, ${this.props.data.displayName}`}</span>
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
              alt="menu"
            />
            <ul>
              <li>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                  <span>View Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/account" style={{ textDecoration: 'none' }}>
                  <span>My Account</span>
                </Link>
              </li>
              <li>
                <Link
                  to="http:/www.google.com"
                  style={{ textDecoration: 'none' }}
                >
                  <span>Messages</span>
                </Link>
              </li>
              <li>
                <Link
                  to="http:/www.google.com"
                  style={{ textDecoration: 'none' }}
                >
                  <span>Affiliate Dashboard</span>
                </Link>
              </li>
              <li>
                <span onClick={this.logOut}>Logout</span>
              </li>
            </ul>
          </div>
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}email.png`}
            className={styles.emailIcon}
            alt="email"
          />
        </>
      );
    }
    return (
      <>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <span className={styles.btn}>LOGIN</span>
        </Link>
        <Link to="/registration" style={{ textDecoration: 'none' }}>
          <span className={styles.btn}>SIGN UP</span>
        </Link>
      </>
    );
  };

  render() {
    if (this.props.isFetching) {
      return null;
    }
    const { data } = this.props;

    return (
      <div className={styles.headerContainer}>
        <div className={styles.fixedHeader}>
          <span className={styles.info}>
            Squadhelp recognized as one of the Most Innovative Companies by Inc
            Magazine.
          </span>
          <a href="http://www.google.com">Read Announcement</a>
        </div>
        <div className={styles.loginSignnUpHeaders}>
          <div className={styles.numberContainer}>
            <img src={`${CONSTANTS.STATIC_IMAGES_PATH}phone.png`} alt="phone" />
            <a href="tel:(877)355-3585" className={styles.phoneNumber}>
            (877)&nbsp;355-3585
            </a>
          </div>
          <div className={styles.userButtonsContainer}>
            {this.renderLoginButtons()}
          </div>
        </div>
        <div className={styles.navContainer}>
          <Link to="/">
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}blue-logo.png`}
            className={styles.logo}
            alt="blue_logo"
          />
          </Link>
          <div className={styles.leftNav}>
            <div className={styles.nav}>
              <ul>
                <li>
                  <span>NAME IDEAS</span>
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                    alt="menu"
                  />
                  <ul>
                    <li><a href="http://www.google.com">BEAUTY</a></li>
                    <li><a href="http://www.google.com">CONSULTING</a></li>
                    <li><a href="http://www.google.com">E-COMMERCE</a></li>
                    <li><a href="http://www.google.com">FASHION & CLOTHING</a></li>
                    <li><a href="http://www.google.com">FINANCE</a></li>
                    <li><a href="http://www.google.com">REAL ESTATE</a></li>
                    <li><a href="http://www.google.com">TECH</a></li>
                    <li className={styles.last}><a href="http://www.google.com">MORE CATEGORIES</a></li>
                  </ul>
                </li>
                <li>
                  <span>CONTESTS</span>
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                    alt="menu"
                  />
                  <ul>
                    <li><Link to="/how-it-works" className={styles.navLink}>HOW IT WORKS</Link></li>
                    <li><Link to="/events" className={styles.navLink}>EVENTS</Link></li>
                    <li><a href="http://www.google.com">PRICING</a></li>
                    <li><a href="http://www.google.com">AGENCY SERVICE</a></li>
                    <li><a href="http://www.google.com">ACTIVE CONTESTS</a></li>
                    <li><a href="http://www.google.com">WINNERS</a></li>
                    <li><a href="http://www.google.com">LEADERBOARD</a></li>
                    <li className={styles.last}><a href="http://www.google.com">BECOME A CREATIVE</a></li>
                  </ul>
                </li>
                <li>
                  <span>OUR WORK</span>
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                    alt="menu"
                  />
                  <ul>
                    <li><a href="http://www.google.com">NAMES</a></li>
                    <li><a href="http://www.google.com">TAGLINES</a></li>
                    <li><a href="http://www.google.com">LOGOS</a></li>
                    <li className={styles.last}><a href="http://www.google.com">TESTIMONIALS</a></li>
                  </ul>
                </li>
                <li>
                  <span>NAMES FOR SALE</span>
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                    alt="menu"
                  />
                  <ul>
                    <li><a href="http://www.google.com">POPULAR NAMES</a></li>
                    <li><a href="http://www.google.com">SHORT NAMES</a></li>
                    <li><a href="http://www.google.com">INTRIGUING NAMES</a></li>
                    <li><a href="http://www.google.com">NAMES BY CATEGORY</a></li>
                    <li><a href="http://www.google.com">VISUAL NAME SEARCH</a></li>
                    <li className={styles.last}><a href="http://www.google.com">SELL YOUR DOMAINS</a></li>
                  </ul>
                </li>
                <li>
                  <span>BLOG</span>
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                    alt="menu"
                  />
                  <ul>
                    <li><a href="http://www.google.com">ULTIMATE NAMING GUIDE</a></li>
                    <li><a href="http://www.google.com">POETIC DEVICES IN BUSINESS NAMING</a></li>
                    <li><a href="http://www.google.com">CROWDED BAR THEORY</a></li>
                    <li className={styles.last}><a href="http://www.google.com">ALL ARTICLES</a></li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* БЛОК КНОПОК ДЕЙСТВИЯ */}
            {data && (
              <>
                {/* Кнопка для Модератора */}
                {data.role === CONSTANTS.MODERATOR && (
                  <Link to="/moderator" className={styles.startContestBtn} style={{ textDecoration: 'none' }}>
                    REVIEW OFFERS
                  </Link>
                )}

                {/* Кнопка для Клиента */}
                {data.role === CONSTANTS.CUSTOMER && (
                  <div className={styles.startContestBtn} onClick={this.startContests}>
                    START CONTEST
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => state.userStore;
const mapDispatchToProps = (dispatch) => ({
  getUser: () => dispatch(getUser()),
  clearUserStore: () => dispatch(clearUserStore()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));