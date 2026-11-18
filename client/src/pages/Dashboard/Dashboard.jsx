import React from 'react';
import { useSelector } from 'react-redux';
<<<<<<< HEAD
import { Navigate, useNavigate, useParams } from 'react-router-dom';
=======
import { useNavigate, useParams } from 'react-router-dom';
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
import CONSTANTS from '../../constants';
import CustomerDashboard from '../../components/CustomerDashboard/CustomerDashboard';
import CreatorDashboard from '../../components/CreatorDashboard/CreatorDashboard';

const Dashboard = props => {
  const navigate = useNavigate();
  const params = useParams();
<<<<<<< HEAD
  const { role } = useSelector(state => state.userStore.data);
  if (role === CONSTANTS.MODERATOR) {
    return <Navigate to="/offersReview" replace />;
  }

=======

  const { role } = useSelector(state => state.userStore.data);
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  return role === CONSTANTS.CUSTOMER ? (
    <CustomerDashboard navigate={navigate} params={params} />
  ) : (
    <CreatorDashboard navigate={navigate} params={params} />
  );
};


export default Dashboard;
