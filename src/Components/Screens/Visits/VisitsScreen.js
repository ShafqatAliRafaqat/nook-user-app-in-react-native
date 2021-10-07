import React from 'react';
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Linking,
  Alert,
  Platform,
  TouchableOpacity,
  RefreshControl, FlatList
} from 'react-native';
import { Icon, Item, Picker, Spinner, Text } from "native-base";
import Colors from '../../../helper/Colors';
import Header from '../../SeperateComponents/Header';
import TitleText from '../../SeperateComponents/TitleText';
import Button from '../../SeperateComponents/Button';
import * as NavigationService from '../../../NavigationService';
import * as actions from "../../../Store/Actions/VisitsActions";

class VisitsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      statses: {
        "": "All",
        "pending": "Pending",
        "in_progress": "In Progress",
        "approved": "Approved",
        // "rejected": "Rejected",
      },
      modalVisible: false,
      loading: true,
      filter: {
        status: '',
      },
      visits: []
    };
  }
  componentDidMount() {
    const { user } = this.props;
    if (!user) {
      return NavigationService.navigateAndResetStack('LoginScreen');
    }
    this.applyFilter();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.visits !== prevState.visits) {
      return { visits: nextProps.visits };
    }
    return null;
  }

  onRefresh() {
    //Clear old data of the list
    this.setState({ visits: [] });
    //Call the Service to get the latest data
    this.applyFilter();
  }
  applyFilter = () => {
    const { user: { access_token }, getVisits } = this.props;
    const { filter } = this.state;
    this.setState({ loading: true, modalVisible: false });
    getVisits({
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

  openGps = (lat, lng, address) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${address}@${latLng}`,
      android: `${scheme}${latLng}(${address})`
    });

    this.openExternalApp(url)
  }

  cancelVisit = (visit) => {
    const { user: { access_token }, cancelVisit } = this.props;
    cancelVisit({
      onError: alert,
      onSuccess: alert,
      data: {
        id: visit.id,
        status: "canceled"
      },
      token: access_token
    });
  }

  openExternalApp = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(
          'ERROR',
          'Unable to open: ' + url,
          [
            { text: 'OK' },
          ]
        );
      }
    });
  }

  renderList = () => {
    if (this.state.loading) {
      return <Spinner color='black' />;
    }
    return (
      <FlatList
        data={this.state.visits}
        enableEmptySections={true}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: "60%" }}
        renderItem={({ item, index }) => (
          <View key={index} style={[styles.container]}>
            {item.status != "Canceled" &&
            <View style={styles.child}>
              <Image resizeMode="cover" style={{ position: 'absolute', height: 80, width: 90 }}
                source={require('./../../../../assets/feature.png')}
              />
              <Text style={{ marginTop: 15, marginStart: 5, alignSelf: 'flex-start', color: Colors.white, fontSize: 14, transform: [{ rotate: '-40deg' }] }} >{item.status}</Text>
              <View style={{ flexDirection: 'row', margin: 15, marginTop: 35 }}>
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                  <TitleText style={{ color: Colors.orange, fontWeight: 'bold', fontSize: 16, }} >Nook Code</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Date</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Time</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Partner Name</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Partner Number</TitleText>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={() => NavigationService.navigate("NookDetailScreen", item.nook)}>
                    <TitleText style={{ color: Colors.orange, fontWeight: 'bold', fontSize: 16, }} >{item.nook.nookCode}</TitleText>
                  </TouchableOpacity>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >{item.date}</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >{item.time}</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >{item.partner.name}</TitleText>
                  <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >{item.partner.number}</TitleText>
                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                { (item.status === 'Approved') && <Button onPress={() => this.openGps(item.nook.location.lat, item.nook.location.lng, item.nook.address)}>Get Direction</Button>}
              </View>
              <View style={{ justifyContent: 'center', marginBottom: 10 }}>
                {(item.status === 'Pending') && <Button onPress={() => this.cancelVisit(item)}>Cancel Visit</Button>}
              </View>
            </View>
          }
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
  renderFilterView = () => {
    const { modalVisible, statses, filter } = this.state;

    if (!modalVisible) {
      return;
    }

    return (
      <View style={{
        position: 'absolute',
        width: "70%",
        height: "82%",
        marginTop: "20%",
        alignSelf: 'flex-end',
        backgroundColor: "white"
      }}>
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
            source={require('./../../../../assets/close.png')}
          />
        </TouchableOpacity>
        <TitleText
          style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Filter</TitleText>


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
            <Picker.Item label="All Visits" value="" />
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
  };
  render() {
    const { filter: { status }, statses } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
        <Header backButton={false} optionButton={true} />
        <TitleText style={{ marginTop: 25, fontWeight: 'bold', fontSize: 20, }}>Visits</TitleText>
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 16, }}>
              {statses[status]} Visits
              </TitleText>
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
                source={require('./../../../../assets/filter.png')}
              />
            </TouchableOpacity>
          </View>
          {this.renderList()}
        </View>
        {this.renderFilterView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    height: 160,
    width: 160,
    marginBottom: 20,
    alignSelf: 'center'
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
    paddingBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 5,
  },
  child: {
    borderRadius: 15,
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
    visits: state.VisitsReducer.visits,
    user: state.AuthReducer.user,
  };
};

export default connect(
  mapStateToProps,
  {
    getVisits: actions.getVisits,
    cancelVisit: actions.cancelVisit,
  },
)(VisitsScreen);
