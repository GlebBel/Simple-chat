import React, {Component} from 'react';
import {Switch, HashRouter ,Route } from 'react-router-dom';
import Home from './views/Home/home.jsx'
import WithHead from './components/WithHead/WithHead.jsx'
import axios from 'axios';
import cookie from 'react-cookies';


export default class App extends Component{
	constructor(props){
		super(props);
		this.state = {
			isAuthenticated: '',
		}
	}

	componentWillMount(){
		//axios.get('http://localhost:5000/api/authenticated')
		//	.then((res) => this.setState({isAuthenticated:res.data}));
		console.log(cookie.loadAll(),'cookie')
	}
	render(){
		console.log(this.state.isAuthenticated,'hi');
		return(
			<Switch>
				<Route exact path='/' component={Home}/>
				<Route path='/' render={(props) => <WithHead {...this.props} isAuthenticated={this.state.isAuthenticated}/>}/>
			</Switch>
		)
	}
	componentDidMount(){
		console.log(document.cookie,'cookie2')
	}
}
