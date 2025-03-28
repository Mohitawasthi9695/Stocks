// action - state management
import { REGISTER, LOGIN, LOGOUT } from './actions';

// initial state
export const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
  token:null,
};

// ==============================|| AUTH REDUCER ||============================== //

const auth = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER: {
      const { user } = action.payload;
      return {
        ...state,
        user
      };
    }
    case LOGIN: {
      const { user,token } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user,
        token
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isInitialized: true,
        isLoggedIn: false,
        user: null
      };
    }
    case 'INITIALIZE': {
      return {
        ...state,
        isInitialized: true,
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default auth;
