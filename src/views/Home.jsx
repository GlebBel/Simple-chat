import React, {Component} from 'react';

export default class Home extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	content:'home',
	    };
  	}

	click(){
		this.setState({content:'clicked'});
	}

	render(){
		return(
				<div>
					{this.state.content}
					<Element click={this.click.bind(this)}/>
				</div>
			)
	}
}
class Element extends Component{
	render(){
		return(
				<button onClick={this.props.click}>Click me!</button>
			)
	}
}