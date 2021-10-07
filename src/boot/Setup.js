import * as Expo from "expo";
import * as Font from 'expo-font'

import React, { Component } from "react";
import { StyleProvider } from "native-base";

import { Provider } from "react-redux";
import store from "../Store";

import App from "../App";
import getTheme from "../theme/components";

import variables from "../theme/variables/commonColor";
import { MenuProvider } from 'react-native-popup-menu';

export default class Setup extends Component {
    constructor() {
        super();
        this.state = {
            isReady: false
        };
    }

    componentDidMount() {
        this.loadFonts();
    }

    async loadFonts() {
        await Font.loadAsync({
            Roboto: require("../../node_modules/native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf"),
            // Ionicons: require("../../node_modules/@expo/vector-icons/Ionicons.ttf")
        });
        this.setState({ isReady: true });
    }
    render() {

        if (!this.state.isReady) {
            return <Expo.AppLoading />;
        }

        return (
            <MenuProvider>
                <Provider store={store}>
                    <StyleProvider style={getTheme(variables)}>
                        <App />
                    </StyleProvider>
                </Provider>
            </MenuProvider>
        );
    }
}
