import React from 'react';
import { connect } from "react-redux";
import { StyleSheet, View } from 'react-native';
import Button from '../../SeperateComponents/Button';
import InputField from '../../SeperateComponents/InputField';
import Header from '../../SeperateComponents/Header'
import TitleText from '../../SeperateComponents/TitleText'
import * as NavigationService from '../../../NavigationService';
import Colors from '../../../helper/Colors';
import * as actions from '../../../Store/Actions/AuthActions';
import { Button as NativeBaseButton, Text } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

class NumberVerificationScreen extends React.Component {

  state = {
    code: ''
  };

  componentDidMount = () => {
    this.sendCode();
  }

  sendCode = (userAction = false) => {
    const {
      sendNumberVerificationCode,
      user: {
        access_token: token
      }
    } = this.props;

    sendNumberVerificationCode({
      token,
      onSuccess: () => {
        if(userAction){
          alert('Code was sent Successfully.');
        }
      },
      onError: alert
    });
  }

  toggleSubmitting = () => {
    const {submitting} = this.state;
    this.setState({
      submitting:!submitting,
    });
  };

  verifyNumber = () => {

    const {
      verifyNumber,
      user: {
        access_token: token
      }
    } = this.props;

    const { code } = this.state;

    if (!code) {
      return alert('Code is Required');
    }

    this.toggleSubmitting();
    verifyNumber({
      data: { code },
      token,
      onSuccess: () => {
        NavigationService.navigateAndResetStack("TabScreens");
      },onError: message => {
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

  render() {
    const { code,submitting } = this.state;
    const { user: { number } } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
        <Header homeButton={true}/>
        <View style={styles.container}>
          <View style={styles.child}>
            <TitleText style={{ marginTop: 25, fontWeight: 'bold', fontSize: 20, }} >Verify Number!</TitleText>
            <TitleText containerStyle={{alignItems: 'flex-start',}} style={{ margin: 15, marginBottom: 0, fontSize: 16, }}>Number Verification code is send to your number {number}</TitleText>
            {this.renderRecendCodeButton()}
            <View style={{ marginTop: 15, marginStart: '5%', marginEnd: '5%' }}>
              <InputField iconName="md-phone-portrait" value={code} onChangeText={code => this.setState({ code })}>Code</InputField>
            </View>
            <View style={{ justifyContent: 'center', marginTop: 20, marginBottom: 20, }}>
              <Button disabled={submitting} onPress={this.verifyNumber} >{submitting ? 'Please wait...':'Verify Number'}</Button>
            </View>
          </View>
        </View>
      </View >
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

const mapStateToProps = state => {
  return {
    user: state.AuthReducer.user,
  };
};

export default connect(
  mapStateToProps,
  {
    sendNumberVerificationCode: actions.sendNumberVerificationCode,
    verifyNumber: actions.verifyNumber,
  }
)(NumberVerificationScreen);
