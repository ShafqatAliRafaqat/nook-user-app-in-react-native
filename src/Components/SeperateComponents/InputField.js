import React from 'react';
import { StyleSheet } from 'react-native';
import { Item, Input, Icon, View, Text } from 'native-base';


const InputField = (props) => {

    let { children, style, regular, secureTextEntry, iconName, keyboardType, value, onChangeText, errorMessage } = props;
    //let {inputStyleMain} = style;
    let inputStyleMain = (style) ? style.inputStyleMain || {} : {};

    // const itemProps = { regular };
    let inputProps = props.inputProps || {};
    inputProps = { secureTextEntry, ...inputProps };

    return (
        <Item regular style={{ ...styles.container, ...inputStyleMain }}>
            <View style={styles.child}>
                <Input  {...inputProps} keyboardType={keyboardType} value={value} onChangeText={onChangeText} placeholder={children} />
                {/* <Icon name={iconName} /> */}
            </View>
            {(() => {
                if (errorMessage) {
                    return (
                        <View style={{ width: '100%' }}>
                            <Text style={styles.errorMessage}>{errorMessage}</Text>
                        </View>
                    )
                }
            })()}
        </Item>
    );
};
export default InputField;

const styles = StyleSheet.create({
    container: {
        borderColor: 'transparent',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.10,
        shadowRadius: 5,
        flexDirection: 'column',
    },
    child: {
        paddingStart: 15,
        paddingEnd: 15,
        flexDirection: 'row',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        // To round image corners
        overflow: 'hidden',
        borderColor: '#999',
        borderWidth: 0,
        backgroundColor: '#FFF',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.10,
        shadowRadius: 5,
        elevation: 3
    },
    errorMessage: {
        fontSize: 12,
        color: 'red',
        textAlign: 'left',
        paddingLeft: 20,
        marginTop: '2%'
    }
});