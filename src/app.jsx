import React, {Component} from 'react';
import {Switch, HashRouter ,Route } from 'react-router-dom';
import Home from './views/Home/home.jsx'
import WithHead from './components/WithHead/WithHead.jsx'
import axios from 'axios';
var xhr = new XMLHttpRequest();


export default class App extends Component{
	constructor(props){
		super(props);
		this.state = {
			user: '',
		}
	}

	componentWillMount(){
		if(localStorage.getItem('user')) {
			if(JSON.parse(localStorage.getItem('user')) !== null) this.setState({user: JSON.parse(localStorage.getItem('user'))})
		}
		// else{
		// 	xhr.open('GET', 'http://localhost:5000/api/authenticated', false);
		// 	xhr.send();
		// 	if (xhr.status != 200) {
		//         // обработать ошибку
		//         alert('Ошибка ' + xhr.status + ': ' + xhr.statusText);
		//     }
		// 	const res = JSON.parse(xhr.response);
		// 	this.setState({user: res.user});
		// 	localStorage.setItem('user', JSON.stringify(res.user));
		// }
	}
	render(){
		console.log(this.state.user,'hi');
		return(
			<Switch>
				<Route exact path='/' component={Home}/>
				<Route path='/' render={(props) => <WithHead {...this.props} user={this.state.user}/>}/>
			</Switch>
		)
	}
}
