import React, { Component } from 'react';
import Constants from 'expo-constants';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';
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

export default class Vehicles extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      user_name: 'jyoti'
    }
    this.logoutUser = this.logoutUser.bind(this);
    this.retrieveData = this.retrieveData.bind(this);
  }

  async logoutUser() {
    AsyncStorage.clear();
    this.props.navigation.navigate('FormLogin');
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
    return (
      <Container style={{ paddingTop: Constants.statusBarHeight }}>
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
        <Form>
          <Button block style={styles.button} onPress={() => this.logoutUser()}>
            <Text style={{color: '#FFFFFF'}}>Logout</Text>
          </Button>
        </Form>
        <Content />
      </Container>
    );
  } 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    margin: 5
  },
  button: {
    margin: 30,
    marginTop: 100,
    backgroundColor:'#3f8bd7',
    borderWidth: 1,
    borderColor:'#3f8bd7'
  }
});