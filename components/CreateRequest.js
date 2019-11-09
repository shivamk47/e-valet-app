import React, { Component } from 'react';
import Constants from 'expo-constants';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';
import { TabNavigator } from "react-navigation";
import DateTimePicker from "react-native-modal-datetime-picker";
import Moment from 'moment';
import { DrawerActions } from 'react-navigation-drawer';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
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
  List, ListItem, InputGroup, Picker, DatePicker, Col, Row
} from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
const Item = Picker.Item;
export default class CreateRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isReady: true,
      selectedItem: undefined,
      selected1: 'KA-03NB-4319',
      results: {
          items: [],
      },
      carList: [],
      time: '10:00',
      chosenDate: new Date(),
      entryOriginalFormat: new Date(),
      exitOriginalFormat: new Date(),
      entryTime: Moment(new Date()).format('MMM Do YYYY, hh:mm a'),
      exitTime: Moment(new Date()).format('MMM Do YYYY, hh:mm a'),
      isDateTimePickerVisibleEntry: false,
      isDateTimePickerVisibleExit: false,
      minimumDate: new Date(),
      notification: {},
    };
    this.setDate = this.setDate.bind(this);
    this.getCars = this.getCars.bind(this);
    this.registerForPushNotifications = this.registerForPushNotifications.bind(this);
    this.sendPushNotification = this.sendPushNotification.bind(this);
  }

  onValueChange(value: string) {
    this.setState({
        selected1: value,
    });
  }

  componentWillMount(){
    this.getCars();
    this.registerForPushNotifications();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = (notification) => {
    console.log(notification);
  };

  // sendPushNotifications = async () => {

  //   const token = await AsyncStorage.getItem('token')
  //   fetch('https://morning-meadow-70463.herokuapp.com/rakutenvalet/valet',{
  //         method: 'POST',
  //         headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           carNum: this.state.selected1,
  //           endTime: Moment(this.state.exitOriginalFormat).format('YYYY-MM-DD HH:mm:ss')
  //         }),
  //     }).then((response) => response)
  //     .then((responseJson) => {
  //       this.sendPushNotifications();
  //       this.props.navigation.navigate('ViewRequest', { 
  //         userName: this.props.navigation.getParam('userName', 'NO-User'), 
  //         carNum: this.state.selected1,
  //         entryTime: this.state.entryOriginalFormat,
  //         exitTime: this.state.exitOriginalFormat
  //       });
  //     })
  //     .catch((error) =>{
  //       console.error(error);
  //     });
  // }

  sendPushNotification = async () => {
    // I got the user that we will send the push notification to from the database and set it to state, now I have access to the users push token.
    // const userExpoToken = this.state.user.expoToken
    const userExpoToken = await AsyncStorage.getItem('token')
    // Now we will send the message to the expo servers
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: userExpoToken,
        sound: 'default',
        title: 'Hello E-Valet User',
        body: 'Your request for parking has been created. Please track here.',
        data: { 
          'userName': this.props.navigation.getParam('userName', 'NO-User'), 
          'carNum': this.state.selected1,
          'entryTime': this.state.entryOriginalFormat,
          'exitTime': this.state.exitOriginalFormat
        }
      })
    }).then((response) => response)
    .then((responseJson) => {
      console.log(responseJson);
    })
    .catch((error) =>{
      console.error(error);
    })
  }

  registerForPushNotifications = async () => {

    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      let token = await Notifications.getExpoPushTokenAsync();
      await AsyncStorage.setItem('token', token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  }

  showDateTimePickerEntry = () => {
    this.setState({ isDateTimePickerVisibleEntry: true });
  };
 
  hideDateTimePickerEntry = () => {
    this.setState({ isDateTimePickerVisibleEntry: false });
  };
 
  handleDatePickedEntry = date => {
    this.setState({ entryOriginalFormat: date});
    this.setState({ entryTime: Moment(date).format('MMM Do YYYY, hh:mm a') });
    this.hideDateTimePickerEntry();
  };

  showDateTimePickerExit = () => {
    this.setState({ isDateTimePickerVisibleExit: true });
  };
 
  hideDateTimePickerExit = () => {
    this.setState({ isDateTimePickerVisibleExit: false });
  };
 
  handleDatePickedExit = date => {
    this.setState({ exitOriginalFormat: date});
    this.setState({ exitTime: Moment(date).format('MMM Do YYYY, hh:mm a') });
    this.hideDateTimePickerExit();
  };

  async getCars() {
    this.setState({loading: !this.state.loading});
    // this.props.navigation.state.params.userId
    fetch('https://morning-meadow-70463.herokuapp.com/rakutenvalet/car/'+2,{
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((response) => response.json())
    .then((responseJson) => {
      this.setState({dataSource: responseJson});
      this.setState({loading: !this.state.loading});
      if(responseJson.carsNum.length){
        this.setState({
          carList: responseJson.carsNum
        })
      }
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  async createRequest() {
    this.setState({loading: !this.state.loading});
    fetch('https://morning-meadow-70463.herokuapp.com/rakutenvalet/valet',{
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            carNum: this.state.selected1,
            endTime: Moment(this.state.exitOriginalFormat).format('YYYY-MM-DD HH:mm:ss')
          }),
      }).then((response) => response)
      .then((responseJson) => {
        this.sendPushNotification();
        this.props.navigation.navigate('ViewRequest', { 
          userName: this.props.navigation.getParam('userName', 'NO-User'), 
          carNum: this.state.selected1,
          entryTime: this.state.entryOriginalFormat,
          exitTime: this.state.exitOriginalFormat
        });
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  onChange = time => this.setState({ time })

  render() {
    const { navigation } = this.props;  
    const user_name = navigation.getParam('userName', 'NO-User');
    let carItems = [];
    if(this.state.carList.length){
      carItems = this.state.carList.map( (s, i) => {
        return <Picker.Item key={i} value={s} label={s} />
      });
    }
    return (
      <Container style={{ paddingTop: Constants.statusBarHeight}}>
        <Header style={{ backgroundColor: '#F8F8F7' }}>
          <Left>
            <Button transparent onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
              <Icon name="menu" style={{color:'#000000'}}/>
            </Button>
          </Left>
          <Body>
            <Title style={{fontSize: 14, color:'#000000'}}>Welcome {user_name}</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='more' style={{color:'#000000'}}/>
            </Button>
          </Right>
        </Header>
        <Content padder style={{borderWidth: 2, margin: 5}}>
          <Text style={{fontSize: 14, color:'#000000'}}>E-Valet Car Owner's App</Text>
          <List>
            <ListItem style={styles.listItem}>
              <Col style={styles.fieldLabels}><Text style={styles.labelText}>Vehicle List:</Text></Col>
              <Col style={styles.fieldContents}>
                <Picker iosHeader="Select one"
                  mode="dropdown"
                  selectedValue={this.state.selected1}
                  onValueChange={this.onValueChange.bind(this)} >
                    {carItems}
                </Picker>
              </Col>
            </ListItem>
        
            <ListItem style={styles.listItem}>
              <Col style={styles.fieldLabels}>
                <Text style={styles.labelText}>
                  Expected Arrival Time:
                </Text>
              </Col>
              <Col style={styles.fieldContents}>
                <Row><Col style={styles.dateText}><Text>{this.state.entryTime}</Text></Col>
                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisibleEntry}
                  onConfirm={this.handleDatePickedEntry}
                  onCancel={this.hideDateTimePickerEntry}
                  mode="datetime"
                  minimumDate={this.state.minimumDate}
                />
                <Col style={styles.dateIcon}><Icon name="md-calendar" title="Show DatePicker" onPress={this.showDateTimePickerEntry} /></Col></Row>
              </Col>
            </ListItem>

            <ListItem style={styles.listItem}>
              <Col style={styles.fieldLabels}>
                <Text style={styles.labelText}>
                  Expected Exit Time:
                </Text>
              </Col>
              <Col style={styles.fieldContents}>
                <Row><Col style={styles.dateText}><Text>{this.state.exitTime}</Text></Col>
                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisibleExit}
                  onConfirm={this.handleDatePickedExit}
                  onCancel={this.hideDateTimePickerExit}
                  mode="datetime"
                  minimumDate={this.state.minimumDate}
                />
                <Col style={styles.dateIcon}><Icon name="md-calendar" title="Show DatePicker" onPress={this.showDateTimePickerExit} /></Col></Row>
              </Col>
            </ListItem>
          </List>
          <Button block style={styles.button} onPress={() => this.createRequest()}>
              <Text style={{color: '#fff'}}>Request Valet</Text>
          </Button>
        </Content>
      </Container>
    );
  } 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  labelText: {
    fontWeight: 'bold',
    // color: '#A9A9A9'
  },
  button: {
    margin: 30,
    marginTop: 100,
    backgroundColor:'#3f8bd7'
  },
  fieldLabels: {
    flex: 0.4
  },
  fieldContents: {
    flex: 0.6
  },
  dateText: {
    flex: 0.8
  },
  dateIcon: {
    flex: 0.2
  },
  listItem:{
    borderBottomWidth: 0
  }
});