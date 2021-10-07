import React from 'react';
import { connect } from "react-redux";
import { StyleSheet, View, Image, TouchableOpacity, Platform } from 'react-native';
import { Text, Spinner } from 'native-base';
import Button from './../../SeperateComponents/Button';
import InputField from './../../SeperateComponents/InputField';
import Header from '../../SeperateComponents/Header'
import TitleText from '../../SeperateComponents/TitleText'
import * as NavigationService from '../../../NavigationService';
import Colors from '../../../helper/Colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as actions from '../../../Store/Actions/AuthActions';

class RegisterScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      number: '',
      password: '',
      confirmPassword: '',
      nameError: '',
      numberError: '',
      passwordError: '',
      confirmPasswordError: '',
      processing: false,
      submitting: false,
    };
  }

  toggleSubmitting = () => {
    const { submitting } = this.state;
    this.setState({
      submitting: !submitting,
    });
  };

  toggleProcessing = () => {
    const { processing } = this.state;
    this.setState({
      processing: !processing,
    });
  };

  handleSignup = () => {
    this.setState({
      nameError: '',
      numberError: '',
      passwordError: '',
      confirmPasswordError: ''
    });

    const { register } = this.props;

    const { name, number, password, confirmPassword } = this.state;

    if (name.length < 5 || name.length > 50) {
      return this.setState({
        nameError: "Name must be greater than 5 and less than 50."
      });
    }

    if (!number) {
      return this.setState({
        numberError: "Number is required."
      });
    }

    if (password.length < 6 || password.length > 50) {
      return this.setState({
        passwordError: "Password must be greater than 6 and less than 50."
      });
    }

    if (password !== confirmPassword) {
      return this.setState({
        confirmPasswordError: "Please type same password in both fields."
      });
    }
    this.toggleSubmitting();
    register({
      data: { name, number, password },
      onSuccess: () => {
        NavigationService.navigateAndResetStack("NumberVerificationScreen");
      },
      onError: message => {
        alert(message);
        this.toggleSubmitting();
      }
    });

  }

  socialLogin = (provider) => {
    const { socialLogin } = this.props;
    this.toggleProcessing();
    socialLogin({
      data: { provider },
      onSuccess: () => {
        NavigationService.navigateAndResetStack("TabScreens");
      },
      onError: (error) => {
        this.toggleProcessing();
        alert(error)
      }
    });
  };

  render() {

    const {
      name,
      number,
      submitting,
      nameError,
      numberError,
      passwordError,
      confirmPasswordError,
      processing
    } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
        <Header backButton={true} />
        <View style={styles.container}>
          <View style={styles.child}>
            <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 200 }} >
              <TitleText style={{ marginTop: 25, fontWeight: 'bold', fontSize: 20, }} >Sign Up</TitleText>
              <TitleText style={{ margin: 15, marginBottom: 10, fontSize: 16, }}>Sign up to continue Nook </TitleText>
              <View style={{ marginStart: '5%', marginEnd: '5%' }}>
                <InputField
                  onChangeText={name => this.setState({ name })}
                  iconName="person"
                  value={name}
                  errorMessage={nameError}
                >Name</InputField>
                <InputField
                  onChangeText={number => this.setState({ number })}
                  value={number}
                  iconName="md-phone-portrait"
                  errorMessage={numberError}
                >Number</InputField>
                <InputField
                  iconName="eye"
                  secureTextEntry
                  onChangeText={password => this.setState({ password })}
                  errorMessage={passwordError}
                >Password</InputField>
                <InputField
                  iconName="eye"
                  secureTextEntry
                  onChangeText={confirmPassword => this.setState({ confirmPassword })}
                  errorMessage={confirmPasswordError}
                >Confirm Password</InputField>
              </View>
              <View style={{ justifyContent: 'center', marginTop: 10 }}>
                <Button disabled={submitting} onPress={this.handleSignup} >{submitting ? 'Please wait...' : 'Sign Up'}</Button>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, flexDirection: 'row' }}>
                <Text>Already have an account? </Text><Text style={{
                  textDecorationLine: 'underline',
                }} onPress={() => NavigationService.goBack()}>Login!</Text>
              </View>
              <View style={{ marginTop: 20, alignItems: 'center', flexDirection: 'row', alignSelf: 'center', marginBottom: 140 }}>

                {processing && <Spinner color='black' />}
                
                {
                  !processing && Platform.OS !== 'ios' &&
                  <>
                    <TouchableOpacity onPress={() => this.socialLogin('facebook')}>
                      <Image style={{ marginEnd: 20, width: 40, height: 40, marginBottom: 20 }}
                        source={require('./../../../../assets/facebook.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.socialLogin('google')}>
                      <Image style={{ marginEnd: 20, width: 40, height: 40, marginBottom: 20 }}
                        source={require('./../../../../assets/google.png')}
                      />
                    </TouchableOpacity>
                  </>
                }

              </View>
            </KeyboardAwareScrollView>
          </View>

        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 25,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 5
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
    elevation: 3,
  }
})

export default connect(
  null,
  {
    register: actions.register,
    socialLogin: actions.socialLogin,
  }
)(RegisterScreen);
