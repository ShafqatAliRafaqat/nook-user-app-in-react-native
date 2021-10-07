import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ComplainsReducer from './ComplainsReducer';
import NookReducer from './NookReducer';
import BookingsReducer from './BookingsReducer';
import NoticesReducer from './NoticesReducer';
import ShiftsReducer from './ShiftsReducer';
import RoomShiftsReducer from './RoomShiftsReducer';
import VisitsReducer from "./VisitsReducer";
import ReceiptReducer from "./ReceiptReducer";
import PaymentReducer from "./PaymentReducer";
import NotificationsReducer from "./NotificationsReducer";

const rootReducers = combineReducers({
  AuthReducer,
  ComplainsReducer,
  NookReducer,
  BookingsReducer,
  NoticesReducer,
  ShiftsReducer,
  RoomShiftsReducer,
  VisitsReducer,
  ReceiptReducer,
  PaymentReducer,
  NotificationsReducer
});

export default rootReducers;
