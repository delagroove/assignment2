import React, { Component } from 'react';
import Graph from './Graph';
import CurrencySelector from './CurrencySelector';
import OrderForm from './OrderForm';
import ProfitLossTable from './ProfitLossTable';
import io from '../helpers/io';
import dateformat from 'dateformat';

const PROFIT = 0.035;

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
			chartData: data,
			symbol: '',
			buyPrice: '',
			sellPrice: '',
			cash: 0,
			currentCurrencyPosition: 0
		}

	}

	componentDidMount(){
		var that = this;
		var socket = this.state.socket;
		var currencies;
		socket.on('connect', function(res) {  // Added

			socket.emit('query-bank', function(r){
				that.setState({
					cash: JSON.parse(r).cash
				});
			});

			socket.emit('coin-list', function(result) {
				currencies = result;
				that.setState({
					currencies: currencies
				});
			})

			socket.emit('get-blotter', function(result) {
				console.log(result);
				//that.setState({
				//	orders: result
				//});
			})

		});
	}

	buyMethod(order){
		console.log("BUY");
		//console.log(order);
		var that = this;
		var socket = that.state.socket;
		return new Promise((resolve, reject) => {
			console.log(order)
			var orderTotal = parseInt(order.quantity)*parseFloat(order.price);
			socket.emit('bank-remove', orderTotal, function(a){
				that.setState({
					cash: that.state.cash - orderTotal
				})
			});
		socket.emit('set-buy', order ,function(resu) {
			var result = JSON.parse(resu);
			console.log(result);
			resolve("Order saved.")
		});
		})
	}

	sellMethod(order){
		console.log("SELL");
		console.log(order);
		var that = this;
		var socket = that.state.socket;
		return new Promise((resolve, reject) => {
			console.log(order)
			var orderTotal = parseInt(order.quantity)*parseFloat(order.price);
			socket.emit('bank-add', orderTotal, function(a){
				that.setState({
					cash: that.state.cash + orderTotal
				})
			});
			socket.emit('set-sell', order ,function(resu) {
				var result = JSON.parse(resu);
				console.log(result);
				resolve("Order saved.")
			});
		})

	}

	selectCurrency(coin){
		var points  = [];
		var that = this;
		var socket = this.state.socket;

		console.log(`COIN: ${coin}`)

		socket.emit('select-coin', coin ,function(resu) {
			var result = JSON.parse(resu);
			var buyPrice = 0;
			var sellPrice = 0;
				result.Data.forEach(function(arr){
						points.push({x: (arr.time*1000),  y: arr.high})
						buyPrice = (arr.high+arr.low)/2 + ((arr.high+arr.low)/2 * PROFIT);
						sellPrice = (arr.high+arr.low)/2 - ((arr.high+arr.low)/2 * PROFIT);
				});

				var data =[{
		    	label: `${coin} Chart`,
		    	values: points
				}];
				var shares = 0;
				//const shares = this.setCurrentCurrencyPosition(coin);
				socket.emit('query-portfolio', coin ,function(resu) {
					var result_json = JSON.parse(resu);
					for(var key in result_json){
						console.log(parseInt(result_json[key].quantity))
						if (result_json[key].side === 'BUY')
						shares = shares + parseInt(result_json[key].quantity);
						else
						shares = shares - parseInt(result_json[key].quantity);
					}
					// console.log('SHARES')
					// console.log(shares)

					that.setState({
						chartData: data,
						symbol: coin,
						buyPrice: buyPrice,
						sellPrice: sellPrice,
						currentCurrencyPosition: shares
					});

					// console.log(that.state);
				});




		});

	}

//	setCurrentCurrencyPosition(coin){
//
//	}


	render() {

		return (
			<div>
				<CurrencySelector currencies={this.state.currencies} selectCurrency={this.selectCurrency.bind(this)}/>
				<Graph data={this.state.chartData} />
				<OrderForm symbol={this.state.symbol} buyMethod={this.buyMethod.bind(this)} sellMethod={this.sellMethod.bind(this)} buyPrice={this.state.buyPrice} sellPrice={this.state.sellPrice} cash={this.state.cash} currentCurrencyPosition={this.state.currentCurrencyPosition}/>
				<ProfitLossTable cash={this.state.cash}/>
			</div>
		)
	}
}
