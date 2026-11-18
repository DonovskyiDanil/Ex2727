import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
<<<<<<< HEAD
import CONSTANTS from '../../../constants';
import Spinner from '../../Spinner/Spinner';

// Куда отправлять пользователя, если он зашёл на страницу не своей роли
const homeByRole = (role) =>
  role === CONSTANTS.MODERATOR ? '/offersReview' : '/';

const hasToken = () => {
  const token = localStorage.getItem(CONSTANTS.ACCESS_TOKEN);
  return !!token && token !== 'null' && token !== 'undefined';
};

/**
 * allowedRoles — необязательный список ролей, которым разрешён доступ.
 * Без него достаточно просто быть авторизованным.
 */
const PrivateRoute = ({ allowedRoles }) => {
  const { data, isFetching, error } = useSelector((state) => state.userStore);
  const needsFetch = !data && !error && hasToken();

  if (isFetching || needsFetch) {
    return <Spinner />;
  }

  if (!data) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(data.role)) {
    return <Navigate to={homeByRole(data.role)} replace />;
  }

  return <Outlet />;
=======
import Spinner from '../../Spinner/Spinner';

const PrivateRoute = (props) => {
  const { data, isFetching } = useSelector((state) => state.userStore);

  if (isFetching) {
    return <Spinner />;
  }

  return data ? <Outlet /> : <Navigate to="/login" />;
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
};

export default PrivateRoute;
