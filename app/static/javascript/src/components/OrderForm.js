import React, { Component } from 'react';
import { Formik } from 'formik';


export default class OrderForm extends Component {

	static defaultProps = {
		symbol: '',
		buyPrice: '',
		sellPrice: '',
		cash: 0,
		currentCurrencyPosition: 0
	}

	constructor(props) {
		super(props);
		this.state = {
			showBuyForm: true,
			symbol: this.props.symbol,
			buyPrice: this.props.buyPrice,
			sellPrice: this.props.sellPrice,
			cash: this.props.cash,
			currentCurrencyPosition: this.props.currentCurrencyPosition
		}
		this.setBuyForm = this.setBuyForm.bind(this);
		this.setSellForm = this.setSellForm.bind(this);
		this.buyMethod = this.props.buyMethod;
		this.sellMethod = this.props.sellMethod;
	}

	setBuyForm(){
		this.setState({
			showBuyForm: true
		})
	}

	setSellForm(){
		this.setState({
			showBuyForm: false
		})
	}



	componentWillReceiveProps (newProps) {
		this.setState({
			symbol: newProps.symbol,
			buyPrice: newProps.buyPrice,
			sellPrice: newProps.sellPrice,
			cash: newProps.cash,
			currentCurrencyPosition: newProps.currentCurrencyPosition
		})
	}

	render() {

		return (
			<div className="order">
				<div><a onClick={this.setBuyForm}>Buy</a></div>
				<a onClick={this.setSellForm}>Sell</a>

				<div className="buyform">
				{this.state.showBuyForm &&
					<div className="form-holder">
						<h3>Buy Order Form</h3>
						<p>cash avail: {this.state.cash}</p>
						<Formik
		      initialValues={{
		        side: 'BUY',
		        symbol: this.props.symbol,
		        quantity: 0,
		        price: this.props.buyPrice
		      }}
					enableReinitialize={true}
		      validate={values => {
		        // same as above, but feel free to move this into a class method now.
		        let errors = {};
						if (!values.symbol) {
		          errors.symbol = 'Required';
		        }
		        if (!values.quantity) {
		          errors.quantity = 'Required';
		        } else if (
		          !/^\d+$/.test(values.quantity)
		        ) {
		          errors.quantity = 'Invalid quantity';
		        } else if (values.quantity * values.price > this.state.cash){
							errors.quantity = 'Order exceeds the cash available';
						}
		        return errors;
		      }}
		      onSubmit={(
		        values,
		        { setSubmitting, setErrors /* setValues and other goodies */ }
		      ) => {
		        this.buyMethod(values).then(
		          user => {
		            setSubmitting(false);
		            // do whatevs...
		            // props.updateUser(user)
								alert("Order added.")
		          },
		          errors => {
		            setSubmitting(false);
		            // Maybe transform your API's errors into the same shape as Formik's
		            setErrors(transformMyApiErrors(errors));
		          }
		        );
		      }}
		      render={({
		        values,
		        errors,
		        touched,
		        handleChange,
		        handleBlur,
		        handleSubmit,
		        isSubmitting,
		      }) => (
		        <form onSubmit={handleSubmit}>
						<label htmlFor="symbol">Symbol</label>
							<input
		            type="text"
		            name="symbol"
		            onChange={handleChange}
		            onBlur={handleBlur}
		            value={values.symbol}
								readOnly
		          />
							<br/>
							<label htmlFor="quantity">quantity</label>

		          <input
		            type="text"
		            name="quantity"
		            onChange={handleChange}
		            onBlur={handleBlur}
		            value={values.quantity}
		          />
							<br/>
		          {touched.quantity && errors.quantity && <div className="error">{errors.quantity}</div>}
							<label htmlFor="price">price</label>
							<input
		            type="text"
		            name="price"
		            onChange={handleChange}
		            onBlur={handleBlur}
		            value={this.props.buyPrice || values.price}

		          />
		          {touched.price && errors.price && <div className="error">{errors.price}</div>}
		          <input type="hidden" name='side' value="BUY" />
		          <br/><button type="submit" disabled={isSubmitting}>
		            Submit
		          </button>
		        </form>
		      )}
		    /></div>}
				</div>
				<div className="sellform">
				{!this.state.showBuyForm &&
					<div className="form-holder">
						<h3>Sell Order Form</h3>
						<p>amount avail: {this.state.currentCurrencyPosition}</p>
						<Formik
		      initialValues={{
		        side: 'SELL',
		        symbol: this.props.symbol,
		        quantity: '',
		        price: this.props.sellPrice
		      }}
					enableReinitialize={true}
		      validate={values => {
		        // same as above, but feel free to move this into a class method now.
		        let errors = {};
		        if (!values.quantity) {
		          errors.quantity = 'Required';
		        } else if (
		          !/^\d+$/.test(values.quantity)
		        ) {
		          errors.quantity = 'Invalid quantity';
						} else if (values.quantity > this.state.currentCurrencyPosition) {
							errors.quantity = 'Not enough coins to sell.'
						}
		        return errors;
		      }}
		      onSubmit={(
		        values,
		        { setSubmitting, setErrors /* setValues and other goodies */ }
		      ) => {
		        this.sellMethod(values).then(
		          user => {
		            setSubmitting(false);
		            // do whatevs...
		           alert("Order added.")
		          },
		          errors => {
		            setSubmitting(false);
		            // Maybe transform your API's errors into the same shape as Formik's
		            setErrors(transformMyApiErrors(errors));
		          }
		        );
		      }}
		      render={({
		        values,
		        errors,
		        touched,
		        handleChange,
		        handleBlur,
		        handleSubmit,
		        isSubmitting,
		      }) => (
		        <form onSubmit={handleSubmit}>
						<label htmlFor="symbol">Symbol</label>

							<input
		            type="text"
		            name="symbol"
		            onChange={handleChange}
		            onBlur={handleBlur}
		            value={this.props.symbol || values.symbol}

		          />
							<br />
							<label htmlFor="quantity">quantity</label>
		          <input
		            type="text"
		            name="quantity"
		            onChange={handleChange}
		            onBlur={handleBlur}
		            value={values.quantity}
		          />
		          {touched.quantity && errors.quantity && <div className="error">{errors.quantity}</div>}
							<label htmlFor="price">price</label>
							<input
		            type="text"
		            name="price"
		            onChange={handleChange}
		            onBlur={handleBlur}
		            value={this.props.sellPrice || values.price}

		          />
		          {touched.price && errors.price && <div className="error">{errors.price}</div>}
		          <input type="hidden" name='side' value="SELL" />
		          <br />
							<button type="submit" disabled={isSubmitting}>
		            Submit
		          </button>
		        </form>
		      )}

		    /></div>}
				</div>
		</div>
		)
	}
}
