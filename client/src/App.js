<<<<<<< HEAD
import React, { Component, lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import Router from './router';
import 'react-toastify/dist/ReactToastify.css';
import CONSTANTS from './constants';
import browserHistory from './browserHistory';
import OnlyNotAuthorizedUserRoute from './components/Routes/OnlyNotAuthorizedUserRoute/OnlyNotAuthorizedUserRoute';
import PrivateRoute from './components/Routes/PrivateRoute/PrivateRoute';

const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage/RegistrationPage'));
const Payment = lazy(() => import('./pages/Payment/Payment'));
const StartContestPage = lazy(() => import('./pages/StartContestPage/StartContestPage'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const NotFound = lazy(() => import('./components/NotFound/NotFound'));
const Home = lazy(() => import('./pages/Home/Home'));
const ContestPage = lazy(() => import('./pages/ContestPage/ContestPage'));
const UserProfile = lazy(() => import('./pages/UserProfile/UserProfile'));
const ContestCreationPage = lazy(() => import('./pages/ContestCreation/ContestCreationPage'));
const Layout = lazy(() => import('./pages/Layout/Layout'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorks/HowItWorksPage'));
const EventsPage = lazy(() => import('./pages/Events/EventsPage'));
const ModeratorPage = lazy(() => import('./pages/ModeratorPage/ModeratorPage'));
=======
import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import Router from './router';
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import Payment from './pages/Payment/Payment';
import StartContestPage from './pages/StartContestPage/StartContestPage';
import Dashboard from './pages/Dashboard/Dashboard';
import NotFound from './components/NotFound/NotFound';
import Home from './pages/Home/Home';
import ContestPage from './pages/ContestPage/ContestPage';
import UserProfile from './pages/UserProfile/UserProfile';
import 'react-toastify/dist/ReactToastify.css';
import ContestCreationPage from './pages/ContestCreation/ContestCreationPage';
import CONSTANTS from './constants';
import browserHistory from './browserHistory';
import ChatContainer from './components/Chat/ChatComponents/ChatContainer/ChatContainer';
import Layout from './pages/Layout/Layout';
import OnlyNotAuthorizedUserRoute from './components/Routes/OnlyNotAuthorizedUserRoute/OnlyNotAuthorizedUserRoute';
import PrivateRoute from './components/Routes/PrivateRoute/PrivateRoute';
import HowItWorksPage from './pages/HowItWorks/HowItWorksPage';
import EventsPage from './pages/Events/EventsPage';
import ModeratorPage from './pages/ModeratorPage/ModeratorPage';
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
<<<<<<< HEAD
        <Suspense fallback={<div role="status">Loading page...</div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route index element={<Home />} />

              <Route element={<OnlyNotAuthorizedUserRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registration" element={<RegistrationPage />} />
              </Route>

              <Route element={<PrivateRoute />}>
                <Route path="/account" element={<UserProfile />} />
              </Route>

              <Route
                element={
                  <PrivateRoute
                    allowedRoles={[CONSTANTS.CUSTOMER, CONSTANTS.CREATOR]}
                  />
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contest/:id" element={<ContestPage />} />
              </Route>

              <Route element={<PrivateRoute allowedRoles={[CONSTANTS.CUSTOMER]} />}>
                <Route path="/payment" element={<Payment />} />
                <Route path="/startContest" element={<StartContestPage />} />
                <Route
                  path="/startContest/nameContest"
                  element={
                    <ContestCreationPage
                      contestType={CONSTANTS.NAME_CONTEST}
                      title="Company Name"
                    />
                  }
                />
                <Route
                  path="/startContest/taglineContest"
                  element={
                    <ContestCreationPage
                      contestType={CONSTANTS.TAGLINE_CONTEST}
                      title="TAGLINE"
                    />
                  }
                />
                <Route
                  path="/startContest/logoContest"
                  element={
                    <ContestCreationPage
                      contestType={CONSTANTS.LOGO_CONTEST}
                      title="LOGO"
                    />
                  }
                />
                <Route path="/events" element={<EventsPage />} />
              </Route>

              <Route element={<PrivateRoute allowedRoles={[CONSTANTS.MODERATOR]} />}>
                <Route path="/offersReview" element={<ModeratorPage />} />
                <Route
                  path="/moderator"
                  element={<Navigate to="/offersReview" replace />}
                />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
=======
        <Routes>
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route element={<OnlyNotAuthorizedUserRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registration" element={<RegistrationPage />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/payment" element={<Payment />} />
              <Route path="/startContest" element={<StartContestPage />} />
              <Route path="/moderator" element={<ModeratorPage />} />
              <Route
                path="/startContest/nameContest"
                element={
                  <ContestCreationPage
                    contestType={CONSTANTS.NAME_CONTEST}
                    title="Company Name"
                  />
                }
              />
              <Route
                path="/startContest/taglineContest"
                element={
                  <ContestCreationPage
                    contestType={CONSTANTS.TAGLINE_CONTEST}
                    title="TAGLINE"
                  />
                }
              />
              <Route
                path="/startContest/logoContest"
                element={
                  <ContestCreationPage
                    contestType={CONSTANTS.LOGO_CONTEST}
                    title="LOGO"
                  />
                }
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contest/:id" element={<ContestPage />}/>
              <Route path="/account" element={<UserProfile />}/>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
{localStorage.getItem('accessToken') && <ChatContainer />}
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
      </Router>
    );
  }
}

export default App;
