import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';
import InfoField from '../../components/InfoField/InfoField.jsx'
import axios from 'axios';

export default class Profile extends Component{
	constructor(props){
		super(props);
		this.state = {
			name:'',
			password: '',
			user: {}
		}
	}
	componentWillMount(){
		console.log(this.props, 'hello')
		if(this.props.match.params.username){
			console.log(this.props);
			axios.post('http://localhost:5000/api/getUserInfo', {username: this.props.match.params.username})
				.then((res) => {
					console.log(res);
					this.setState({name: res.data.name, password: res.data.pass})
				})
		}
		else if(this.props.isAuthenticated){
			axios.get('http://localhost:5000/api/getAuthorizedUserInfo')
			.then((res) => {
				this.setState({name: res.data.name, password: res.data.pass})
			})
		}
		axios.get('http://localhost:5000/api/userInfo/' + this.props.match.params.username)
			.then((res) => {
				console.log(res.data)
				this.setState({user: res.data})
		})
		axios.get('https://newsapi.org/v2/top-headlines?country=ru&apiKey=40e0c1cc80c248deabe2e06afde4824f')
			.then((res) =>{
				console.log(res);
			})
	}

	render(){
		return(
			<div>
					hello
				<InfoField title='username' info={this.state.user.userName} owner={true} url={'http://localhost:5000/api/userInfo/' + this.props.match.params.username} contain='userName'/>
				<InfoField title='password' info={this.state.user.password} owner={true} url={'http://localhost:5000/api/userInfo/' + this.props.match.params.username} contain='password'/>
			</div>
		)
	}
}