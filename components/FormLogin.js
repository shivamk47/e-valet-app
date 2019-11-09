import React, { Component } from 'react';
import Constants from 'expo-constants';
import { StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import {
  Container,
  Header,
  Button,
  Text,
  Body,
  Form,
  Item as FormItem,
  Input,
  Label,
  Title,
  Icon,
  Left,
  Right,
  View,
  Item
} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Notifications,
} from 'expo';

export default class FormLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isReady: true,
      username: '',
      password: '',
      dataSource: [],
      notification: {}
    };
    this.loginUser = this.loginUser.bind(this);
    this.setUserNameStorage = this.setUserNameStorage.bind(this);
    this.getToken = this.getToken.bind(this);
    this.autoLogin = this.autoLogin.bind(this);
  }

  async setUserNameStorage(responseJson){
    await AsyncStorage.setItem('userName', this.state.username);
    await AsyncStorage.setItem('password', this.state.password);
    if(this.state.notification.data){
      this.props.navigation.navigate('ViewRequest', { 
        userName: this.state.notification.data.userName, 
        carNum: this.state.notification.data.carNum,
        entryTime: this.state.notification.data.entryTime,
        exitTime: this.state.notification.data.exitTime
      });
    } else{
      if(responseJson.role == 2){
        this.props.navigation.navigate('CreateRequest', {
          userName: this.state.username,
          userId: responseJson.userId
        });
      } else if(responseJson.role == 1){
        this.props.navigation.navigate('AdminHome', {  
          userName: this.state.username,
          userId: 1
        });
      }
    }
  }

  componentWillMount(){
    this.getToken();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = (notification) => {
    this.setState({notification: notification});
    console.log(this.state.notification);
  };

  async getToken() {
    const userName = await AsyncStorage.getItem('userName');
    const password = await AsyncStorage.getItem('password');
    this.setState({username: userName});
    this.setState({password: password});
    // this.autoLogin();
  }

  autoLogin(){
    if(this.state.username && this.state.password){
      this.loginUser();
    }
  }

  async loginUser() {
    this.setState({loading: !this.state.loading});
    fetch('https://morning-meadow-70463.herokuapp.com/rakutenvalet/user/login',{
    // fetch('http://10.13.174.39:8080/rakutenvalet/user/login',{
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: this.state.username,
            password: this.state.password,
          }),
      }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({dataSource: responseJson});
        this.setState({loading: !this.state.loading});
        if(responseJson.userId){
          this.setUserNameStorage(responseJson);
        }
        console.log(responseJson);
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  render() {
    const { loading } = this.state;
    console.log(DrawerActions.openDrawer());
    console.log(this.props.navigation.dispatch(DrawerActions.openDrawer()));
    return (
        <Container style={{ paddingTop: Constants.statusBarHeight }}>
          <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={{flex: 1}}>
            <Spinner color="blue" visible={loading}/>
            <Header style={{ backgroundColor: '#F8F8F7' }}>
            <Body>
                <Title style={{fontSize: 14, color:'#000000'}}>Welcome to E-Valet App!</Title>
            </Body>
            </Header>
            <Form>
            <View style={styles.MainContainer}>

            <Text style={styles.paragraph}>Please Login</Text>
            <TouchableOpacity style={styles.userLogo} >
              <Icon  name='person'  size={30} color="#FFF" style={{textAlign: 'center', color:'#FFF'}}/>
            </TouchableOpacity></View>
            {/* <FormItem floatingLabel style={{marginLeft:30, marginRight: 30}}>
                <Label>Username</Label>
                  <Input onChangeText={(text) => this.setState({username:text})}/> */}
                <Item rounded style={{marginLeft:30, marginRight: 30, marginTop: 30}}>
                  <Input placeholder="Username" onChangeText={(text) => this.setState({username:text})}/>
                </Item>
            {/* </FormItem> */}
            {/* <FormItem floatingLabel style={{marginLeft:30, marginRight: 30}}>
                <Label>Password</Label>
                <Input secureTextEntry={true} onChangeText={(text) => this.setState({password:text})}/> */}
                <Item rounded style={{marginLeft:30, marginRight: 30, marginTop: 20}}>
                  <Input placeholder="Password" secureTextEntry={true} onChangeText={(text) => this.setState({password:text})}/>
                </Item>
            {/* </FormItem> */}
            <Button block style={styles.button} onPress={() => this.loginUser()}>
                <Text style={{color: '#FFFFFF'}}>Login</Text>
                </Button>
            </Form>
          </LinearGradient>
        </Container>
    );
  } 
}

const styles = StyleSheet.create({
  paragraph: {
    margin: 30,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    margin: 30,
    marginTop: 100,
    backgroundColor:'#3f8bd7',
    borderWidth: 1,
    borderColor:'#3f8bd7'
  },
  MainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLogo:{
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:100,
    height:100,
    backgroundColor:'#3f8bd7',
    borderRadius:50,
    textAlign: 'center',
    marginLeft: 20,
    // backgroundColor: '#aeafb3'
  }
});