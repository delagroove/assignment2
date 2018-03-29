import React, { Component } from 'react';
import Graph from './Graph';
import CurrencySelector from './CurrencySelector';
import OrderForm from './OrderForm';
import ProfitLossTable from './ProfitLossTable';
import io from '../helpers/io';
import dateformat from 'dateformat';

export default class Trader extends Component {
	constructor(props) {
		super(props);

		var socket = io.connect('//' + document.domain + ':' + location.port);

		var data = [{
			label: 'test data',
			values: [{x: 1, y: 10}, {x: 2, y: 4}, {x: 3, y: 3}]
		}];

		this.state = {
			socket: socket,
			currencies: [],
			chartData: data
		}
	}

	componentDidMount(){
		var that = this;
		var socket = this.state.socket;
		var currencies;
		socket.on('connect', function(res) {  // Added

		socket.emit('coin-list', function(result) {

				currencies = result;
				that.setState({
					currencies: currencies
				});
			});
		});
	}


	selectCurrency(coin){
		var points  = [];
		var that = this;
		var socket = this.state.socket;

		console.log(`COIN: ${coin}`)

		socket.emit('select-coin', coin ,function(resu) {
			var result = JSON.parse(resu);
				result.Data.forEach(function(arr){
						points.push({x: (arr.time*1000),  y: arr.high})
				});
				var data =[{
		    	label: `${coin} Chart`,
		    	values: points
				}];


				that.setState({
					chartData: data
				});
		});
	}

	render() {

		return (
			<div>
				<CurrencySelector currencies={this.state.currencies} selectCurrency={this.selectCurrency.bind(this)}/>
				<Graph data={this.state.chartData} />
				<OrderForm />
				<ProfitLossTable />
			</div>
		)
	}
}
