import React from 'react';
import { connect } from "react-redux";
import { StyleSheet, Text, View, ScrollView,Alert, Image, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { Icon, Item, Picker, Spinner, Textarea, Thumbnail } from "native-base";
import Colors from '../../helper/Colors';
import Header from '../SeperateComponents/Header';
import TitleText from '../SeperateComponents/TitleText';
import Button from '../SeperateComponents/Button';
import * as NavigationService from '../../NavigationService';
import * as actions from '../../Store/Actions/ComplainsActions';
import PopupDialog from "react-native-popup-dialog";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'

class ComplaintsScreen extends React.Component {

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
      description: '',
      type: '',
      types: {
        'maintenance': 'Maintenance',
        'car_wash':'Car Wash',
        'delivery':'Delivery',
        'security': 'Security',
        'charity_stuff': 'Charity Stuff',
        'staff_related': 'Staff Related',
        'privacy': 'Privacy',
        'internet': 'Internet',
        'food': 'Food',
        'cleaning': 'Cleaning',
        'entertainment': 'Entertainment',
        'discipline': 'Discipline', 
        'other': 'Other Support'
      },
      complains: [],
      image:'',
      profile:'',
    };
  }

  componentDidMount() {
    this.applyFilter();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.complains !== prevState.complains) {
      return { complains: nextProps.complains };
    }
    return null;
  }

  onRefresh() {
    //Clear old data of the list
    this.setState({ complains: [] });
    //Call the Service to get the latest data
    this.applyFilter();
  }


  pickImage = async (driver) => {

    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);

    if (status === 'granted') {

      let src = ImagePicker.launchImageLibraryAsync;

      if (driver == "camera") {
        src = ImagePicker.launchCameraAsync;
      }

      let result = await src({
        allowsEditing: true,
        aspect: [4, 3],
        base64: true,
        quality: 0.5
      });

      if (!result.cancelled) {
        const base64 = result.base64.replace(/\n/g, "");
        this.setState({ image: result.uri, profile: base64 });
      }

    } else {
      return alert("Permission not granted");
    }

  };

  selectImageSrc = () => {

    Alert.alert(
      'Image Source',
      'Select Image From', [
      { text: 'Camera', onPress: () => this.pickImage("camera") },
      { text: 'Gallery', onPress: () => this.pickImage("gallary") },
    ],
      { cancelable: true },
    );

  }
  
  applyFilter = () => {
    const { user: { access_token }, getComplains } = this.props;
    const { filter } = this.state;
    this.setState({ loading: true, modalVisible: false });
    getComplains({
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
            <Picker.Item label="All Complains/Services" value="" />
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

  renderComplains = () => {

    if (this.state.loading) {
      return <Spinner color='black' />;
    }
    return (
      <FlatList
        data={this.state.complains}
        enableEmptySections={true}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: "50%" }}
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
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Room Number</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Room Type</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Complain Type</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Submited At</TitleText>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={() => NavigationService.navigate("NookDetailScreen", item.nook)}>
                    <TitleText style={{ color: Colors.orange, fontWeight: 'bold', fontSize: 16, }} >{(item.nook) ? item.nook.nookCode : ''}</TitleText>
                  </TouchableOpacity>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >{item.id}</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >{(item.room) ? item.room.room_number : ''}</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >{(item.room) ? `${item.room.capacity} Person(s)` : ''}</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >{item.type}</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >{item.created_at}</TitleText>
                </View>
              </View>
              {item.media && 
                <View style={{ justifyContent: 'center' }}>
                  <View style={{ padding:10 }}>
                    <Image resizeMode="contain" source={{uri: item.media}} style={{ height: 200, width: null, flex: 1 }} />
                  </View>
                </View>
              }
              <View style={{ justifyContent: 'center' }}>
                <View style={{ padding:10 }}>
                  <TitleText style={{ fontWeight: 'bold', fontSize: 16, }} >Complain Details</TitleText>
                  <Text >{item.description}</Text>
                </View>
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
  renderComplainsPopup = () => {
    const { isSchedule, isDialogVisible, date, description, submitting, profile, image } = this.state;
    
    if (isSchedule) {
      return (
        <PopupDialog
          width={0.9} height={0.8}
          visible={this.state.isDialogVisible}
          onTouchOutside={this.togglePopup}>
          <View style={{ flex: 1, padding: 25, }}>
          {/* <ScrollView> */}
            <TouchableOpacity onPress={() => this.setState({
              isDialogVisible: false
            })}>
              <Image resizeMode="contain" source={require('./../../../assets/close.png')} style={{ height: 25, width: 25, alignSelf: 'flex-end' }} />
            </TouchableOpacity>
            <Item picker style={styles.pickerStyle}>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: "100%" }}
                placeholder="Select Type"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.type}
                onValueChange={type => this.setState({ type })}>
                <Picker.Item label="All Types" value="" />
                {Object.keys(this.state.types)
                  .filter(k => k)
                  .map(k => <Picker.Item key={k} label={this.state.types[k]} value={k} />)}
              </Picker>
            </Item>

            <Textarea
              rowSpan={4}
              bordered
              placeholder="Description"
              value={description}
              onChangeText={description => this.setState({ description })}
            /> 
            { image !='' && 
              <>
              <TouchableOpacity onPress={() => this.setState({image:'', profile:''})}>
              <Text
                style={{
                  marginRight: 0,
                  width: 100,
                  flex: 1,
                  color: "red",
                }}
              >
                x
              </Text>
            </TouchableOpacity>
            <Image
              resizeMode="cover"
              resizeMode="contain"
              source={{
                uri: image,
              }}
              style={{
                borderRadius: 10,
                height: 100,
                width: null,
                flex: 1,
              }}
            />
            </> 
            }
            { !image && 
              <View style={styles.container} >
                <View style={[styles.child, { height: 150, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }]}>
                  <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20 }} >
                    Select Image
                  </TitleText>
                  <TouchableOpacity onPress={this.selectImageSrc}>
                    <Image style={{
                      width: 40,
                      height: 40,
                    }}
                      source={require('./../../../assets/add.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            }
            <Button disabled={submitting} onPress={() => { this.sendComplains() }} >{submitting ? 'Please wait...' : 'Add Complain'}</Button>
            {/* </ScrollView> */}
          </View>
        </PopupDialog>
      );
    }

  }
  render() {


    const { filter: { status }, statses } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
        <Header backButton={true} />
        <TitleText style={{ marginTop: 25, fontWeight: 'bold', fontSize: 20, }} >{statses[status]} Complains/Services</TitleText>
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
          {this.renderComplains()}
        </View>
        {this.renderComplainsPopup()}
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
  sendComplains() {

    this.toggleSubmitting();
    
    const { filter } = this.state;
    const { user: { access_token }, addComplain } = this.props;
    
    const data = { "description": this.state.description, "type": this.state.type, "media":this.state.profile };
    
    addComplain({
      data: data,
      onError: (error) => {
        this.toggleSubmitting();
        alert(error);
      },
      onSuccess: () => {
        alert('Complain has been sent successfully');
        this.setState({ submitting:false, isDialogVisible:false, profile:'', image:'' });
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
    complains: state.ComplainsReducer.complains,
    user: state.AuthReducer.user,
  };
};

export default connect(
  mapStateToProps,
  {
    getComplains: actions.getComplains,
    addComplain: actions.addComplain
  },
)(ComplaintsScreen);
