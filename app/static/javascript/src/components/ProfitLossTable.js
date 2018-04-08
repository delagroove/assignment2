import React, { Component } from 'react';

export default class ProfitLossTable extends Component {
	constructor(props) {
		super(props);


		this.state = {
			series: null
		}
	}


	render() {

		return (
			<div className="profit-loss-table">
				<h2>Profit/Loss Table</h2>
			</div>
		)
	}
}
