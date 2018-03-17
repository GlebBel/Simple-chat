import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';
import InfoField from '../../components/InfoField/InfoField.jsx';
import ProfPhoto from '../../components/ProfPhoto/ProfPhoto.jsx';
import axios from 'axios';

export default class Profile extends Component{
	constructor(props){
		super(props);
		this.state = {
			user: {},
			url:'',
		}
	}
	componentWillMount(){
		const url='http://localhost:5000/api/userInfo/' + this.props.match.params.username;
		this.setState({url:url});
		console.log(1,this.props, url)
		if(this.props.match.params.username){
			axios.get(url)
			.then((res) => {
				console.log(2, res.data);
				this.setState({user: res.data});
		})
		}
		else if(this.props.isAuthenticated){
			axios.get('http://localhost:5000/api/getAuthorizedUserInfo')
			.then((res) => {
				this.setState({name: res.data.name, password: res.data.pass})

			})
		}
	}

	render(){
		return(
			<div>
				<ProfPhoto photoUrl={this.state.user.photoUrl}/>
				<InfoField title='username' info={this.state.user.userName} owner={true} url={this.state.url} contain='userName'/>
				<InfoField title='about' info={this.state.user.about} owner={true} url={this.state.url} contain='about'/>
				<InfoField title='status' info={this.state.user.status} owner={true} url={this.state.url} contain='status'/>

			</div>
		)
	}
}