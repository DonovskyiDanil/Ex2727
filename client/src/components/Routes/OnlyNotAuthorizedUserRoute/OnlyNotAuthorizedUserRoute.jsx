import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { getUser } from '../../../store/slices/userSlice';
import Spinner from '../../Spinner/Spinner';

const OnlyNotAuthorizedUserRoute = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isFetching, error } = useSelector((state) => state.userStore);

  useEffect(() => {
    // Не делаем запрос getUser для неавторизованных пользователей
    // Это предотвратит 401 ошибку в консоли
    if (!data && !error && !isFetching && !localStorage.getItem('accessToken')) {
      // Пользователь явно не авторизован - не делаем запрос
      return;
    }
    
    // Делаем запрос только если есть токен
    if (!data && !error && !isFetching) {
      dispatch(getUser());
    }
  }, [data, error, isFetching, dispatch]);

  useEffect(() => {
    if (data && !isFetching) {
      navigate('/', { replace: true });
    }
  }, [data, isFetching, navigate]);

  if (isFetching && !error) {
    return <Spinner />;
  }
  return !data ? <Outlet /> : null;
};

export default OnlyNotAuthorizedUserRoute;