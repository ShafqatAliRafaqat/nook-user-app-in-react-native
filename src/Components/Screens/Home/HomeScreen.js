import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    RefreshControl,
    FlatList
} from 'react-native';
import { Icon, Drawer, Card, CardItem, Spinner, Item, Picker, Button as NativeButton, } from "native-base";
import Header from '../../SeperateComponents/Header';
import TitleText from '../../SeperateComponents/TitleText';
import * as NavigationService from '../../../NavigationService';
import Colors from '../../../helper/Colors';
import styles from './styles';
import MapView, { AnimatedRegion, Animated } from 'react-native-maps';
import { Marker } from 'react-native-maps';

import PopupDialog from 'react-native-popup-dialog';
import Button from '../../SeperateComponents/Button';
import * as actions from "../../../Store/Actions/NookActions";
import { connect } from "react-redux";
import { calculateDistance } from '../../../helper/locationHelper';

class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 4,
            isMap: true,
            isDialogVisible: false,
            markers: {
                latlng: {
                    latitude: 31.4697,
                    longitude: 74.2728,
                },
                title: "",
                description: ""
            },
            filter: {
                space_type: 'shared',
                type: '',
                gender: ''
            },
            loading: true,
            modalVisible: false,
            nooks:[],
            filters: {
                type: {
                    'house': 'House',
                    'flat': 'Flat',
                    'independentRoom': 'Independent Room',
                    'hostelBuilding': 'Hostel Building',
                    'outHouse': 'Out House',
                    'other': 'Other'
                },
                gender: {
                    'male': 'Male',
                    'female': 'Female',
                    'both': 'Both'
                },
                space_type: {
                    'shared': 'Shared',
                    'independent': 'Independent'
                }
            }
        }
    }

    componentDidMount() {
        this.applyFilter();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.nooks !== prevState.nooks) {
          return { nooks: nextProps.nooks };
        }
        return null;
    }

    onRefresh() {
        //Clear old data of the list
        this.setState({ nooks: [] });
        //Call the Service to get the latest data
        this.applyFilter();
    }
    applyFilter = () => {
        const { getPublicNooks } = this.props;
        const { filter } = this.state;
        this.setState({ loading: true, modalVisible: false });
        getPublicNooks({
            onError: (error) => {
                alert(error);
                this.setState({ loading: false });
            },
            onSuccess: () => {
                this.setState({ loading: false });
            },
            filter
        });
    }


    componentDidUpdate(){
        const { desiredLocation } = this.props;
        if(desiredLocation){

            const point = {
                latitude: desiredLocation.lat,
                longitude: desiredLocation.lng,
            };

            if(this.myMap){
                this.myMap.animateCamera({
                    center: point
                },2000)
            }
        }
    }

    renderDesiredLocationMarker = () => {
        const { desiredLocation } = this.props;
        if(desiredLocation){

            const point = {
                latitude: desiredLocation.lat,
                longitude: desiredLocation.lng,
            };
            return (
                <Marker
                    title="Desired Location" 
                    coordinate={point}
                />
            )
        }
    }

    mapView = () => {

        const { nooks, desiredLocation } = this.props;
        const { loading, selectedNook } = this.state;

        let locationAddress = 'Enter desired location';

        if (desiredLocation) {
            locationAddress = desiredLocation.address || locationAddress;
        }

        if (loading) {
            return <Spinner color='black' />;
        }

        let distance = '';
        if (desiredLocation && selectedNook) {
            distance = calculateDistance(desiredLocation, selectedNook.location)
        }
        return (<View style={{ flex: 1 }}>

            <MapView 
            ref = {(myMap) => { this.myMap = myMap; }}
            initialRegion={{
                ...this.state.markers.latlng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }} style={styles.mapStyle}>
                {nooks.filter(nook => nook.location).map((nook) => {
                    return (
                        <Marker key={nook.id} onPress={(coordinate, points) => {
                            this.setState({ isDialogVisible: true, selectedNook: nook });
                        }}
                            coordinate={{
                                latitude: nook.location.lat,
                                longitude: nook.location.lng,
                            }}
                        >
                            <Image
                                source={require('./../../../../assets/marker.png')}
                                style={{ width: 40, height: 62 }}
                            />
                            </Marker>
                    );
                })}
                {this.renderDesiredLocationMarker()}
            </MapView>
            <TouchableOpacity onPress={() => NavigationService.navigate("GooglePlacesInput",this.state.markers.latlng)} // todo update this.state.markers.latlng with current location for better results
                style={[styles.container, { width: "100%", flex: 0, position: 'absolute' }]}>
                <View style={[styles.child, {
                    borderRadius: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingStart: 20
                }]}>
                    <Image resizeMode="contain" source={require('./../../../../assets/search.png')}
                        style={{ height: 20, width: 20, }} />
                    <Text style={{ margin: 15, }}>{locationAddress}</Text>
                </View>
            </TouchableOpacity>
            {selectedNook && <PopupDialog
                width={0.9} height={0.75}
                ref={"popupDialog"}
                visible={this.state.isDialogVisible}
                onTouchOutside={() => {
                    this.setState({ isDialogVisible: false });
                }}>
                <View style={{ flex: 1, padding: 15, }}>
                    <TouchableOpacity onPress={() => {
                        this.setState({ isDialogVisible: false });
                    }}>
                        <Image resizeMode="contain" source={require('./../../../../assets/close.png')}
                            style={{ height: 25, width: 25, alignSelf: 'flex-end' }} />
                    </TouchableOpacity>
                    <TitleText
                        style={{ marginTop: 5, fontWeight: 'bold', fontSize: 16, }}>{selectedNook.nookCode}</TitleText>
                    {selectedNook.medias[0] && <Image resizeMode="contain" source={{ uri: selectedNook.medias[0].path }}
                        style={{ borderRadius: 5, height: 200, width: null }} />}
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <TitleText style={{ fontWeight: 'bold', fontSize: 16, }}>Price</TitleText>
                            {(() => {
                                if (distance) {
                                    return <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, }}>Distance</TitleText>;
                                }
                            })()}
                            <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, }}>Gender</TitleText>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <TitleText style={{
                                fontWeight: 'bold',
                                fontSize: 16,
                            }}>PKR {selectedNook.rent && selectedNook.rent !== '0' ? selectedNook.rent : ( selectedNook.rooms.length != 0)? Math.min(...selectedNook.rooms.map(r => r.price_per_bed)):'' }</TitleText>
                            {(() => {
                                if (distance) {
                                    return <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, }}>{distance} km</TitleText>
                                }
                            })()}
                            <TitleText style={{
                                marginTop: 15,
                                fontWeight: 'bold',
                                fontSize: 16,
                            }}>{selectedNook.gender_type}</TitleText>
                        </View>
                    </View>
                    <Button onPress={() => {
            this.setState({ isDialogVisible: false });
            NavigationService.navigate("NookDetailScreen",selectedNook)
          }}>See More</Button>
                </View>
            </PopupDialog>
            }

        </View>)
    }
    renderListCardDistance = (selectedNook) =>{
        const {  desiredLocation } = this.props;
        const { loading } = this.state;

        let locationAddress = 'Enter desired location';

        if (desiredLocation) {
            locationAddress = desiredLocation.address || locationAddress;
        }

        if (this.state.loading) {
            return <Spinner color='black' />;
        }
        let distance = '';

        if (desiredLocation && selectedNook) {
            distance = calculateDistance(desiredLocation, selectedNook.location)
        }
        if(distance){
            return(
                <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, }}>Distance</TitleText>
                    <TitleText style={{ marginTop: 15, fontWeight: 'bold', fontSize: 16, }}>{distance} KM</TitleText>
                </View>
            );
        }
    }
    listView = () => {

        
        const {  desiredLocation, user } = this.props;
        const { loading, selectedNook } = this.state;

        let locationAddress = 'Enter desired location';
        let screen = (!user)? 'LoginScreen' : 'AddNookScreen';
        if (desiredLocation) {
            locationAddress = desiredLocation.address || locationAddress;
        }

        if (this.state.loading) {
            return true;
            // return <Spinner color='black' />;
        }
        return (
            <View style={{ flex: 1, flexDirection: "column" }}>

                <TouchableOpacity style={[styles.container, { flex: 0}]} onPress={() => NavigationService.navigate("GooglePlacesInput",this.state.markers.latlng)}>
                    <View style={[styles.child, {
                        borderRadius: 30,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingStart: 20
                    }]}>
                        <Image resizeMode="contain" source={require('./../../../../assets/search.png')}
                            style={{ height: 20, width: 20, }} />
                        <Text style={{ margin: 15, }}>{locationAddress}</Text>
                    </View>
                </TouchableOpacity>
                <NativeButton
                    color ={Colors.orange}
                    style={{ marginStart: 25 , backgroundColor:Colors.orange}}
                    onPress={() => {
                        NavigationService.navigate(screen);
                      }}
                    >
                    <View
                        style={{
                        margin: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        }}
                    >
                        <Text
                        style={{
                            fontWeight: "bold",
                            color: Colors.white,
                            fontSize: 16,
                        }}
                        >
                        Add
                        </Text>
                        <Image
                        style={{ width: 30, height: 30, marginStart: 5 }}
                        source={require("./../../../../assets/add.png")}
                        />
                    </View>
                    </NativeButton>

                <FlatList
                    data={this.state.nooks}
                    enableEmptySections={true}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: "5%", marginTop: 10 }}
                    renderItem={({ item,index }) => (
                        <View style={styles.container} key={index}>
                            <TouchableOpacity style={styles.child} onPress={() => {
                                this.setState({ isDialogVisible: false });
                                NavigationService.navigate("NookDetailScreen", item)
                            }}>
                                
                                {this.renderListCardDistance(item)}

                                <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>{item.type} </Text>
                                    <Text>PKR {item.rent && item.rent !== '0' ? item.rent : (item.rooms.length != 0 ) ?  Math.min(...item.rooms.map(r => r.price_per_bed)):''}</Text>
                                </View>
                                <CardItem cardBody>
                                    {
                                        item.medias.map((m, index) => {
                                                if (index === 0) {
                                                    return <Image key={index} resizeMode="contain" source={{
                                                        uri: m.path
                                                    }
                                                    } style={{ height: 200, width: null, flex: 1 }} />
                                                }
                                            }
                                        )
                                    }
                                </CardItem>
                                <TitleText
                                    style={{ marginTop: 10, marginBottom: 10, fontSize: 20, }}>{item.nookCode}</TitleText>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        )
    };

    renderFilterView = () => {
        const { modalVisible, filters, filter } = this.state;

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
                    this.setState({ modalVisible: false })
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
                    style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Filter</TitleText>


                <Item picker style={styles.pickerStyle}>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: "100%" }}
                        placeholder="Select Nook Type"
                        placeholderStyle={{ color: "black" }}
                        placeholderIconColor="#007aff"
                        selectedValue={filter.type}
                        onValueChange={type => this.setState({
                            filter: { ...filter, type }
                        }, () => {
                            console.log('filter', this.state.filter);
                        })}>
                        <Picker.Item label="All Types" value="" />
                        {Object.keys(filters.type)
                            .filter(k => k)
                            .map(k => <Picker.Item key={k} label={filters.type[k]} value={k} />)}
                    </Picker>
                </Item>
                <Item picker style={styles.pickerStyle}>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: "100%" }}
                        placeholder="Select Gender"
                        placeholderStyle={{ color: "black" }}
                        placeholderIconColor="#007aff"
                        selectedValue={filter.gender}
                        onValueChange={gender => this.setState({
                            filter: { ...filter, gender }
                        }, () => {
                            console.log('filter', this.state.filter);
                        })}>
                        {Object.keys(filters.gender)
                            .filter(k => k)
                            .map(k => <Picker.Item key={k} label={filters.gender[k]} value={k} />)}
                    </Picker>
                </Item>
                <Item picker style={styles.pickerStyle}>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: "100%" }}
                        placeholder="Select Space Type"
                        placeholderStyle={{ color: "black" }}
                        placeholderIconColor="#007aff"
                        selectedValue={filter.space_type}
                        onValueChange={space_type => this.setState({
                            filter: { ...filter, space_type }
                        }, () => {
                            console.log('filter', this.state.filter);
                        })}>
                        {Object.keys(filters.space_type)
                            .filter(k => k)
                            .map(k => <Picker.Item key={k} label={filters.space_type[k]} value={k} />)}
                    </Picker>
                </Item>

                <View style={{ justifyContent: 'center' }}>
                    <Button onPress={this.applyFilter}>Apply Filter</Button>
                </View>

            </View>
        );
    }

    render() {

        let view;
        let tab1Color;
        let tab2Color;
        let tab1Icon;
        let tab2Icon;
        let tab3Color;
        let tab4Color;
        let tab3Icon;
        let tab4Icon;
        
        let ScrollViewComponent = ScrollView;

        if (this.state.isMap) {
            // view = this.mapView();
            tab1Color = Colors.orange;
            tab2Color = Colors.white;
            tab1Icon = require('./../../../../assets/map_select.png');
            tab2Icon = require('./../../../../assets/option_unselect.png');
        } else {
            // view = this.listView();
            tab2Color = Colors.orange;
            tab1Color = Colors.white;
            tab1Icon = require('./../../../../assets/map_unselect.png');
            tab2Icon = require('./../../../../assets/option_select.png');
        }
        if (this.state.tabIndex === 3) {
            view = this.mapView();
            ScrollViewComponent = React.Fragment;
            tab3Color = Colors.orange;
            tab4Color = Colors.white;
            tab3Icon = require('./../../../../assets/icons8-individual-server-100.png');
            tab4Icon = require('./../../../../assets/icons8-shared-mailbox-100-yellow.png');
        } else if (this.state.tabIndex === 4) {
            view = this.mapView();
            ScrollViewComponent = React.Fragment;
            tab4Color = Colors.orange;
            tab3Color = Colors.white;
            tab3Icon = require('./../../../../assets/icons8-individual-server-100-yellow.png');
            tab4Icon = require('./../../../../assets/icons8-shared-mailbox-100.png');
        } else if (this.state.tabIndex === 5) {
            view = this.listView();
            tab3Color = Colors.orange;
            tab4Color = Colors.white;
            tab3Icon = require('./../../../../assets/icons8-individual-server-100.png');
            tab4Icon = require('./../../../../assets/icons8-shared-mailbox-100-yellow.png');
        } else {
            view = this.listView();
            tab4Color = Colors.orange;
            tab3Color = Colors.white;
            tab3Icon = require('./../../../../assets/icons8-individual-server-100-yellow.png');
            tab4Icon = require('./../../../../assets/icons8-shared-mailbox-100.png');
        }
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header backButton={false} optionButton={true} >
                    <TouchableOpacity onPress={() => {
                        this.setState({ modalVisible: true })
                    }} style={{ marginRight: 20 }}>
                        <Image style={{
                            width: 22,
                            height: 22,
                            alignSelf: 'flex-end'
                        }}
                            resizeMode="contain"
                            source={require('./../../../../assets/filter.png')}
                        />
                    </TouchableOpacity>
                    
                    </Header>
                <ScrollViewComponent
                    refreshControl={<RefreshControl
                        //refresh control used for the Pull to Refresh
                        refreshing={this.state.loading}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                    }
                >
                
                <View style={{ flexDirection: 'row', display: 'flex', width: '100%' }}>
                    <View style={{
                        backgroundColor: Colors.white, flexDirection: "row", display: 'flex', marginRight: 'auto',
                        borderRadius: 30, width: '30%', marginTop: 10
                    }}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => {
                                this.setState({ isMap: true, tabIndex: 3, })
                                this.setState({
                                    filter: {
                                        space_type: 'independent'
                                    }
                                }, () => {
                                    this.applyFilter();
                                });
                            }} style={[styles.tabButton, { backgroundColor: tab1Color }]}>
                                <Image resizeMode="contain" style={{
                                    width: 25,
                                    height: 15,
                                }}
                                    source={tab1Icon}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => {
                                this.setState({ isMap: false, tabIndex: 5, })
                                this.setState({
                                    filter: {
                                        space_type: 'independent'
                                    }
                                }, () => {
                                    this.applyFilter();
                                });
                            }} style={[styles.tabButton, { backgroundColor: tab2Color }]}>
                                <Image resizeMode="contain" style={{
                                    width: 25,
                                    height: 15,
                                }}
                                    source={tab2Icon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{
                        backgroundColor: Colors.white, flexDirection: "row", display: 'flex', marginLeft: 'auto',
                        borderRadius: 30, width: '65%', marginTop: 10
                    }}>
                        <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => {
                            if (this.state.isMap) {
                                this.setState({ tabIndex: 3 });
                                this.setState({
                                    filter: {
                                        space_type: 'independent'
                                    }
                                }, () => {
                                    this.applyFilter();
                                });
                            } else {
                                this.setState(({ tabIndex: 5 }));
                                this.setState({
                                    filter: {
                                        space_type: 'independent'
                                    }
                                }, () => {
                                    this.applyFilter();
                                });
                            }
                        }} style={[styles.tabButton, { backgroundColor: tab3Color }]}>
                            <Text style={{color:tab4Color}}>Family Nook</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => {
                            // this.setState({ tabIndex: 1 })
                            if (this.state.isMap) {
                                this.setState({ tabIndex: 4 });
                                this.setState({
                                    filter: {
                                        space_type: 'shared'
                                    }
                                }, () => {
                                    this.applyFilter();
                                });
                            } else {
                                console.log('list View shared');
                                this.setState({ tabIndex: 6 });
                                this.setState({
                                    filter: {
                                        space_type: 'shared'
                                    }
                                }, () => {
                                    this.applyFilter();
                                });
                            }
                        }} style={[styles.tabButton, { backgroundColor: tab4Color }]}>
                            
                            <Text style={{color:tab3Color}}>Shared Nook</Text>
                        </TouchableOpacity>
                    </View>

                    </View>

                </View>

                {/* <View style={{
                    backgroundColor: Colors.white,
                    borderRadius: 30,
                    flexDirection: "row",
                    marginTop: 10,
                    marginBottom: 10,
                    marginStart: 15,
                    marginEnd: 15
                }}>
                    
                </View> */}

                <View style={styles.tabContainer}>
                    {view}
                </View>
                {this.renderFilterView()}
                </ScrollViewComponent>
            </View>
        );

    }
}

const mapStateToProps = state => {
    return {
        nooks: state.NookReducer.nooks,
        user: state.AuthReducer.user,
        desiredLocation: state.NookReducer.desiredLocation,
    };
};

export default connect(
    mapStateToProps, {
    getPublicNooks: actions.getPublicNooks,
},
)(HomeScreen)
