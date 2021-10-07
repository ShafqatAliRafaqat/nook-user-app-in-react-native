import React from 'react';
import { connect } from "react-redux";
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Button as NativeButton, Icon } from 'native-base';
import Constants from 'expo-constants';
import * as NavigationService from '../../NavigationService';
import * as actions from '../../Store/Actions/AuthActions';

import { BackHandler } from 'react-native';

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import TitleText from './TitleText';


const renderAuthLinks = ({ user,logout }) => {

    const logoutUser = () => {
        // NavigationService.navigateAndResetStack('LoginScreen'); // TODO remove me after fb and google sign in
        logout({
            token:user.access_token,
            onError: (error) => {
                console.log({error});
                NavigationService.navigateAndResetStack('LoginScreen')
            },
            onSuccess: () => {
                NavigationService.navigateAndResetStack('LoginScreen')
            }
        });
    };

    if (user) {
        return (
            <MenuOption onSelect={logoutUser} >
                <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10, marginStart: 5 }}>
                    <Image resizeMode="contain" style={{ height: 20, width: 20, }}
                        source={require('./../../../assets/logout.png')}
                    />
                    <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 16, marginStart: 10 }} >
                        Logout
                    </TitleText>
                </View>
            </MenuOption>
        );
    }

    return (
        <MenuOption onSelect={() => NavigationService.navigateAndResetStack('LoginScreen')} >
            <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10, marginStart: 5 }}>
                <Image resizeMode="contain" style={{ height: 20, width: 20, }}
                    source={require('./../../../assets/logout.png')}
                />
                <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 16, marginStart: 10 }} >
                    Login
                </TitleText>
            </View>
        </MenuOption>
    );
}

const Header = (props) => {

    let skipButton = null;
    let options = null;
    let optionsView = null;
    let backButton = true;
    if (props.skipButton)
        skipButton = <TouchableOpacity style={styles.buttonStyle} transparent>
            <Text style={{ textDecorationLine: 'underline' }} onPress={props.skipButton}>Skip</Text>
        </TouchableOpacity>;
    if (props.optionButton)
        options = <TouchableOpacity style={styles.buttonStyle} transparent>
            <Menu>
                <MenuTrigger >
                    <Image resizeMode="contain" style={[styles.buttonStyle, { height: 20, width: 20, }]}
                        source={require('./../../../assets/vertical_dot.png')}
                    />
                </MenuTrigger>
                <MenuOptions>
                    {renderAuthLinks(props)}
                    <MenuOption onSelect={() => BackHandler.exitApp()} >
                        <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10, marginStart: 5 }}>
                            <Image resizeMode="contain" style={{ height: 20, width: 20, }}
                                source={require('./../../../assets/exit.png')}
                            />
                            <TitleText style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 16, marginStart: 10 }} >
                                Exit
                            </TitleText>
                        </View>
                    </MenuOption>

                </MenuOptions>
            </Menu>
        </TouchableOpacity>
    if (props.backButton) {
        backButton = <TouchableOpacity onPress={() => { NavigationService.goBack() }} style={styles.buttonStyle} transparent>
            <Icon name='arrow-back' />
        </TouchableOpacity>
    }else{
        optionsView = <>
        {options}
                {skipButton}
                </>
    }

    if (props.homeButton) {
        backButton = <TouchableOpacity onPress={() => { NavigationService.navigateAndResetStack("TabScreens") }} style={styles.buttonStyle} transparent>
            <Icon name='arrow-back' />
        </TouchableOpacity>
    }
    return (
        <View style={styles.container}>

            <View style={{ flex: 1, marginStart: 5, alignItems: 'flex-start' }}>
                {backButton}
                {optionsView}
            </View>
            
            <View style={{ flex: 1, alignItems: 'center' }}>
                <TitleText
                        style={{ fontWeight: 'bold', fontSize: 20 }}>Nooks
                </TitleText>
            </View>

            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                {props.children}
            </View>
            
        </View>
    );
};


const styles = StyleSheet.create({
    buttonStyle: {
        margin: 10,
        marginTop: 12,
        marginBottom: 12,
    },
    container: {
        height: 60,
        marginTop: Constants.statusBarHeight,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        overflow: 'hidden',
        borderColor: '#999',
        borderWidth: 0,
        // Android shadow
        elevation: 10
    },
});

const mapStateToProps = state => {
    return {
        user: state.AuthReducer.user
    };
};

export default connect(
    mapStateToProps,
    { logout: actions.logout }
)(Header);
