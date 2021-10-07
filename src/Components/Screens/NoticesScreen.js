import React from 'react';
import { connect } from "react-redux";
import { FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, Item, Picker, Spinner, Textarea } from "native-base";
import Colors from '../../helper/Colors';
import Header from '../SeperateComponents/Header';
import TitleText from '../SeperateComponents/TitleText';
import Button from '../SeperateComponents/Button';
import * as actions from '../../Store/Actions/NoticesActions';
import PopupDialog from "react-native-popup-dialog";
import DatePicker from "react-native-datepicker";
import * as NavigationService from '../../NavigationService';
import moment from "moment";

class NoticesScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      statses: {
        "": "All",
        "pending": "Pending",
        "in_progress": "In Progress",
        "approved": "Approved",
        "rejected": "Rejected",
      },
      loading: true,
      modalVisible: false,
      filter: {
        status: '',
      },
      isDialogVisible: false,
      isSchedule: false,
      details: '',
      date: moment(),
      notices: []

    };
  }

  componentDidMount() {
    this.applyFilter();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.notices !== prevState.notices) {
      return { notices: nextProps.notices };
    }
    return null;
  }

  applyFilter = () => {
    const { user: { access_token }, getNotices } = this.props;
    const { filter } = this.state;
    this.setState({ loading: true, modalVisible: false });
    getNotices({
      onError: (error) => {
        alert(error);
        this.setState({ loading: false });
      },
      onSuccess: () => {
        this.setState({ loading: false });
      },
      filter,
      token: access_token
    });
  }


  renderFilterView = () => {
    const { modalVisible, statses, filter } = this.state;

    if (!modalVisible) {
      return;
    }

    return (
      <View style={{ position: 'absolute', width: "70%", height: "82%", marginTop: "20%", alignSelf: 'flex-end', backgroundColor: "white" }}>
        <TouchableOpacity onPress={() => {
          this.setState({ modalVisible: false })
        }}>
          <Image style={{
            width: 20,
            margin: 10,
            marginTop: 15,
            height: 20,
            alignSelf: 'flex-end'
          }}
            resizeMode="contain"
            source={require('./../../../assets/close.png')}
          />
        </TouchableOpacity>
        <TitleText style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: 5 }} >Filter</TitleText>


        <Item picker style={styles.pickerStyle}>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            style={{ width: "100%" }}
            placeholder="Room Catagories"
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            selectedValue={filter.status}
            onValueChange={status => this.setState({ filter: { ...filter, status } })}>
            <Picker.Item label="All Notices" value="" />
            {Object.keys(statses)
              .filter(k => k)
              .map(k => <Picker.Item key={k} label={statses[k]} value={k} />)}
          </Picker>
        </Item>

        <View style={{ justifyContent: 'center' }}>
          <Button onPress={this.applyFilter}>Apply Filter</Button>
        </View>

      </View>
    );
  }

  renderNotices = () => {

    if (this.state.loading) {
      return <Spinner color='black' />;
    }

    return (
      <FlatList
        data={this.state.notices}
        enableEmptySections={true}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: "45%" }}
        renderItem={({ item, index }) => (
          <View key={index} style={[styles.container]}>
            <View style={styles.child}>
              <Image resizeMode="cover" style={{ position: 'absolute', height: 80, width: 90 }}
                source={require('./../../../assets/feature.png')}
              />
              <Text style={{ marginTop: 15, marginStart: 5, alignSelf: 'flex-start', color: Colors.white, fontSize: 14, transform: [{ rotate: '-40deg' }] }} >{item.status}</Text>
              <View style={{ flexDirection: 'row', margin: 15, marginTop: 35 }}>
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                  <TitleText style={{ color: Colors.orange, fontWeight: 'bold', fontSize: 16, }} >Nook Code</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >ID</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Checkout</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Days Left</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Submited At</TitleText>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={() => NavigationService.navigate("NookDetailScreen", item.nook)}>
                    <TitleText style={{ color: Colors.orange, fontWeight: 'bold', fontSize: 16, }} >{item.nook.nookCode}</TitleText>
                  </TouchableOpacity>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >{item.id}</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >{item.checkout}</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >{item.diffInDays} days</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >{item.created_at}</TitleText>
                </View>
              </View>
              <View style={{ justifyContent: 'center' }}>
                <View style={{ paddingStart: 10, paddingEnd: 10 }}>
                  <TitleText style={{ fontWeight: 'bold', fontSize: 16, }} >Notice Details</TitleText>
                  <Text style={{marginTop:10}}>{item.details}</Text>
                </View>
              </View>
              <View style={{ justifyContent: 'center', marginBottom: 10 }}>
                {(item.status === 'Pending') && <Button onPress={() => this.cancelNotice(item)}>Cancel Notice</Button>}
              </View>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl
            //refresh control used for the Pull to Refresh
            refreshing={this.state.loading}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      />
    );
  };

  renderNoticePopup = () => {
    const { isSchedule, isDialogVisible, date, details, submitting } = this.state;

    if (isSchedule) {
      return (
        <PopupDialog
          width={0.9} height={0.50}
          visible={isDialogVisible}
          onTouchOutside={this.togglePopup}>
          <View style={{ flex: 1, padding: 25, }}>
            <TouchableOpacity onPress={() => this.setState({
              isDialogVisible: false
            })}>
              <Image resizeMode="contain" source={require('./../../../assets/close.png')} style={{ height: 25, width: 25, alignSelf: 'flex-end' }} />
            </TouchableOpacity>

            <DatePicker
              style={{
                ...styles.container,
                width: "100%", flex: 0, padding: 0, marginTop: 10
              }}
              mode="datetime"
              date={date}
              placeholder='Select a date'
              format="MMMM Do YYYY, h:mm a"
              // format="X"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              iconSource={require('./../../../assets/date.png')}
              customStyles={{
                dateText: {
                  margin: 15,
                  marginTop: 15,
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
                  date
                })
              }}
            />

            <Textarea
              rowSpan={4}
              bordered
              placeholder="Description"
              value={details}
              onChangeText={details => {
                this.setState({ details })
              }}
            />
            <Button disabled={submitting} onPress={() => { this.sendNotice() }} >{submitting ? 'Please wait...' : 'Add Notice'}</Button>
          </View>
        </PopupDialog>
      );
    }

  }

  cancelNotice = (notice) => {
    const { user: { access_token }, cancelNotice } = this.props;
    cancelNotice({
      onError: alert,
      onSuccess: alert,
      data: {
        notice_id: notice.id
      },
      token: access_token
    });
  }

  onRefresh() {
    //Clear old data of the list
    this.setState({ notices: [] });
    //Call the Service to get the latest data
    this.applyFilter();
  }

  render() {


    const { filter: { status }, statses } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
        <Header backButton={true} />
        <TitleText style={{ marginTop: 25, fontWeight: 'bold', fontSize: 20, }} >{statses[status]} Notices</TitleText>
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => { this.setState({ isDialogVisible: true, isSchedule: true }); }}
            >
              <Text style={{
                color: 'white', fontWeight: 'bold'
              }}>Add </Text>
              <Image style={{
                width: 30,
                height: 30,
                alignSelf: 'center',
                alignItems: 'center'
              }}
                resizeMode="contain"
                source={require('./../../../assets/add.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              this.setState({ modalVisible: true })
            }}>
              <Image style={{
                width: 30,
                height: 30,
                marginBottom: 5,
                alignSelf: 'flex-end'
              }}
                resizeMode="contain"
                source={require('./../../../assets/filter.png')}
              />
            </TouchableOpacity>
          </View>
          {this.renderNotices()}
        </View>
        {this.renderNoticePopup()}
        {this.renderFilterView()}
      </View >
    );
  }
  toggleSubmitting = () => {
    const { submitting } = this.state;
    this.setState({
      submitting: !submitting,
    });
  };
  sendNotice() {
    this.toggleSubmitting();
    const { filter } = this.state;
    const { user: { access_token }, addNotice } = this.props;
    this.setState({ loading: true, modalVisible: false });
    addNotice({
      data: { "details": this.state.details, "checkout": moment(this.state.date, 'MMMM Do YYYY, h:mm a').unix() },
      onError: (error) => {
        this.toggleSubmitting();
        alert(error);
        this.setState({ loading: false });
      },
      onSuccess: () => {
        this.toggleSubmitting();
        this.setState({ loading: false, isDialogVisible:false });
        alert('Notice has been sent successfully');
      },
      filter,
      token: access_token
    })
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    height: 160,
    width: 160,
    marginBottom: 20,
    alignSelf: 'center'
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#E59413',
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 5,
    marginStart: 5,
    marginEnd: 5, height: 40
  },
  pickerStyle: {
    marginBottom: 10,
    backgroundColor: Colors.white,
    borderRadius: 10, marginTop: 10,
  },
  imageButton: {
    position: 'absolute',
    bottom: -7,
    alignSelf: "flex-end"
  },
  imageView: {
    height: "100%",
    width: "100%",
    position: 'relative',
    marginTop: 20,
    borderWidth: 2,
    borderColor: Colors.primaryColor,
    alignSelf: 'center',
    borderRadius: 100
  },
  textArea: {
    margin: 20,
    paddingTop: 10
  },
  checkbox: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingEnd: 10,
    flexDirection: 'row',
  },
  checkboxItem: {
    flex: 1,
    marginStart: 20,
    marginEnd: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textAreaContainer: {
    borderColor: Colors.textGray,
    borderWidth: 1,
    padding: 5,
    marginStart: 10,
    marginEnd: 10
  },
  textArea1: {
    height: 70,
    justifyContent: "flex-start"
  },
  container: {
    flex: 1,
    paddingStart: 5,
    paddingEnd: 5,
    paddingTop: 5,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 5,
  },
  child: {
    flex: 1,
    borderRadius: 10,
    // To round image corners
    overflow: 'hidden',
    borderColor: '#999',
    borderWidth: 0,
    backgroundColor: '#FFF',
    // Android shadow
    elevation: 3
  }
});


const mapStateToProps = state => {
  return {
    notices: state.NoticesReducer.notices,
    user: state.AuthReducer.user,
  };
};

export default connect(
  mapStateToProps,
  {
    getNotices: actions.getNotices,
    addNotice: actions.addNotice,
    cancelNotice: actions.cancelNotice,
  },
)(NoticesScreen);
