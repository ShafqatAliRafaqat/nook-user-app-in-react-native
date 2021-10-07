import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Icon, Drawer, Button, Card, CardItem } from "native-base";
import { DrawerItems } from 'react-navigation';
import Header from '../SeperateComponents/Header';
import TitleText from '../SeperateComponents/TitleText';
import * as NavigationService from '../../NavigationService';
import Colors from '../../helper/Colors';
import { AirbnbRating } from 'react-native-ratings';

class NookListScreen extends React.Component {
  render() {



    return (
      <View style={{ flex: 1, backgroundColor: Colors.backgroundColor, }}>
        <Header />
        <TitleText style={{ marginTop: 25, fontWeight: 'bold', fontSize: 20, }} >Nook</TitleText>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button warning style={{ marginStart: 25, }} onPress={() => { NavigationService.navigate("AddNookScreen") }}>
            <View style={{ margin: 10, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', color: Colors.white, fontSize: 16 }}>Add</Text>
              <Image style={{ width: 30, height: 30, marginStart: 5 }}
                source={require('./../../../assets/add.png')}
              />
            </View>
          </Button>
          <Image style={{
            width: 30,
            height: 30,
            marginEnd: 25,
            marginBottom: 5,
            alignSelf: 'flex-end'
          }}
            source={require('./../../../assets/filter.png')}
          />
        </View>
        <ScrollView style={{ marginTop: 10 }}>
          <View style={styles.container}>
            <View style={styles.child}>
              <Image style={{ position: 'absolute', }}
                source={require('./../../../assets/feature.png')}
              />
              <Text style={{ padding: 10, paddingStart: 20, paddingEnd: 20, alignSelf: 'flex-end', color: Colors.white, fontWeight: 'bold', backgroundColor: Colors.primaryColor, fontSize: 14, position: 'absolute', }} >Bed</Text>
              <Text style={{ marginTop: 12, alignSelf: 'flex-start', color: Colors.white, fontSize: 14, transform: [{ rotate: '-40deg' }] }} >pending</Text>

              <View style={{ margin: 20 }}>
                <Card>
                  <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>Type</Text>
                    <Text>Price</Text>
                  </View>
                  <CardItem cardBody>
                    <Image source={require('./../../../assets/test_image.jpeg')} style={{ height: 200, width: null, flex: 1 }} />
                    <View style={{ position: 'absolute', bottom: 8, left: 10 }}>
                      <AirbnbRating showRating={false} size={15} />
                    </View>
                  </CardItem>
                </Card>
                <TitleText style={{ marginTop: 10, fontSize: 20, }} >NK-123</TitleText>
              </View>
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.child}>
              <Image style={{ position: 'absolute', }}
                source={require('./../../../assets/feature.png')}
              />
              <Text style={{ padding: 10, paddingStart: 20, paddingEnd: 20, alignSelf: 'flex-end', color: Colors.white, fontWeight: 'bold', backgroundColor: Colors.primaryColor, fontSize: 14, position: 'absolute', }} >Bed</Text>
              <Text style={{ marginTop: 12, alignSelf: 'flex-start', color: Colors.white, fontSize: 14, transform: [{ rotate: '-40deg' }] }} >pending</Text>

              <View style={{ margin: 20 }}>
                <Card>
                  <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>Type</Text>
                    <Text>Price</Text>
                  </View>
                  <CardItem cardBody>
                    <Image source={require('./../../../assets/test_image.jpeg')} style={{ height: 200, width: null, flex: 1 }} />
                    <View style={{ position: 'absolute', bottom: 8, left: 10 }}>
                      <AirbnbRating showRating={false} size={15} />
                    </View>
                  </CardItem>
                </Card>
                <TitleText style={{ marginTop: 10, fontSize: 20, }} >NK-123</TitleText>
              </View>
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.child}>
              <Image style={{ position: 'absolute', }}
                source={require('./../../../assets/feature.png')}
              />
              <Text style={{ padding: 10, paddingStart: 20, paddingEnd: 20, alignSelf: 'flex-end', color: Colors.white, fontWeight: 'bold', backgroundColor: Colors.primaryColor, fontSize: 14, position: 'absolute', }} >Bed</Text>
              <Text style={{ marginTop: 12, alignSelf: 'flex-start', color: Colors.white, fontSize: 14, transform: [{ rotate: '-40deg' }] }} >pending</Text>

              <View style={{ margin: 20 }}>
                <Card>
                  <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>Type</Text>
                    <Text>Price</Text>
                  </View>
                  <CardItem cardBody>
                    <Image source={require('./../../../assets/test_image.jpeg')} style={{ height: 200, width: null, flex: 1 }} />
                    <View style={{ position: 'absolute', bottom: 8, left: 10 }}>
                      <AirbnbRating showRating={false} size={15} />
                    </View>
                  </CardItem>
                </Card>
                <TitleText style={{ marginTop: 10, fontSize: 20, }} >NK-123</TitleText>
              </View>
            </View>
          </View>
        </ScrollView>
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
    flex: 1, padding: 25,
    paddingTop: 10,
    paddingBottom: 10,
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


export default NookListScreen