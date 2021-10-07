import * as actions from '../Actions/type';
const initSate = {
  room_shifts: [],
};

const RoomShiftsReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.SET_ROOM_SHIFTS: {
      return {
        ...state,
        room_shifts: [...action.payload],
      };
    }

    case actions.CANCEL_ROOM_SHIFT: {
      const room_shift = action.payload;
      const room_shifts = state.room_shifts.map(b => {
        if(b.id === room_shift.id){
          return {...room_shift};
        }
        return {...b}
      })
      return {
        ...state,
        room_shifts
      };
    }

    case actions.ADD_ROOM_SHIFT: {
      return {
        ...state,
        room_shifts: [
          { ...action.payload },
          ...state.room_shifts,
        ],
      };
    }

    default: {
      return state;
    }
  }
};

export default RoomShiftsReducer;
