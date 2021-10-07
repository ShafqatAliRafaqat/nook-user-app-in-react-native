import React from 'react';
import {
    Image, ScrollView,
    StyleSheet,
    View
} from 'react-native';
import {Spinner, Text} from "native-base";
import Colors from '../../../helper/Colors';
import Header from '../../SeperateComponents/Header';
import TitleText from '../../SeperateComponents/TitleText';
import Button from "../../SeperateComponents/Button";

class itemDetailsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            item: null
        };
    }
    Details = (item) => {
        return (
            <View style={styles.container}>
                <View style={styles.child}>
                    <View style={{ flexDirection: 'row', margin: 15 }}>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Sr#</TitleText>
                            <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Nook Code</TitleText>
                            <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Name</TitleText>
                            <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Room#</TitleText>
                            <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Date</TitleText>
                            <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16, }} >Month</TitleText>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={{ marginTop: 10, fontSize: 16, }} >{item.id}</Text>
                            <Text style={{ marginTop: 10, fontSize: 16, }} >{item.nook.nookCode}</Text>
                            <Text style={{ marginTop: 10, fontSize: 16, }} >{item.user.name}</Text>
                            <Text style={{ marginTop: 10, fontSize: 16, }} >{item.room_id}</Text>
                            <Text style={{ marginTop: 10, fontSize: 16, }} >{item.due_date}</Text>
                            <Text style={{ marginTop: 10, fontSize: 16, }} >{item.month}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };
    _row = (title, detail)=> {
       return( <View key={title} style={styles.container2}>
           <View style={styles.child2}>
               <View style={{ flexDirection: 'row', margin: 15 }}>
                   <View style={{ flex: 1, alignItems: 'flex-start',flexWrap: 'wrap' }}>
                       <TitleText style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16}} >{title}</TitleText>
                   </View>
                   <View style={{ flex: 1, alignItems: 'flex-end' }}>
                       <Text style={{ marginTop: 10, fontSize: 16, }} >{detail}</Text>
                   </View>
               </View>
           </View>
       </View>)
    };
    render() {
        const item = this.props.navigation.state.params;
        const {extras} = item;
        const fields = Object.keys(extras);
        return (
            <View style={{ flex: 1,backgroundColor: Colors.backgroundColor}}>
                <Header backButton={true}/>
                <TitleText style={{marginTop: 25, fontWeight: 'bold', fontSize: 20,}}>Nook</TitleText>
                <View style={{paddingStart: 20}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                        <TitleText style={{alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 16,}}>
                            Rent Receipt
                        </TitleText>
                    </View>
                </View>
                <ScrollView style={{ paddingBottom:20}}>
                    {this.Details(item)}
                    {this._row('Rent',item.rent)}
                    {this._row('Arrears',item.arrears)}
                    {this._row('AC','Unit Used  '+item.e_units)}
                    {this._row('AC','Unit Cost  '+item.e_unit_cost)}
                    {this._row('Total AC Bill',item.e_units*item.e_unit_cost)}
                    {this._row('Damage/Fine',item.fine)}
                    {fields.map(key => this._row(key,extras[key]))}
                    {this._row('Amount',item.amount)}
                    {this._row('Late Payment Charges',item.latePaymentCharges)}
                    {this._row('Total Amount ',item.total_amount)}
                    {this._row('Received ',item.received_amount)}
                    {this._row('Remaining Payable ',item.remaining_payable)}
                    <View style={{ marginTop:20}}>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1, padding: 25,
        paddingTop: 15,
        paddingBottom: 15,
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
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
        elevation: 3,
        paddingTop: 5,
        paddingBottom: 20,
    },
    addButton: {
        alignItems: 'center',
        backgroundColor: '#E59413',
        paddingTop: 10,
        paddingBottom: 10,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 5,
        marginStart: 5,
        marginEnd: 5,
        height: 65, width: '45%'
    },
    shiftButton: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#E59413',
        alignSelf: 'stretch',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'column',
        borderRadius: 5,
        marginStart: 5,
        marginEnd: 5,
        height: 65,marginTop:10,marginBottom:10
    },
    container2: {
        borderColor: 'transparent',
        paddingEnd: 25,paddingStart: 25,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.10,
        shadowRadius: 5,
        flexDirection: 'column',
    },
    child2: {
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
});


export default itemDetailsScreen;
