import React, { Component } from 'react';

export default class Blotter extends Component {
	constructor(props) {
		super(props);


		this.state = {
			blotter: []
		}
	}

	componentDidMount(){
		this.setState({
			blotter: this.props.blotter
		});

	}

	componentWillReceiveProps(newProps){
		this.setState({
			blotter: newProps.blotter
		});

	}


	render() {
		//console.log(typeof this.state.blotter)
		return (
			<div className="blotter"><h2>Blotter</h2>
			<table className="blotter-table">
			<thead><tr><th>SIDE</th><th>SYMBOL</th><th>PRICE</th><th>QTY</th></tr>
			</thead>
			<tbody>
				{this.state.blotter && this.state.blotter.map((item, idx)=> {
					return(<tr className="blotter-item">
					<td>{item.side}</td>
					<td>{item.symbol}</td>
					<td>{item.price}</td>
					<td>{item.quantity}</td>
					</tr>)
				})}
				</tbody>
			</table>
			</div>
		)
	}
}
