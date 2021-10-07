import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Button as NativeButton, View } from 'native-base';


const TitleText = (props) => {
  let { children, style, containerStyle } = props;


  return (
    <View style={[styles.container, containerStyle || {}]}>
      <Text textAlign="center" style={{ ...style, }}>{children}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

});
export default TitleText;