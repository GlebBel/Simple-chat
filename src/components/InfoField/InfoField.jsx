import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';
import axios from 'axios';

export default class InfoField extends Component{
	constructor(props){
		super(props);
		this.state = {
			info: this.props.info,
			customising: false,
		}
	}
	componentWillReceiveProps(nextProps) {
	    this.setState({
		    info: nextProps.info
	    });
	}

	render(){
		console.log(this.props)
		return(
			<li>
				<h1>{this.props.title}</h1>
				{this.state.customising ?
					<form>
						<input  type='text'
								id='info'
								value={this.state.info}
								onChange={this.handleInfoChange.bind(this)}
						/>
						<button onClick={this.handleSend.bind(this)}>Send</button>
					</form>
				: 	<div> 
						<p>{this.state.info}</p>
						{this.props.owner ? <button onClick = {this.handleCustomise.bind(this)}>Customise</button> : null}
					</div>
				}
			</li>
		)
	}

	handleCustomise(){
		this.setState({customising: true});
	}

	handleInfoChange(e){
		this.setState({info: e.target.value});
	}
	handleSend(){
		const str = this.props.url + '/' + this.props.contain;
		axios({
			method: 'post',
			url: str,
			headers:{'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
			data: {info: document.getElementById('info').value}})
			.then((res) => {
				if(res.data.err) console.log(res.data.err)
				else{
					this.setState({info: res.data})
				}
			})
		this.setState({customising: false});
	}
}