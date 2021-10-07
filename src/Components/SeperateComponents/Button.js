import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as NativeButton, Text, View } from 'native-base';


const Button = (props) => {
  let { children, style } = props;

  let buttonStyle = (style) ? style.buttonStyle || {} : {};
  let labelStyle = (style) ? style.labelStyle || {} : {};

  return (
    <View style={{ paddingStart: 15, paddingEnd: 15 }}>
      <NativeButton onPress={props.onPress} warning full rounded  {...props} style={{ ...styles.buttonStyle, ...buttonStyle }}>
        <Text style={{ ...styles.labelStyle, ...labelStyle }}>{children}</Text>
      </NativeButton>
    </View>
  );
};


const styles = StyleSheet.create({

  buttonStyle: {
    marginTop: 15,
    // paddingStart:40,
    // paddingEnd:40,
    // flex: 1,
    // alignItems: 'center',
    // alignContent: 'center',
    // justifyContent: 'center',
  },
  labelStyle: {
    color: 'white',
    alignSelf: 'center'
  },

});
export default Button;