import * as actions from '../Actions/type';

const initSate = {
    nook:null,
    review:null,
    room:null,
    nooks:[],
    area:[],
    desiredLocation:null,
};

const NookReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.SET_MY_NOOK: {
      const {nook,review, room} = action.payload;
      return {
        ...state,
        nook,
        review,
        room,
      };
    }
    case actions.SET_NOOK_REVIEW: {
      const review = action.payload;
      return {
        ...state,
        review,
      };
    }
    case actions.SET_DESIRED_LOCATION: {
      const desiredLocation = action.payload;
      console.log({desiredLocation});
      return {
        ...state,
        desiredLocation,
      };
    }
    case actions.SET_NOOKS: {
        return {
          ...state,
          nooks: [...action.payload],
        };
      }
      case actions.SET_AREA: {
        return {
          ...state,
          area: [...action.payload],
        };
      }
      case actions.ADD_NOOK_ROOM: {
        return {
          ...state,
          // bookings: state.bookings.append(action.payload.booking),
          bookings: state.bookings.concat([action.payload.booking]),
        };
      }
    default: {
      return state;
    }
  }
};

export default NookReducer;
