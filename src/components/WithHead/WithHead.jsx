import React, {Component} from 'react';
import {Switch, HashRouter ,Route } from 'react-router-dom';
import SignUp from '../../views/Sign/sign.jsx'
import LogIn from '../../views/LogIn/log.jsx'
import Chat from '../../views/Chat/chat.jsx'
import Profile from '../../views/Profile/profile.jsx'
import Head from '../Head.jsx'

export default class extends Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div>
			<Head user={this.props.user} />
				<Switch>
					<Route path='/login' render={(props) => <LogIn {...props} user={this.props.user}/>}/>
					<Route path='/signup' component={SignUp}/>
					<Route exact path='/profile/:username' render={(props) => <Profile {...props} user={this.props.user}/>}/>
					<Route path='/chat' component={Chat}/>
				</Switch>
			</div>
		)
	}
}