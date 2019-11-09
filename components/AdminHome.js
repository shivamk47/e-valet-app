import React, { Component } from 'react';
import Constants from 'expo-constants';
import { StyleSheet, View, Text, TextInput, ScrollView, Dimensions} from 'react-native';
import { TabNavigator } from "react-navigation";
import { DrawerActions } from 'react-navigation-drawer';
import Modal from 'react-native-modal';
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
  List, ListItem, InputGroup, Picker, DatePicker, Col, TabHeading
} from 'native-base';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler';
const { width } = Dimensions.get('screen')

export default class AdminHome extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      valetCount : 0,
      availableValetDetails : [{"name":"Ram"},{"name":"Rahul"}],
      availableValetDetailsName : ["RAM","RAHUL"],
      modalVisible: false,
      isAssignModalVisible: false,
      searchText: '',
      activeReq: [],
      closedReq: [],
      tableHead: ['Vehicle', 'Time', 'type', 'Status', 'Action'],
      widthArr: [100, 50, 50, 80, 95],
      emergencyTableHead : ['Vehicle','Action'],
      emWidthArr: [185, 190],
      ipTableHead: ['Vehicle', 'Time', 'type', 'Status', 'Action'],
      ipWidthArr: [100, 50, 50, 80, 95],
      assinedDriver: 'jai',
    };
    // this.getCars = this.getCars.bind(this);
    this.assignRequestModal = this.assignRequestModal.bind(this);
  }

  componentWillMount(){
    this.showAvailableValets();
    this.getRequests();
  }

  assignRequestModal(rowData){
    console.log(rowData);
    this.setState({ isAssignModalVisible: !this.state.isAssignModalVisible });
  }

  async getRequests() {
    this.setState({loading: !this.state.loading});
    // this.props.navigation.state.params.userId
    fetch('https://morning-meadow-70463.herokuapp.com/rakutenvalet/valet/',{
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((response) => response.json())
    .then((responseJson) => {
      this.setState({activeReq: responseJson.active});
      this.setState({closedReq: responseJson.closed});
      this.setState({loading: !this.state.loading});
      console.log("responseJson dataSource : ",responseJson)
      console.log("responseJson active : ",responseJson.active)
      console.log("responseJson closed : ",responseJson.closed)
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  async showAvailableValets() {
    this.setState({loading: !this.state.loading});
    fetch('https://morning-meadow-70463.herokuapp.com/rakutenvalet/valet/user/availableValeUser/',{
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
      }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          valetCount : responseJson.length,
          availableValetDetails : responseJson
        })
        console.log("responseJson : ",responseJson)
        console.log("responseJson Length : ",responseJson.length)
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  showBox(){
    console.log('shows list of available valets')
  }

  toggleModalVisible(flag) {
    if(flag){
      this.setState({modalVisible: !this.state.modalVisible});
    } else {
      this.setState({isAssignModalVisible: !this.state.isAssignModalVisible});
    }
    console.log("clicked")
  }

  _renderButton = (text, onPress) => (
    <Button onPress={onPress} style={styles.ModalButton}>
        <Text style={{fontWeight:'bold'}}>{text}</Text>
    </Button>
  );

  _renderModalContent = (valetData) => (
    <View style={styles.modalContent}>
      <View style={styles.modalHead}>
        <Left><Text>List of Available Valets</Text></Left>
        <Right>{this._renderButton('X', () => this.toggleModalVisible(true))}</Right>
      </View>
      <View style={styles.modalBody}>
        {
          valetData.map((valet, index)=>(
            <Text key={index} style={[styles.modalRow, index%2 && {backgroundColor: '#fff'},{textAlignVertical: 'center'},styles.modalBodyText]}>{valet.name}</Text>
          ))
        }
      </View>
    </View>
  );

  changeTimeFormat(givenTime){
    var takeTime = givenTime.substring(0,19)
    var givenDate = new Date(takeTime)
    var hours = givenDate.getHours()
    var mins = givenDate.getMinutes()
    var time = hours.toString()+' : '+mins.toString()
    return time
  }

  onValueChange(value: string) {
    this.setState({
      assinedDriver: value,
    });
  }

  render() {
    const { navigation } = this.props;  
    const user_name = navigation.getParam('userName', 'NO-User');
    const tableData = [];
    if(this.state.activeReq.length != 0){
      for(let i=0;i<this.state.activeReq.length;i++){
        const rowData = this.state.activeReq[i]
        const styles = ''
        switch(rowData.action){
          case 'ASSIGN' :
            styles = {backgroundColor:'teal',width:95,paddingHorizontal:3,borderRadius:10}
            break;
          case 'PARK' :
              styles = {backgroundColor:'green',width:95,paddingHorizontal:3,borderRadius:10}
              break;
          case 'CONFIRM' :
            styles = {backgroundColor:'orange',width:95,paddingHorizontal:3,borderRadius:10}
            break;
          case 'GET BACK' :
            styles = {backgroundColor:'red',width:95,paddingHorizontal:3,borderRadius:10}
            break;
          case 'COLLECT KEYS' :
            styles = {backgroundColor:'salmon',width:95,paddingHorizontal:3,borderRadius:10}
            break;
          default :
            styles = {backgroundColor:'blue',width:95,paddingHorizontal:3,borderRadius:10}
        }
        const data = [rowData.carNum, '08:30','Arrival',rowData.status,
        <Button style={styles}>
          <Text style={{textAlign:'center',color:'white'}}>{rowData.action}</Text>
        </Button>
      ]
        tableData.push(data)
      }
    }
    // else{
    //   for (let i = 0; i < 4; i += 1) {
    //     const rowData = ['KA-03NB4319', '08:30', 'Arrival', 'Requested','< Confirm'];
    //     tableData.push(rowData);
    //   }
    // }
    const emTableData = [];
    for (let i = 0; i < 3; i += 1) {
      const rowData = ['KA-03NB4319','< Assign'];
      emTableData.push(rowData);
    }
    const ipTableData = [];
    for (let i = 0; i < 4; i += 1) {
      const rowData = ['KA-03NB4319', '08:30', 'Arrival', 'Requested',
      <Button style={styles}  onPress={() => this.assignRequestModal(rowData)}>
        <Text style={{textAlign:'center',color:'white'}}>Collect Keys</Text>
      </Button>];
      ipTableData.push(rowData);
    }
    let valetItems = [];
    if(this.state.availableValetDetails.length){
      valetItems = this.state.availableValetDetails.map( (s, i) => {
        return <Picker.Item key={i} value={s.name} label={s.name} />
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
        <Content padder style={{margin: 5}}>
          <View style={styles.pageHead}>
            <Left>
              <Text style={{fontSize: 14, color:'#000000'}}>E-Valet Admin's App</Text>
            </Left>
            <Right>
            {/* {this._renderButton(`${this.state.valetCount}`+' Available Valet', () => this.toggleModalVisible())} */}
            <TouchableOpacity style={styles.button} onPress={() => this.toggleModalVisible(false)}>
              <Text style={{color: '#fff'}}>{this.state.valetCount} Available Valet</Text>
            </TouchableOpacity>
            </Right>
            <Modal isVisible={this.state.modalVisible}>
              {this._renderModalContent(this.state.availableValetDetails)}
            </Modal>
          </View>
          <View style={{marginVertical:10}}>
            <TextInput style={{
              borderColor: 'gray',
              borderWidth: 1,
              paddingLeft: 8,
              borderRadius: 10
              }} placeholder="Search by vehicle registration" onChangeText={(text) => this.setState({searchText:text})}/>
          </View>
          <View style={{marginVertical:5}}>
            <Text>Regular Requests :</Text>
            <ScrollView horizontal={true}>
              {
                this.state.activeReq.length != 0 ?
              <View>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.header} textStyle={styles.headerText}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  {
                    <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {
                      tableData.map((rowData, index) => (
                        <Row
                          key={index}
                          data={rowData}
                          widthArr={this.state.widthArr}
                          style={[styles.row, index%2 && {backgroundColor: '#FFFFFF'}]}
                          textStyle={styles.text}
                        />
                      ))
                    }
                  </Table>
                  }
                </ScrollView>
              </View> :
              <View style={{justifyContent:'center',alignItems:'center'}}>
                <Text style={{backgroundColor:'salmon',paddingHorizontal:10,paddingVertical:5}}>
                  No Requests So far...
                </Text>
              </View>
              }
            </ScrollView>
          </View>
          <View style={{marginVertical:5}}>
            <Text>Emergency Requests :</Text>
            <ScrollView horizontal={true}>
              <View>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={this.state.emergencyTableHead} widthArr={this.state.emWidthArr} style={styles.header} textStyle={styles.headerText}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {
                      emTableData.map((rowData, index) => (
                        <Row
                          key={index}
                          data={rowData}
                          widthArr={this.state.emWidthArr}
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
          <View style={{marginTop:30}}>
            <Text>Requests In Progress :</Text>
            <ScrollView horizontal={true}>
              <View>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row data={this.state.ipTableHead} widthArr={this.state.ipWidthArr} style={styles.header} textStyle={styles.headerText}/>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {
                      ipTableData.map((rowData, index) => (
                        <Row key={index}
                        data={rowData}
                        widthArr={this.state.ipWidthArr}
                        style={[styles.row, index%2 && {backgroundColor: '#FFFFFF'}]}
                        textStyle={styles.text}/>
                      ))
                    }
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
          <Modal style={styles.assignModalContent} isVisible={this.state.isAssignModalVisible}>
            <View style={{ flex: 1, backgroundColor:'#FFFFFF', margin: 20, borderWidth: 2 }}>
                <Left><Text style={styles.modalLabelText}>Assign Request to a Valet</Text></Left>
                <Right>{this._renderButton('X', () => this.toggleModalVisible())}</Right>
                <View style={{ marginTop: 60 }}>
                  <List>
                    <ListItem style={styles.listItem}>
                      <Col style={styles.fieldLabels}><Text style={styles.labelText}>Vehicle:</Text></Col>
                      <Col style={styles.fieldContents}><Text></Text>
                      </Col>
                    </ListItem>

                    <ListItem style={styles.listItem}>
                      <Col style={styles.fieldLabels}>
                        <Text style={styles.labelText}>
                          Arrival Time:
                        </Text>
                      </Col>
                      <Col style={styles.fieldContents}><Text></Text>
                      </Col>
                    </ListItem>

                    <ListItem style={styles.listItem}>
                      <Col style={styles.fieldLabels}>
                        <Text style={styles.labelText}>
                          Current Time:
                        </Text>
                      </Col>
                      <Col style={styles.fieldContents}><Text></Text>
                      </Col>
                    </ListItem>

                    <ListItem style={styles.listItem}>
                      <Col style={styles.fieldLabels}>
                        <Text style={styles.labelText}>
                          Status:
                        </Text>
                      </Col>
                      <Col style={styles.fieldContents}><Text></Text>
                      </Col>
                    </ListItem>

                    <ListItem style={styles.listItem}>
                      <Col style={styles.fieldLabels}>
                        <Text style={styles.labelText}>
                          Assign To:
                        </Text>
                      </Col>
                      <Col style={styles.fieldContents}>
                        <Picker iosHeader="Select one"
                          mode="dropdown"
                          selectedValue={this.state.assinedDriver}
                          onValueChange={this.onValueChange.bind(this)} >
                            {valetItems}
                        </Picker>
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
    // color: '#A9A9A9'
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor:'#3f8bd7',
    alignSelf: 'flex-end'
  },
  pageHead: {
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  row: { height: 40, backgroundColor: '#F0F0F0' },
  text: { textAlign: 'center', fontWeight: '100' },
  headerText: { textAlign: 'center', fontWeight: '100', color: '#FFFFFF' },
  header: { height: 50, backgroundColor:'#3f8bd7' },
  dataWrapper: { marginTop: -1 },
  ModalButton: {
    backgroundColor: 'white',
    padding: 10,
    margin: 0,
    height: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 0.3
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalHead: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 5
  },
  modalBody: {
    flexDirection: 'column',
    marginTop: 5,
    alignItems: 'flex-start',
    // width: 350
  },
  modalRow: { backgroundColor: 'lightblue' },
  modalBodyText: {
    padding: 8,
    width: `100%`
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  assignModalContent: {
    justifyContent: undefined,
    alignItems: undefined,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 150,
    marginBottom: 150,
    marginLeft: 10,
    marginRight: 10
  },
});