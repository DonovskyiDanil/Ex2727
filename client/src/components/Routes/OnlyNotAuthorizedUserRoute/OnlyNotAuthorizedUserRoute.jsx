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