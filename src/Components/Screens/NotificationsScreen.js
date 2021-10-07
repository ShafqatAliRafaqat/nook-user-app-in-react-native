import React from 'react';
import { connect } from "react-redux";
import { StyleSheet, Text, View, RefreshControl, FlatList } from 'react-native';
import {  Spinner } from "native-base";
import Colors from '../../helper/Colors';
import Header from '../SeperateComponents/Header';
import TitleText from '../SeperateComponents/TitleText';
import * as NavigationService from '../../NavigationService';
import * as actions from '../../Store/Actions/NotificationActions';

class NotificationsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.applyFilter();
  }

  onRefresh() {
    this.applyFilter();
  }

  applyFilter = () => {
    const { user: { access_token }, getNotifications } = this.props;
    this.setState({ loading: true, modalVisible: false });
    getNotifications({
      onError: (error) => {
        alert(error);
        this.setState({ loading: false });
      },
      onSuccess: () => {
        this.setState({ loading: false });
      },
      filter:{},
      token: access_token
    });
  }


  renderNotifications = () => {

    if (this.state.loading) {
      return <Spinner color='black' />;
    }

    return (
      <FlatList
        data={this.props.notifications}
        enableEmptySections={true}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: "50%" }}
        renderItem={({ item, index }) => (
          <View key={index} style={[styles.container]}>
            <View style={styles.child}>
              <View style={{ flexDirection: 'row', margin: 15 }}>
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <TitleText style={{ color: Colors.orange, fontWeight: 'bold', fontSize: 16, }} >{item.title}</TitleText>
                </View>
              </View>
              <View style={{ justifyContent: 'center', margin: 15, marginTop:0 }}>
                <Text >{item.body}</Text>
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


  toggleSubmitting = () => {
    const { submitting } = this.state;
    this.setState({
      submitting: !submitting,
    });
  };

  moveToHome = () => {
    NavigationService.navigateAndResetStack("TabScreens");
  };

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
        <Header backButton={true} />
        <TitleText style={{ marginTop: 25, fontWeight: 'bold', fontSize: 20, }} >Notifications</TitleText>
        <View style={{ padding: 20 }}>
          {this.renderNotifications()}
        </View>
      </View >
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
    notifications: state.NotificationsReducer.notifications,
    user: state.AuthReducer.user,
  };
};

export default connect(
  mapStateToProps,
  {
    getNotifications: actions.getNotifications
  },
)(NotificationsScreen);
