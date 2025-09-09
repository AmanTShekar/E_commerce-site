// src/redux/reducers/authReducer.js

const initialState = JSON.parse(localStorage.getItem('auth')) || {
  isLoggedIn: false,
  user: null,
  userType: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      const loggedInState = {
        isLoggedIn: true,
        user: action.payload.user,
        userType: action.payload.userType,
      };
      localStorage.setItem('auth', JSON.stringify(loggedInState));
      return loggedInState;

    case 'LOGOUT':
      localStorage.removeItem('auth');
      return {
        isLoggedIn: false,
        user: null,
        userType: null,
      };

    default:
      return state;
  }
};

export default authReducer;
