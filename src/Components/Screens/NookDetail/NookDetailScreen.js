import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { Icon, Card, Textarea, Picker, Item, CheckBox } from "native-base";
import Header from '../../SeperateComponents/Header';
import TitleText from '../../SeperateComponents/TitleText';
import Colors from '../../../helper/Colors';
import styles from './styles';
import MapView, { Marker } from 'react-native-maps';
import PopupDialog from 'react-native-popup-dialog';
import Button from '../../SeperateComponents/Button';
import { WebView } from 'react-native-webview';
import { connect } from "react-redux";
import DatePicker from 'react-native-datepicker'
import * as NavigationService from '../../../NavigationService';
import * as actions from "../../../Store/Actions/NookActions";
import * as bookingActions from '../../../Store/Actions/BookingsActions';
import * as shiftsActions from "../../../Store/Actions/ShiftsActions";
import moment from 'moment';

class NookDetailScreen extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      tabIndex: 0,
      isDialogVisible: false,
      date: moment(),
      markers: {
        latlng: {
          latitude: 31.435076,
          longitude: 74.3000764,
        },
        title: "",
        description: ""
      },
      filter: {
        status: '',
      },
      roomId: 0,
      isBookNow: false,
      isSchedule: false,
      show: false,
      nook: null,
      addShiftModal: false,
      details: '',
      dateText: ''
    }
  }


  Map = () => {

    const nook = this.props.navigation.state.params;

    return (<View pointerEvents="none" style={{ flex: 1 }}>

      <MapView initialRegion={{
        latitude: nook.location.lat,
        longitude: nook.location.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }} style={styles.mapStyle} >
        <Marker
          image={require('./../../../../assets/marker.png')}
          coordinate={{
            latitude: nook.location.lat,
            longitude: nook.location.lng,
          }}
        />
      </MapView>
      <View style={[styles.container, { width: "100%", flex: 0, marginTop: 10, position: 'absolute' }]}>
        <View style={[styles.child, { borderRadius: 30, flexDirection: 'row', alignItems: 'center', paddingStart: 20 }]}>
          <Image resizeMode="contain" source={require('./../../../../assets/search.png')} style={{ height: 20, width: 20, }} />
          <Text style={{ margin: 15, }}>{nook.address}</Text>
        </View>
      </View>
    </View>)
  }

  componentDidMount() {

    const { user, getMyNookDetails, getBookings } = this.props;
    const nook = this.props.navigation.state.params;
    if (user) {
      getMyNookDetails({
        token: user.access_token
      });
      getBookings({
        filter: {
          nook_id: nook.id,
        },
        token: user.access_token
      });
    }

    let featuredImage = null;
    if (nook.medias && nook.medias.length > 0) {
      featuredImage = nook.medias[0].path;
    }

    this.setState({
      featuredImage,
    });
  }

  handleRoomChange = value => this.setState({
    roomId: value
  });

  togglePopup = () => {
    const { isDialogVisible } = this.state;
    this.setState({
      isDialogVisible: !isDialogVisible
    });
  }

  renderScheduleVisitPopup = (nook_id) => {
    const { isSchedule, isDialogVisible, submitting } = this.state;

    if (isSchedule) {
      return (
        <PopupDialog
          width={0.9} height={0.40}
          visible={isDialogVisible}
          onTouchOutside={this.togglePopup}>
          <View style={{ flex: 1, padding: 25, }}>
            <TouchableOpacity onPress={this.togglePopup}>
              <Image resizeMode="contain" source={require('./../../../../assets/close.png')} style={{ height: 25, width: 25, alignSelf: 'flex-end' }} />
            </TouchableOpacity>
            <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginRight: 10, marginTop: 5 }} >
              Date & Time
            </TitleText>

            <DatePicker
              style={{
                ...styles.container,
                width: "100%", flex: 0, padding: 0,
              }}
              mode="datetime"
              date={this.state.date}
              minDate = {this.state.date}
              placeholder="Select Date & Time"
              format="MMMM Do YYYY, h:mm a"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              iconSource={require('./../../../../assets/date.png')}
              customStyles={{
                dateText: {
                  margin: 0,
                  color: 'black'
                },
                dateIcon: {
                  height: 20, width: 20,
                },
                dateInput: {
                  ...styles.child,
                  borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingStart: 10, paddingEnd: 15,

                }
              }}
              onDateChange={(date) => {
                this.setState({
                  date: date
                })
              }}
            />
            <Button disabled={submitting} onPress={() => { this.setSchedule(nook_id) }} >{submitting ? 'Please wait...' : 'Schedule'}</Button>
          </View>
        </PopupDialog>
      );
    }

  }

  submitShift = () => {
    this.toggleSubmitting();
    const { user: { access_token }, addShift } = this.props;
    const nook = this.props.navigation.state.params;
    const { roomId, details } = this.state;
    addShift({
      data: {
        nook_id: nook.id,
        room_id: roomId,
        details,
      },
      onError: message => {
        alert(message);
        
        this.setState({
          addShiftModal: false,
        });
        
        this.toggleSubmitting();
      },
      onSuccess: message => {
        alert(message);
        this.toggleSubmitting();
      },
      token: access_token
    });
  };

  toggleShiftNookModal = () => {
    const { addShiftModal } = this.state;

    const { user } = this.props;
    if (!user) {
      return NavigationService.navigateAndResetStack('LoginScreen');
    }

    this.setState({
      addShiftModal: !addShiftModal
    });
  };

  toggleScheduleVisitModal = () => {
    const { user } = this.props;
    if (!user) {
      return NavigationService.navigateAndResetStack('LoginScreen');
    }
    this.setState({ isDialogVisible: true, isSchedule: true, isBookNow: false });
  }

  toggleSubmitting = () => {
    const { submitting } = this.state;
    this.setState({
      submitting: !submitting,
      addShiftModal: false,
    });
  };

  renderAddShiftPopup = () => {

    const { addShiftModal, details, roomId, submitting } = this.state;
    const nook = this.props.navigation.state.params;
    const { rooms, space_type } = nook;
    const height = (space_type === 'Shared') ? 0.6 : 0.6
    return (
      <PopupDialog
        width={0.9} height={height}
        ref={"popupDialog"}
        visible={addShiftModal}
        onTouchOutside={this.toggleShiftNookModal}>
        <View style={{ flex: 1, padding: 25, }}>
          <TouchableOpacity onPress={this.toggleShiftNookModal}>
            <Image resizeMode="contain" source={require('./../../../../assets/close.png')} style={{ height: 25, width: 25, alignSelf: 'flex-end' }} />
          </TouchableOpacity>

          {(space_type === 'Shared') && (
            <>
              <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginRight: 10, marginTop: 5 }} >
                Room
              </TitleText>

              <Item picker style={styles.pickerStyle}>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: "100%" }}
                  placeholder="Room Catagories"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={roomId}
                  onValueChange={this.handleRoomChange
                  }>
                  <Picker.Item key={-1} value={0} label="Select Room" />
                  {rooms.map((room, roomi) => {
                    return <Picker.Item key={roomi} value={room.id} label={`${room.room_number} - ${room.capacity} Persons Sharing - ${room.price_per_bed} PKR`} />
                  })}
                </Picker>
              </Item>
            </>
          )}

          <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginRight: 10, marginTop: 5 }} >
            Shift Details
          </TitleText>

          <Textarea
            rowSpan={4}
            bordered
            placeholder="Details"
            value={details}
            onChangeText={details => this.setState({ details })}
          />

          <Button disabled={submitting} onPress={this.submitShift} >{submitting ? 'Please wait...' : 'Shift Nook'}</Button>
        </View>
      </PopupDialog>
    );
  }


  renderNookRooms = (nook) => {
    if (nook.space_type === 'Shared') {
      // if (nook.rooms.length != 0) { 
      let roomDetails = '';
      nook.rooms.forEach((room,index) => {
        roomDetails += `•  ${room.capacity} Peron(s) Sharing - ${room.price_per_bed} PKR - ${room.room_number}\n`
      });
      return (
        <View style={[styles.container, { marginBottom: 10, padding: 0 }]}>
          <View style={styles.child}>
            <View style={{ padding: 20 }}>
              <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginRight: 10, marginBottom: 10, }} >Room Details</TitleText>
              <View >
                <Text style={{ fontSize: 16 }}>{roomDetails}</Text>
              </View>
            </View>
          </View>
        </View>
      );
    }
  }

  sendBookingRequest = () => {

    this.toggleSubmitting();
    const nook = this.props.navigation.state.params;

    this.setState({ isDialogVisible: false });
    const { user: { access_token }, addNookRoom } = this.props;

    this.setState({ loading: true, modalVisible: false });
    addNookRoom({
      data: { "nook_id": nook.id, "room_id": this.state.roomId },
      onError: (error) => {
        this.toggleSubmitting();
        alert(error);
        this.setState({ loading: false });
      },
      onSuccess: () => {
        this.toggleSubmitting();
        this.setState({ loading: false });
        alert('Booking created successfully');
      },
      token: access_token
    });

  }

  submitNookBooking = () => {

    const { user } = this.props;
    if (!user) {
      return NavigationService.navigateAndResetStack('LoginScreen');
    }

    const nook = this.props.navigation.state.params;
    const { space_type } = nook;

    if (space_type === 'Shared') {
      return this.setState({ isDialogVisible: true, isBookNow: true, isSchedule: false });
    }
    
    this.sendBookingRequest();
  };



  render() {
    const nook = this.props.navigation.state.params;
    const { rooms } = nook;
    const { featuredImage, submitting } = this.state;
    const { usersNook, bookings } = this.props;

    let canShowBookingButton = true;

    const validBookingStatues = ['in_progress', 'pending', 'Approved'];

    if (usersNook || bookings.filter(b => validBookingStatues.includes(b.status)).length > 0) {
      canShowBookingButton = false;
    }
    let view = this.Map();
    let tab1Color;
    let tab2Color;
    let tab1Icon;
    let tab2Icon;
    if (this.state.tabIndex == 0) {

      tab1Color = Colors.orange;
      tab2Color = Colors.white;
      tab1Icon = require('./../../../../assets/map_select.png');
      tab2Icon = require('./../../../../assets/option_unselect.png');
    } else {

      tab2Color = Colors.orange;
      tab1Color = Colors.white;
      tab1Icon = require('./../../../../assets/map_unselect.png');
      tab2Icon = require('./../../../../assets/option_select.png');
    }

    return (

      <View style={{ flex: 1, backgroundColor: Colors.backgroundColor, }}>
        <Header backButton={true} optionButton={() => {

        }} />
        <ScrollView style={{ top: -7 }}>
          <View style={{ flexDirection: "row", }}>
            <View >
              <Image resizeMode="contain" style={{ height: 100, width: 100, }} />
            </View>
            <View style={{ flex: 1, width: '100%', marginTop: 10, position: 'absolute', }}>
              <TitleText style={{ marginTop: 25, fontWeight: 'bold', fontSize: 22, }} >{nook.nookCode}</TitleText>
            </View>
          </View>
          <View style={{ borderRadius: 30, marginTop: 10, marginBottom: 10, marginStart: 15, marginEnd: 15 }}>
            <View style={[styles.child, { borderRadius: 30, flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingStart: 15, paddingEnd: 15 }]}>
              <Text style={{ margin: 15, fontSize: 16, fontWeight: 'bold' }}>Nook Gender</Text>
              <Text style={{ margin: 15, fontSize: 16, }}>{nook.gender_type}</Text>
            </View>
            <View style={[styles.child, { marginTop: 10, borderRadius: 30, flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingStart: 15, paddingEnd: 15 }]}>
              <Text style={{ margin: 15, fontSize: 16, fontWeight: 'bold' }}>Type</Text>
              <Text style={{ margin: 15, fontSize: 16, }}>{nook.type}</Text>
            </View>
            <View style={[styles.child, { marginTop: 10, borderRadius: 30, flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingStart: 15, paddingEnd: 15 }]}>
              <Text style={{ margin: 15, fontSize: 16, fontWeight: 'bold' }}>Rent</Text>
              <Text style={{ margin: 15, fontSize: 16, }}>{(nook.rent && nook.rent !== '0') ? nook.rent : (nook.rooms.length != 0 )? Math.min(...nook.rooms.map(r => r.price_per_bed)) : '' } PKR / Month</Text>
            </View>
            {this.state.tabIndex === 0 ?
              <View>
                <View style={{ marginTop: 15 }}>
                  {featuredImage && (
                    <Image resizeMode="cover" resizeMode="contain" source={{
                      uri: featuredImage
                    }
                    } style={{ borderRadius: 10, height: 200, width: null, flex: 1 }} />
                  )}
                </View>
                <ScrollView horizontal={true} style={{ paddingTop: 15, paddingBottom: 15 }}>
                  {
                    nook.medias.map((m, index) => (
                      <TouchableOpacity key={index} onPress={() => this.setState({ featuredImage: m.path })}>
                        <Image resizeMode="cover" resizeMode="contain" source={{
                          uri: m.path
                        }
                        } style={{ marginEnd: 10, borderRadius: 10, height: 100, width: 100, flex: 1 }} />
                      </TouchableOpacity>
                    ))
                  }
                </ScrollView>
              </View> :
              <View style={{ marginTop: 15, paddingBottom: 15, borderRadius: 10, backgroundColor: Colors.white }}>
                {nook.video_url && 
                  <WebView
                    style={{ height: 200, width: null, flex: 1 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{ uri: `https://www.youtube.com/embed/${this.getYoutubeIDFromURL(nook.video_url)}?autoplay=1&theme=light&color=white&disablekb=1` }}
                    scalesPageToFit={true}
                    bounces={false}
                    javaScriptEnabled
                    
                    automaticallyAdjustContentInsets={false}
                  />
                }                
              </View>
            }
            <View style={{ backgroundColor: Colors.white, borderRadius: 30, flexDirection: "row", marginTop: 10, marginBottom: 10, marginStart: 15, marginEnd: 15 }}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => {
                  this.setState({ tabIndex: 0 });
                }} style={[styles.tabButton, { backgroundColor: tab1Color }]} >
                  <Text style={{ color: tab2Color }}>Image</Text>

                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => {
                  this.setState({ tabIndex: 1 })
                }} style={[styles.tabButton, { backgroundColor: tab2Color }]} >
                  <Text style={{ color: tab1Color }}>Virtual Visit</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.container, { marginBottom: 10, padding: 0 }]}>
              <View style={styles.child}>
                <View style={{ padding: 20, }}>
                  <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginRight: 10, marginBottom: 10, }} >
                    Description
                    </TitleText>
                  <Text>{nook.description}</Text>
                </View>
              </View>
            </View>

            {
              (nook.space_type === 'Independent') &&
              <View style={[styles.container, { marginBottom: 10, padding: 0 }]}>
                <View style={styles.child}>
                  <View style={{ padding: 20, }}>
                    <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginRight: 10, marginBottom: 10, }} >
                      Inner Details
                      </TitleText>
                    <Text>{nook.inner_details}</Text>
                  </View>
                </View>
              </View>
            }

            {
              (nook.space_type === 'Independent' && nook.other) &&
              <View style={[styles.container, { marginBottom: 10, padding: 0 }]}>
                <View style={styles.child}>
                  <View style={{ padding: 20, }}>
                    <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginRight: 10, marginBottom: 10, }} >
                      Other Details
                    </TitleText>
                    <Text>{nook.other}</Text>
                  </View>
                </View>
              </View>
            }

            {
              (nook.space_type === 'Independent') &&
              <Card style={{ borderRadius: 20 }}>
                <View style={{ flexDirection: 'row', margin: 15 }}>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <TitleText style={{
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>Area</TitleText>

                    <TitleText style={{
                      fontWeight: 'bold',
                      marginTop: 10,
                      fontSize: 16,
                    }}>Furnished</TitleText>

                    <TitleText style={{
                      fontWeight: 'bold',
                      marginTop: 10,
                      fontSize: 16,
                    }}>Security</TitleText>

                    <TitleText style={{
                      fontWeight: 'bold',
                      marginTop: 10,
                      fontSize: 16,
                    }}>Agreement Charges</TitleText>

                    <TitleText style={{
                      fontWeight: 'bold',
                      marginTop: 10,
                      fontSize: 16,
                    }}>Agreement Tenure</TitleText>

                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>

                    <TitleText style={{
                      color: Colors.textGray,
                      fontSize: 16,
                    }}>{nook.area}</TitleText>


                    <TitleText style={{
                      color: Colors.textGray,
                      marginTop: 10,
                      fontSize: 16,
                    }}>{nook.furnished ? 'Yes' : 'No'}</TitleText>

                    <TitleText style={{
                      color: Colors.textGray,
                      marginTop: 10,
                      fontSize: 16,
                    }}>{nook.security} PKR</TitleText>

                    <TitleText style={{
                      color: Colors.textGray,
                      marginTop: 10,
                      fontSize: 16,
                    }}>{nook.agreementCharges} PKR</TitleText>

                    <TitleText style={{
                      color: Colors.textGray,
                      marginTop: 10,
                      fontSize: 16,
                    }}>{nook.agreementTenure}</TitleText>
                  </View>
                </View>
              </Card>
            }

            <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginRight: 10, marginBottom: 10, }} >
              Facilities
            </TitleText>

            <View style={{ flexWrap: 'wrap', flexDirection: 'row', }}>
              {nook.facilities != null && nook.facilities.map((fac, facI) =>
                <View key={facI} style={{ width: "25%" }}>
                  <Card style={{ borderRadius: 20, padding: 5, alignItems: 'center' }}>
                    <Text>{fac}</Text>
                  </Card>
                </View>
              )}
            </View>

            {this.renderNookRooms(nook)}

            {nook.location &&
              <View>
                <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginRight: 10, marginBottom: 10, marginTop: 15 }} >
                  Location
              </TitleText>
                <View style={{ height: 400 }}>
                  {view}
                </View>
              </View>
            }

            <View style={[styles.child, { borderRadius: 30, flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingStart: 15, paddingEnd: 15 }]}>
              <Text style={{ margin: 15, fontSize: 16, fontWeight: 'bold' }}>Contact</Text>
              <Text style={{ margin: 15, fontSize: 16, }}>{nook.number}</Text>
            </View>
            {usersNook && <Button onPress={this.toggleShiftNookModal} disabled={submitting}>{submitting ? "Please wait..." : "Shift To This Nook"}</Button>}
            {canShowBookingButton && <Button onPress={this.submitNookBooking} disabled={submitting}>{submitting ? "Please wait..." : "Book Now"}</Button>}
            <Button onPress={this.toggleScheduleVisitModal} disabled={submitting}>{submitting ? "Please wait..." : "Schedule Visit"}</Button>
          </View>
          {this.renderAddShiftPopup()}
          {this.renderScheduleVisitPopup(nook.id)}
          {
            this.state.isBookNow &&
            <PopupDialog
              width={0.9} height={0.35}
              ref={"popupDialog"}
              visible={this.state.isDialogVisible}
              onTouchOutside={() => {
                this.setState({ isDialogVisible: false });
              }}>
              <View style={{ flex: 1, padding: 25, }}>
                <TouchableOpacity onPress={() => {
                  this.setState({ isDialogVisible: false });
                }}>
                  <Image resizeMode="contain" source={require('./../../../../assets/close.png')} style={{ height: 25, width: 25, alignSelf: 'flex-end' }} />
                </TouchableOpacity>
                <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginRight: 10, marginTop: 5 }} >
                  Room
                    </TitleText>
                <Item picker style={styles.pickerStyle}>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: "100%" }}
                    placeholder="Room Catagories"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.roomId}
                    onValueChange={this.handleRoomChange
                    }>
                    <Picker.Item key={-1} value={0} label="Select Room" />
                    {rooms.map((room, roomi) => {
                      return <Picker.Item key={roomi} value={room.id} label={`${room.room_number} - ${room.capacity} Persons Sharing - ${room.price_per_bed} PKR`} />
                    })}
                  </Picker>
                </Item>
                <Button disabled={submitting} onPress={this.sendBookingRequest} >{submitting ? 'Please wait...' : 'Book Nook'}</Button>
              </View>
            </PopupDialog>
          }
        </ScrollView>
      </View >
    );
  }

  setSchedule(nook_id) {
    this.toggleSubmitting();
    this.setState({ isDialogVisible: false });
    const { filter } = this.state;
    const { user: { access_token }, addNookSchedule } = this.props;
    this.setState({ loading: true, modalVisible: false });
    addNookSchedule({
      data: { "nook_id": nook_id, "time": moment(this.state.date, 'MMMM Do YYYY, h:mm a').unix() },
      onError: (error) => {
        this.toggleSubmitting();
        alert(error);
        this.setState({ loading: false });
      },
      onSuccess: () => {
        this.toggleSubmitting();
        this.setState({ loading: false });
        alert('Visit has been scheduled successfully');
      },
      filter,
      token: access_token
    })
  }

  getYoutubeIDFromURL(url) {
    var video_id = url.split('v=')[1];
    var ampersandPosition = video_id.indexOf('&');
    if (ampersandPosition != -1) {
      return video_id = video_id.substring(0, ampersandPosition);
    }
    return video_id;
  }
}
const mapStateToProps = state => {
  return {
    user: state.AuthReducer.user,
    usersNook: state.NookReducer.nook,
    bookings: state.BookingsReducer.bookings,
  };
};
export default connect(
  mapStateToProps,
  {
    addNookRoom: actions.addNookRoom,
    addNookSchedule: actions.addNookSchedule,
    addShift: shiftsActions.addShift,
    getMyNookDetails: actions.getMyNookDetails,
    getBookings: bookingActions.getBookings,
  },
)(NookDetailScreen)
