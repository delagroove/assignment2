import React, { Component } from 'react';

export default class Blotter extends Component {
	constructor(props) {
		super(props);


		this.state = {
			series: null
		}
	}


	render() {

		return (
			<div className="blotter-table">
				BLOTTER
			</div>
		)
	}
}
