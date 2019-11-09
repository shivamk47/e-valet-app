import React, { Component } from 'react';
import Constants from 'expo-constants';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { TabNavigator } from "react-navigation";
import DateTimePicker from "react-native-modal-datetime-picker";
import Moment from 'moment';
import { DrawerActions } from 'react-navigation-drawer';
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
import Modal from "react-native-modal";
const Item = Picker.Item;
export default class ViewRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isReady: true,
      results: {
          items: [],
      },
      isDateTimePickerVisibleEntry: false,
      isDateTimePickerVisibleExit: false,
      minimumDate: new Date(),
      isModalVisible: false,
      exitOriginalFormat: new Date(),
      newExitTime: Moment(new Date()).format('MMM Do YYYY, h:mm a'),
      exitTime: Moment(new Date()).format('MMM Do YYYY, h:mm a'),
      requestedFor: Moment(new Date()).format('dddd, MMM Do YYYY')
    };
    this.setDate = this.setDate.bind(this);
    this.cancelRequest = this.cancelRequest.bind(this);
    this.changeExitTime = this.changeExitTime.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openExitTimeModal = this.openExitTimeModal.bind(this);
  }

  componentWillMount(){
    const { navigation } = this.props;
    const entry_time = navigation.getParam('entryTime', 'NO-User');
    const exit_time = navigation.getParam('exitTime', 'NO-User');
    this.setState({ exitTime: Moment(exit_time).format('hh:mm a') });
    this.setState({ requestedFor: Moment(entry_time).format('dddd, MMM Do YYYY') });
    this.setState({ newExitTime: Moment(exit_time).format('MMM Do YYYY, h:mm a') });
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  showDateTimePickerExit = () => {
    this.setState({ isDateTimePickerVisibleExit: true });
  };
 
  hideDateTimePickerExit = () => {
    this.setState({ isDateTimePickerVisibleExit: false });
  };
 
  handleDatePickedExit = date => {
    this.setState({ exitOriginalFormat: date});
    this.setState({ newExitTime: Moment(date).format('MMM Do YYYY, hh:mm a') });
    this.hideDateTimePickerExit();
  };

  async changeExitTime() {
    this.setState({loading: !this.state.loading});
    fetch('https://morning-meadow-70463.herokuapp.com/rakutenvalet/valet',{
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            carNum: this.props.navigation.getParam('carNum', 'NO-User'),
            endTime: Moment(this.state.exitOriginalFormat).format('YYYY-MM-DD HH:mm:ss')
          }),
      }).then((response) => response)
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({ isModalVisible: !this.state.isModalVisible });
        this.setState({ requestedFor: Moment(this.state.exitOriginalFormat).format('dddd, MMM Do YYYY') });
        this.setState({ exitTime: Moment(this.state.exitOriginalFormat).format('hh:mm a') });
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  async cancelRequest() {
    this.setState({loading: !this.state.loading});
    // fetch('https://morning-meadow-70463.herokuapp.com/rakutenvalet/valet',{
    //       method: 'POST',
    //       headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         carNum: this.props.navigation.getParam('carNum', 'NO-User'),
    //         endTime: Moment(this.state.exitOriginalFormat).format('YYYY-MM-DD HH:mm:ss')
    //       }),
    //   }).then((response) => response)
    //   .then((responseJson) => {
    //     console.log(responseJson);
    //   })
    //   .catch((error) =>{
    //     console.error(error);
    //   });

    this.props.navigation.navigate('CreateRequest', {  
        userName: this.props.navigation.getParam('userName', 'No-user')
    });
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  openExitTimeModal(){
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  closeModal(){
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  onChange = time => this.setState({ time })

  render() {
    const { navigation } = this.props;
    const user_name = navigation.getParam('userName', 'NO-User');
    const car_num = navigation.getParam('carNum', 'NO-User');
    const entry_time = navigation.getParam('entryTime', 'NO-User');
    const entryTime = Moment(entry_time).format('hh:mm a');
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
              <Col style={styles.fieldLabels}><Text style={styles.labelText}>Vehicle:</Text></Col>
              <Col style={styles.fieldContents}><Text>{car_num}</Text>
              </Col>
            </ListItem>

            <ListItem style={styles.listItem}>
              <Col style={styles.fieldLabels}>
                <Text style={styles.labelText}>
                  Requested For:
                </Text>
              </Col>
              <Col style={styles.fieldContents}><Text>{this.state.requestedFor}</Text>
              </Col>
            </ListItem>

            <ListItem style={styles.listItem}>
              <Col style={styles.fieldLabels}>
                <Text style={styles.labelText}>
                  Expected Arrival Time:
                </Text>
              </Col>
              <Col style={styles.fieldContents}><Text>{entryTime}</Text>
              </Col>
            </ListItem>

            <ListItem style={styles.listItem}>
              <Col style={styles.fieldLabels}>
                <Text style={styles.labelText}>
                  Expected Exit Time:
                </Text>
              </Col>
              <Col style={styles.fieldContents}><Text>{this.state.exitTime}</Text>
              </Col>
            </ListItem>
          </List>
          <List style={{borderWidth: 2, borderRadius: 35, marginTop: 20}}>
            <ListItem style={styles.listItem}>
              <Col style={styles.fieldLabels}>
                <Text style={styles.labelText}>
                    Current:
                </Text>
              </Col>
              <Col style={styles.fieldContents}><Text>Valet Requested</Text>
              </Col>
            </ListItem>

            <ListItem style={styles.listItem}>
              <Col style={styles.fieldLabels}>
                <Text style={styles.labelText}>
                  Next:
                </Text>
              </Col>
              <Col style={styles.fieldContents}><Text>Request Confirmed</Text>
              </Col>
            </ListItem>
          </List>
            <Row>
                <Col>
                    <Button block style={styles.buttonChange} onPress={() => this.openExitTimeModal()}>
                        <Text style={{color: '#fff'}}>Change Exit Time</Text>
                    </Button>
                </Col>
                <Col>
                    <Button block style={styles.buttonCancel} onPress={() => this.cancelRequest()}>
                        <Text style={{color: '#fff'}}>Cancel</Text>
                    </Button>
                </Col>
            </Row>
            <Modal style={styles.modalContent} isVisible={this.state.isModalVisible}>
                <View style={{ flex: 1, backgroundColor:'#FFFFFF', margin: 20, borderWidth: 2 }}>
                <Text style={styles.modalLabelText}>Choose New Exit Time</Text>
                    <View style={{ marginTop: 60 }}>
                        <List>
                            <ListItem>
                                <Col style={styles.fieldLabels}>
                                    <Text style={styles.labelText}>
                                    New Exit Time:
                                    </Text>
                                </Col>
                                <Col style={styles.fieldContents}>
                                    <Row><Col style={styles.dateText}><Text>{this.state.newExitTime}</Text></Col>
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
                        <Row style={{marginTop: 60}}>
                            <Col>
                                <Button block style={styles.buttonModal} onPress={() => this.changeExitTime()} >
                                    <Text style={{color: '#fff'}}>Submit</Text>
                                </Button>
                            </Col>
                            <Col>
                                <Button block style={styles.buttonModal} onPress={() => this.closeModal()} >
                                    <Text style={{color: '#fff'}}>Cancel</Text>
                                </Button>
                            </Col>
                        </Row>
                    </View>
                </View>
            </Modal>
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
  },
  modalLabelText: {
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10
  },
  buttonChange: {
    margin: 30,
    marginTop: 100,
    backgroundColor:'#3f8bd7',
    flex: 0.6
  },
  buttonModal: {
    backgroundColor:'#3f8bd7',
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonCancel: {
    margin: 30,
    marginTop: 100,
    backgroundColor:'#3f8bd7',
    flex: 0.4
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
  modalContent: {
    justifyContent: undefined,
    alignItems: undefined,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 150,
    marginBottom: 150,
    marginLeft: 10,
    marginRight: 10
  },
  listItem:{
    borderBottomWidth: 0
  }
});