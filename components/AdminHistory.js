import React, { Component } from 'react';
import Constants from 'expo-constants';
import { StyleSheet, View, Text, ScrollView, AsyncStorage } from 'react-native';
import {
  Container,
  Footer,
  FooterTab,
  Header,
  Button,
  Body,
  Form,
  Item as FormItem,
  Input,
  Label,
  Title,
  Icon,
  Left,
  Right,
  Content,
} from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import Spinner from 'react-native-loading-spinner-overlay';


export default class AdminHistory extends Component {
  constructor() {
    super();
    this.loginUser = this.loginUser.bind(this);
    this.state = {
      loading: true,
      user_name: 'jyoti',
      tableHead: ['Date', 'Vehicle', 'Time', 'Type', 'Valet', 'Status'],
      widthArr: [100, 80, 50, 50, 50, 50]
    }
    this.retrieveData = this.retrieveData.bind(this);
  }

  async loginUser() {
  }

  componentWillMount() {
    this.retrieveData();
  }

  retrieveData = async () => {
    try {
      const userName = await AsyncStorage.getItem('userName')

      if (userName !== null) {
        this.setState({user_name: userName});
        this.setState({loading: !this.state.loading});
      }
    } catch (e) {
      alert('Failed to load name.')
    }
  };

  render() {
    const { loading } = this.state;
    const state = this.state;
    const tableData = [];
    for (let i = 0; i < 20; i += 1) {
      const rowData = ['01 Sep 2019 Monday', 'KA-03NB4319', '08:30', 'Arrival', 'Jai', 'Closed'];
      tableData.push(rowData);
    }
    return (
      <Container style={{ paddingTop: Constants.statusBarHeight }}>
        <Spinner color="blue" visible={loading}/>
        <Header style={{ backgroundColor: '#F8F8F7' }}>
          <Left>
            <Button transparent>
              <Icon name="menu" style={{color:'#000000'}} />
            </Button>
          </Left>
          <Body>
            <Title style={{fontSize: 14, color:'#000000'}}>Welcome {this.state.user_name}</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='more' style={{color:'#000000'}} />
            </Button>
          </Right>
        </Header>
        <View style={styles.container}>
          <Text style={{fontSize: 14, color:'#000000'}}>E-Valet Admin's App</Text>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.headerText}/>
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  {
                    tableData.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        widthArr={state.widthArr}
                        style={[styles.row, index%2 && {backgroundColor: '#FFFFFF'}]}
                        textStyle={styles.text}
                      />
                    ))
                  }
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </Container>
    );
  } 
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5, backgroundColor: '#fff', margin: 5 },
  header: { height: 50, backgroundColor:'#3f8bd7' },
  headerText: { textAlign: 'center', fontWeight: '100', color: '#FFFFFF' },
  text: { textAlign: 'center', fontWeight: '100' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#F0F0F0' }
});