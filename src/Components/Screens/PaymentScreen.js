import React from 'react';
import { connect } from "react-redux";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity } from 'react-native';
// import { Item, Input, Icon } from 'native-base';
import { Card, Text, Icon, Item, Picker } from 'native-base';
import Button from './../SeperateComponents/Button';
import Header from '../SeperateComponents/Header'
import TitleText from '../SeperateComponents/TitleText'
import Colors from '../../helper/Colors'
import PopupDialog from 'react-native-popup-dialog';

import * as NavigationService from '../../NavigationService';

class PaymentScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected2: "All Nooks",
      isDialogVisible: false,
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (!user) {
      NavigationService.navigateAndResetStack('LoginScreen');
    }
  }

  onValueChange2(value) {
    this.setState({
      selected2: value
    });
  }

  render() {

    return (

      <View style={{ flex: 1, backgroundColor: Colors.backgroundColor, }}>
        <Header backButton={true} optionButton={true} />
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1, padding: 25 }}>
            <TitleText style={{ fontWeight: 'bold', fontSize: 20, }} >Payments</TitleText>
            <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 16, }} >
              Rent Receipt
            </TitleText>
            <TouchableOpacity onPress={() => {
              this.setState({ isDialogVisible: true })
            }} style={[styles.container, { width: "100%", flex: 0, padding: 0, marginBottom: 15, marginTop: 15 }]}>
              <View style={[styles.child, { borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingStart: 10, paddingEnd: 15 }]}>
                <Text style={{ margin: 15, }}>10:30Pm</Text>
                <Image resizeMode="contain" source={require('./../../../assets/arrow_down.png')} style={{ height: 20, width: 20, }} />
              </View>
            </TouchableOpacity>
            <View style={[styles.container, {
              marginBottom: 10,
            }]}>
              <View style={styles.child}>
                <View style={styles.childItem}>
                  <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginRight: 10, marginBottom: 10, }} >
                    Detail
                    </TitleText>
                  <Text>Non in in labore fugiat ullamco. Irure laboris magna dolor esse nisi dolore. Elit commodo amet officia esse pariatur dolor minim non excepteur exercitation proident esse. Minim culpa ut est exercitation labore amet do laborum non. Lorem dolore eu non ea ullamco aliqua officia do adipisicing culpa incididunt voluptate.</Text>
                </View>
              </View>
            </View>
            <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 16, marginTop: 10, }} >
              Receipted by
            </TitleText>

            <Item picker style={styles.pickerStyle}>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: "100%" }}
                placeholder="Room Catagories"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selected2}
                onValueChange={this.onValueChange2.bind(this)}>
                <Picker.Item label="Muhammad Waqas" value="key0" />
                <Picker.Item label="Azeem Tariq" value="key1" />
                <Picker.Item label="Muhammad Awaise" value="key2" />
              </Picker>
            </Item>

            <View style={styles.container} >
              <View style={[styles.child, { height: 170, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }]}>
                <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20 }} >
                  Select Image
                </TitleText>
                <TouchableOpacity>
                  <Image style={{
                    width: 40,
                    height: 40,
                  }}
                    source={require('./../../../assets/add.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10, }}>
              <Button onPress={() => alert("Login")}  >Submit</Button>
            </View>
          </View>
        </ScrollView>
        <PopupDialog
          width={0.9} height={0.8}
          ref={"popupDialog"}
          visible={this.state.isDialogVisible}
          onTouchOutside={() => {
            this.setState({ isDialogVisible: false });
          }}>
          <View style={{ flex: 1, padding: 25, }}>
            <TouchableOpacity onPress={() => {
              this.setState({ isDialogVisible: false });
            }}>
              <Image resizeMode="contain" source={require('./../../../assets/close.png')} style={{ height: 25, width: 25, alignSelf: 'flex-end' }} />
            </TouchableOpacity>
            <ScrollView style={{ marginTop: 10 }}>
              <Card style={{ borderRadius: 10, padding: 15, backgroundColor: Colors.primaryColor }}>
                <View style={{ flex: 1, flexDirection: 'row', }}>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.orange }} >12500PKR</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.white }} >Late date charges</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.white }} >Due Date</TitleText>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.orange }} >Paid</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.white }} >100PKR/Day</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.white }} >02/02/2020</TitleText>
                  </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10, }}>
                  <Button onPress={() => alert("Login")}  >Submit</Button>
                </View>
              </Card>
              <Card style={{ borderRadius: 10, padding: 15 }}>
                <View style={{ flex: 1, flexDirection: 'row', }}>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.orange }} >12500PKR</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, }} >Late date charges</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, }} >Due Date</TitleText>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.orange }} >Paid</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, }} >100PKR/Day</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, }} >02/02/2020</TitleText>
                  </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10, }}>
                  <Button onPress={() => alert("Login")}  >Submit</Button>
                </View>
              </Card>
              <Card style={{ borderRadius: 10, padding: 15, backgroundColor: Colors.primaryColor }}>
                <View style={{ flex: 1, flexDirection: 'row', }}>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.orange }} >12500PKR</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.white }} >Late date charges</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.white }} >Due Date</TitleText>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.orange }} >Paid</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.white }} >100PKR/Day</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.white }} >02/02/2020</TitleText>
                  </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10, }}>
                  <Button onPress={() => alert("Login")}  >Submit</Button>
                </View>
              </Card>
              <Card style={{ borderRadius: 10, padding: 15 }}>
                <View style={{ flex: 1, flexDirection: 'row', }}>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.orange }} >12500PKR</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, }} >Late date charges</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, }} >Due Date</TitleText>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, color: Colors.orange }} >Paid</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, }} >100PKR/Day</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, }} >02/02/2020</TitleText>
                  </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10, }}>
                  <Button onPress={() => alert("Login")}  >Submit</Button>
                </View>
              </Card>
            </ScrollView>
          </View>
        </PopupDialog>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  pickerStyle: {
    marginBottom: 10,
    backgroundColor: Colors.white,
    borderRadius: 10, marginTop: 10,
  },
  childItem: {
    padding: 20,
  },
  container: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 5,
  },
  child: {
    flex: 1,
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
    user: state.AuthReducer.user,
  };
};

export default connect(
  mapStateToProps
)(PaymentScreen);
