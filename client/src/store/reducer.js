import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import dataForContestReducer from './slices/dataForContestSlice';
import paymentReducer from './slices/paymentSlice';
import contestsReducer from './slices/contestsSlice';
import contestCreationReducer from './slices/contestCreationSlice';
import bundleReducer from './slices/bundleSlice';
import contestByIdReducer from './slices/contestByIdSlice';
import contestUpdationReducer from './slices/contestUpdationSlice';
import chatReducer from './slices/chatSlice';
import userProfileReducer from './slices/userProfileSlice';
<<<<<<< HEAD
import eventsReducer from './slices/eventsSlice';
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

const rootReducer = combineReducers({
  userStore: userReducer,
  auth: authReducer,
  dataForContest: dataForContestReducer,
  payment: paymentReducer,
  contestByIdStore: contestByIdReducer,
  contestsList: contestsReducer,
  contestCreationStore: contestCreationReducer,
  bundleStore: bundleReducer,
  contestUpdationStore: contestUpdationReducer,
  chatStore: chatReducer,
  userProfile: userProfileReducer,
<<<<<<< HEAD
  eventsStore: eventsReducer,
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
});

export default rootReducer;
