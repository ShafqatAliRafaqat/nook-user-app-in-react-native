import React from 'react';
import { connect } from "react-redux";
import {StyleSheet, View, ScrollView, Image, TouchableOpacity, RefreshControl, FlatList} from 'react-native';
import {Icon, Item, Picker, Spinner, Text} from "native-base";
import Colors from '../../../helper/Colors';
import Header from '../../SeperateComponents/Header';
import TitleText from '../../SeperateComponents/TitleText';
import Button from '../../SeperateComponents/Button';
import * as NavigationService from '../../../NavigationService';
import * as actions from "../../../Store/Actions/PaymentActions";

class PaymentsScreen extends React.Component {

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
      modalVisible: false,
      loading: true,
      filter: {
        status: '',
      },
      payments:[]
    };
  }
  componentDidMount() {
    const { user } = this.props;
    if (!user) {
      NavigationService.navigateAndResetStack('LoginScreen');
    }
    this.applyFilter();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.payments !== prevState.payments) {
      return { payments: nextProps.payments };
    }
    return null;
  }

  onRefresh() {
    //Clear old data of the list
    this.setState({ payments: [] });
    //Call the Service to get the latest data
    this.applyFilter();
  }
  applyFilter = () => {
    const {user: {access_token}, getPayments} = this.props;
    const {filter} = this.state;
    this.setState({loading: true,modalVisible: false});
    getPayments({
      onError: (error) => {
        alert(error);
        this.setState({loading: false});
      },
      onSuccess: () => {
        this.setState({loading: false});
      },
      filter,
      token: access_token
    });
  }


  renderList = ()=>{
    if (this.state.loading) {
      return <Spinner color='black'/>;
    }
    return (
        <View>
          {this.state.payments.length>0&&
                <FlatList
                    data={this.state.payments}
                    enableEmptySections={true}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: "60%"}}
                    renderItem={({ item }) => (
                        <View key={item.id} style={[styles.container]}>
                          <View style={styles.child}>
                            <Image resizeMode="cover" style={{ position: 'absolute', height: 80, width: 90 }}
                                   source={require('./../../../../assets/feature.png')}
                            />
                            <Text style={{ marginTop: 15, marginStart: 5, alignSelf: 'flex-start', color: Colors.white, fontSize: 14, transform: [{ rotate: '-40deg' }] }} >{item.status}</Text>
                            <View style={{ flexDirection: 'row', margin: 15, marginTop: 35 }}>
                              <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                <TitleText style={{color: Colors.orange, fontWeight: 'bold', fontSize: 16,}} />
                                <TitleText style={{ color: Colors.orange, fontWeight: 'bold', fontSize: 16, }} >ID</TitleText>
                                <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Receipt ID</TitleText>
                                <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Payment Method</TitleText>
                              </View>
                              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <TitleText style={{ color: Colors.orange, fontWeight: 'bold', fontSize: 16, }} >{item.amount} PKR</TitleText>
                                <TitleText style={{ color: Colors.orange, fontWeight: 'bold', fontSize: 16, }} >{item.id}</TitleText>
                                <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >{item.receipt_id}</TitleText>
                                <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >{item.payment_method}</TitleText>
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
              }
        </View>
    );
  };

  renderFilterView = () => {
    const {modalVisible, statses, filter} = this.state;

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
            this.setState({modalVisible: false})
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
              style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: 5}}>Filter</TitleText>


          <Item picker style={styles.pickerStyle}>
            <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down"/>}
                style={{width: "100%"}}
                placeholder="Room Catagories"
                placeholderStyle={{color: "#bfc6ea"}}
                placeholderIconColor="#007aff"
                selectedValue={filter.status}
                onValueChange={status => this.setState({filter: {...filter, status}})}>
              <Picker.Item label="All Payments" value=""/>
              {Object.keys(statses)
                  .filter(k => k)
                  .map(k => <Picker.Item key={k} label={statses[k]} value={k}/>)}
            </Picker>
          </Item>

          <View style={{justifyContent: 'center'}}>
            <Button onPress={this.applyFilter}>Apply Filter</Button>
          </View>

        </View>
    );
  }
  render() {
    const {filter: {status}, statses} = this.state;

    return (
        <View style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
          <Header backButton={true}/>
          <TitleText style={{marginTop: 25, fontWeight: 'bold', fontSize: 20,}}>Payments</TitleText>
          <View style={{padding: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
              <TitleText style={{alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 16,}}>
                {statses[status]} Payments
              </TitleText>
              <TouchableOpacity onPress={() => {
                this.setState({modalVisible: true})
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
    paddingStart:5,
    paddingEnd:5,
    paddingTop:5,
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
})


const mapStateToProps = state => {
  return {
    payments: state.PaymentReducer.payments,
    user: state.AuthReducer.user,
  };
};

export default connect(
  mapStateToProps,
    {
        getPayments: actions.getPayments,
    },
)(PaymentsScreen);
