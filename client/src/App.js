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
      </Router>
    );
  }
}

export default App;
