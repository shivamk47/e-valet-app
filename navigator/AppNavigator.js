import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import FormLogin from '../components/FormLogin';
import CreateRequest from '../components/CreateRequest';
import ViewRequest from '../components/ViewRequest';
import MyRequests from '../components/MyRequests';
import Vehicles from '../components/Vehicles';
import MainScreenNavigator from './UserTabNavigator';
import AppDrawerNavigator from './DrawerNavigator';
import AdminScreenNavigator from './AdminTabNavigator';
import AdminHome from '../components/AdminHome';
import AdminHistory from '../components/AdminHistory';


const AppNavigator = createStackNavigator({
    FormLogin: {
        screen: FormLogin,
        navigationOptions: {
            header: null
        }
    },
    CreateRequest: {
        screen: MainScreenNavigator,
        navigationOptions: {
            header: null,
            drawerLabel: 'CreateRequest',
            drawerIcon: 'person'
        }
    },
    ViewRequest:{
        screen: ViewRequest,
        navigationOptions: {
            header: null
        }
    },
    MyRequests: {
        screen: MyRequests,
        navigationOptions: {
            header: null
        }
    },
    Vehicles: {
        screen: Vehicles,
        navigationOptions: {
            header: null
        }
    },
    AdminHome : {
        screen: AdminScreenNavigator,
        navigationOptions: {
            header: null
        }
    },
    AdminHistory : {
        screen: AdminHistory,
        navigationOptions: {
            header: null
        }
    },
    drawerNavigator: {
        screen: AppDrawerNavigator
    },
    initialRoutename: 'FormLogin',
}, {
    headerMode: 'screen'
})

const AppNav = createAppContainer(AppNavigator);

export default AppNav;