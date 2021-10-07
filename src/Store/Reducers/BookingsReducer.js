import * as actions from '../Actions/type';
const initSate = {
    bookings:[],
};

const BookingsReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.SET_BOOKINGS: {
      return {
        ...state,
        bookings: [...action.payload],
      };
    }
    case actions.CANCEL_BOOKING: {

      const booking = action.payload;
      const bookings = state.bookings.map(b => {
        if(b.id === booking.id){
          return {...booking};
        }
        return {...b}
      })
      return {
        ...state,
        bookings
      };
    }

    default: {
      return state;
    }
  }
};

export default BookingsReducer;
