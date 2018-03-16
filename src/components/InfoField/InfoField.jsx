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
		console.log('comp', nextProps.info)
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
	handleSend(){
		const str = this.props.url + '/' + this.props.contain
		axios.post(str, {data:
			document.getElementById('info').value})
			.then((res) => {
				if(res.data.err) console.log(res.data.err)
				else{
					console.log(res,'hi');
					this.setState({info: res.data})
				}
			})
		this.setState({customising: false});
	}
}