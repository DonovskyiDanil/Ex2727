import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import RegistrationFooter from '../../components/Layout/RegistrationFooter';
import AuthHeader from '../../components/Layout/AuthHeader';
import ChatContainer from '../../components/Chat/ChatComponents/ChatContainer/ChatContainer';
import Spinner from '../../components/Spinner/Spinner';
import CONSTANTS from '../../constants';
import { getUser } from '../../store/slices/userSlice';
import styles from './Layout.module.sass';

const Layout = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { data: user, isFetching, error } = useSelector((state) => state.userStore);
  const token = localStorage.getItem(CONSTANTS.ACCESS_TOKEN);
  const hasToken = Boolean(token && token !== 'null' && token !== 'undefined');

  useEffect(() => {
    if (hasToken && !user && !isFetching && !error) {
      dispatch(getUser());
    }
  }, [dispatch, error, hasToken, isFetching, user]);

  if (hasToken && !user) {
    return error ? (
      <div role="alert">Unable to verify your session. Refresh the page or sign in again.</div>
    ) : <Spinner />;
  }

  const isModeratorPage = pathname === '/offersReview' || pathname === '/moderator';
  const isModeratorProfile = pathname === '/account';
  const isModeratorHome = pathname === '/';

  if (
    user?.role === CONSTANTS.MODERATOR &&
    !isModeratorPage &&
    !isModeratorProfile &&
    !isModeratorHome
  ) {
    return <Navigate to="/offersReview" replace />;
  }

  if (user?.role === CONSTANTS.MODERATOR) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.content}>
          <Outlet />
        </div>
        <Footer />
      </div>
    );
  }

  const isRegisterPathname = pathname === '/registration';
  const isAuthPathname = pathname === '/login' || isRegisterPathname;

  return (
    <div className={styles.container}>
      {isAuthPathname && <AuthHeader />}
      {!isAuthPathname && <Header />}
      <div className={styles.content}>
        <Outlet />
      </div>
      {!isAuthPathname && <Footer />}
      {isRegisterPathname && <RegistrationFooter />}
      {/* Чат авторизованного пользователя должен жить только внутри основного
          приложения (этот Layout), а не на публичных маркетинговых страницах
          типа /how-it-works или /events — раньше он монтировался глобально
          в App.js и вылезал везде, где в localStorage был accessToken. */}
      {!isAuthPathname && hasToken && <ChatContainer />}
    </div>
  );
};

export default Layout;
