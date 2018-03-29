import React, { Component } from 'react';

export default class CurrencySelector extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currencies : [],
			selectedCurrency: ''
		}

		this.selectCurrency = this.props.selectCurrency;
	}

	componentWillReceiveProps(props){
		this.setState({
			currencies: props.currencies
		});
	}

	render() {

		return (
			<div className="currency-selector">
				{this.state.currencies.map((item, idx) => {
					return(<div className="currency" key={`currency${idx}`} onClick={() => {this.selectCurrency(item.Symbol)}}>
							<div className="img">
								<img src={`http://www.cryptocompare.com${item.ImageUrl}`} />
							</div>
							<p>{item.FullName}</p>
					</div>);
				})
				}
			</div>
		)
	}
}
CurrencySelector.defaultProps = {currencies: []};
