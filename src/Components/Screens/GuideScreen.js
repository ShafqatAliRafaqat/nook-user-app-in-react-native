import React from 'react';

import { connect } from "react-redux";
import { Button, Text as NativeText } from 'native-base';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as NavigationService from '../../NavigationService'
import Swiper from 'react-native-swiper'
import Colors from '../../helper/Colors';

class GuideScreen extends React.Component {

  movetoHome = () => {
    NavigationService.navigateAndResetStack('LoginScreen');
  }
  
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.backgroundColor, }}>
        <View style={styles.header}>
        </View>
        <View style={styles.container}>
          <View style={styles.child}>
            

            <Swiper style={styles.wrapper} showsButtons={false}>
              <View style={styles.slide}>
                <Image style={styles.slideItem}
                  source={require('./../../../assets/welcome/1.png')}
                />
              </View>
              <View style={styles.slide}>
              <Image style={styles.slideItem}
                  source={require('./../../../assets/welcome/2.png')}
                />
              </View>
              <View style={styles.slide}>
              <Image style={styles.slideItem}
                  source={require('./../../../assets/welcome/3.png')}
                />
                <Button style={{alignSelf: 'center', backgroundColor: Colors.orange }} primary onPress={this.movetoHome}><NativeText> Get Started </NativeText></Button>
              </View>
            </Swiper>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
  },
  slide: {
    width: '100%',
    height: '100%',
  },
  header: {
    paddingStart: 25,
    paddingEnd: 25,
    flexDirection: 'row',
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingTop: 25,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    overflow: 'hidden',
    borderColor: '#999',
    borderWidth: 0,
    // Android shadow
    elevation: 3
  },
  slideItem: {
    width: '100%',
    height: '80%',
  },
  text: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold'
  },
  container: {
    flex: 1, margin: 25,
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
    user: state.AuthReducer.user
  };
};

export default connect(
  mapStateToProps,
  null
)(GuideScreen);