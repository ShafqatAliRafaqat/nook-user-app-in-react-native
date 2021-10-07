import React from 'react';
import { connect } from "react-redux";
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
// import { Item, Input, Icon } from 'native-base';
import { Container, Content, Card, CardItem, Body, Text, Icon, Button as NativeButton } from 'native-base';
import Button from '../../SeperateComponents/Button';
import InputField from '../../SeperateComponents/InputField';
import Header from '../../SeperateComponents/Header'
import TitleText from '../../SeperateComponents/TitleText'
import * as NavigationService from '../../../NavigationService';
import Colors from '../../../helper/Colors';
import * as actions from '../../../Store/Actions/AuthActions';

class ForgotPasswordScreen extends React.Component {

  state = {
    view: 'sendCode',
    number: '',
    password: '',
    code: '',
  };

  toggleSubmitting = () => {
    const { submitting } = this.state;
    this.setState({
      submitting: !submitting,
    });
  };
  
  sendCode = (userAction = false) => {
    const { sendPasswordsResetCode } = this.props;
    const { number } = this.state;
    if (!number) {
      return alert('Number is Required');
    }

    this.toggleSubmitting();

    sendPasswordsResetCode({
      data: { number },
      onSuccess: (data) => {
        const { token } = data;
        this.setState({ view: 'changePassword', code: token, submitting: false, });
        
        if(userAction){
          alert('Code was sent Successfully.');
        }

      },
      onError: message => {
        alert(message);
        this.toggleSubmitting();
      }
    });
  };

  changePassword = () => {
    const { changePassword } = this.props;
    const { code, password, number } = this.state;

    if (!code) {
      return alert('Code is Required');
    }
    if (!password) {
      return alert('Password is Required');
    }
    this.toggleSubmitting();
    changePassword({
      data: { token: code, password, number },
      onSuccess: () => {
        NavigationService.navigateAndResetStack("LoginScreen");
        alert('Password Changed Successfully, you can login now');
      },
      onError: message => {
        alert(message);
        this.toggleSubmitting();
      }
    });
  };

  renderRecendCodeButton = () => {
    return (
      <TouchableOpacity onPress={() => this.sendCode(true)}>
        <TitleText containerStyle={{alignItems: 'flex-start',}} style={{ marginStart: 15, marginTop: 5, fontSize: 16, color:Colors.orange }}>
          Resend Code
        </TitleText>
      </TouchableOpacity>
    );
  }


  renderView = () => {
    const { view, number, code, password, submitting } = this.state;

    if (view === 'sendCode') {
      return (
        <>
          <TitleText style={{ marginTop: 25, fontWeight: 'bold', fontSize: 20, }} >Forgot Password!</TitleText>
          <TitleText containerStyle={{alignItems: 'flex-start',}} style={{ margin: 15, marginBottom: 0, fontSize: 16, }}>Enter your phone number (Required) </TitleText>

          <View style={{ marginTop: 30, marginStart: '5%', marginEnd: '5%' }}>
            <InputField iconName="md-phone-portrait" value={number} onChangeText={number => this.setState({ number })}>Number</InputField>
          </View>
          <View style={{ justifyContent: 'center', marginTop: 20, marginBottom: 20, }}>
            <Button disabled={submitting} onPress={this.sendCode} >{submitting ? 'Please wait...' : 'Send Code'}</Button>
          </View>
        </>
      );
    }
    if (view === 'changePassword') {
      return (
        <>
          <TitleText style={{ marginTop: 25, fontWeight: 'bold', fontSize: 20, }} >Forgot Password!</TitleText>
          <TitleText containerStyle={{alignItems: 'flex-start',}} style={{ margin: 15, marginBottom: 0, fontSize: 16, }}>Enter Verification Code to reset your Password ! </TitleText>
          {this.renderRecendCodeButton()}
          <View style={{ marginTop: 10, marginStart: '5%', marginEnd: '5%' }}>
            <InputField iconName="md-phone-portrait" value={code} onChangeText={code => this.setState({ code })}>Code</InputField>
            <InputField
              iconName="eye"
              secureTextEntry
              onChangeText={password => this.setState({ password })}
              value={password}
            >New Password</InputField>
          </View>
          <View style={{ justifyContent: 'center', marginTop: 20, marginBottom: 20, }}>
            <Button disabled={submitting} onPress={this.changePassword} >{submitting ? 'Please wait...' : 'Change Password'}</Button>
          </View>
        </>
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
        <Header backButton={true} />
        <View style={styles.container}>
          <View style={styles.child}>
            {this.renderView()}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, margin: 25,
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

export default connect(
  null,
  {
    sendPasswordsResetCode: actions.sendPasswordsResetCode,
    changePassword: actions.changePassword,
  }
)(ForgotPasswordScreen);
