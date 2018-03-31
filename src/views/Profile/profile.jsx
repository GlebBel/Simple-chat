import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';
import InfoField from '../../components/InfoField/InfoField.jsx';
import ProfPhoto from '../../components/ProfPhoto/ProfPhoto.jsx';
import axios from 'axios';
import jwt from 'jsonwebtoken'

export default class Profile extends Component{
	constructor(props){
		super(props);
		this.state = {
			user: {},
			username: jwt.decode(localStorage.getItem('jwt')).userName,
			redirect:'', 
			url:'',
			owner: false,
		}
	}
	componentWillMount(){
		const url = 'http://localhost:5000/api/userInfo/' + this.props.match.params.username || this.state.user;
		this.setState({url:url});
		console.log('owner', this.props.match.params.username === this.state.username, this.state.username, this.props.match.params.username)
		if(this.props.match.params.username === this.state.username) this.setState({owner: true})
		axios.get(url)
		.then((res) => {
			console.log(2, res.data);
			if(res.data.err){ 
				console.log(res.data.err);
			}
			else this.setState({user: res.data});
		})
	}

	render(){
		return(
			this.state.user ?
				<div>
					<ProfPhoto photoUrl={this.state.user.photoUrl} owner={this.state.owner}/>
					<InfoField title='username' info={this.state.user.userName} owner={this.state.owner} url={this.state.url} contain='userName'/>
					<InfoField title='about' info={this.state.user.about} owner={this.state.owner} url={this.state.url} contain='about'/>
					<InfoField title='status' info={this.state.user.status} owner={this.state.owner} url={this.state.url} contain='status'/>

				</div>
				:
				<div>
					user not found
				</div>

			
		)
	}
}