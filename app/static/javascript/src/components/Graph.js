import React, { Component } from 'react';
import {LineChart} from 'react-d3-components';

export default class Graph extends Component {
	constructor(props) {
		super(props);

		var data = [{
			label: 'test data',
			values: [{x: 1521417600, y: 10}, {x: 1521504000, y: 4}, {x: 1521509000, y: 3}]
		}];

		this.state = {
			data: data,
			xScale: d3.time.scale().domain([data[0].values[0].x, data[0].values[data[0].values.length-1].x]).range([0, 1000]),
			yScale: d3.time.scale().domain([data[0].values[0].y, data[0].values[data[0].values.length-1].y]).range([0, 500])
		}
	}

	componentWillReceiveProps(props){
		this.setState({
			data: props.data,
			xScale: d3.time.scale().domain([props.data[0].values[0].x, props.data[0].values[props.data[0].values.length-1].x]).range([0, 1000]),
			yScale: d3.time.scale().domain([props.data[0].values[0].y, props.data[0].values[props.data[0].values.length-1].y]).range([0, 500])
		})
	}


	render() {
		if (this.state.data[0].label.indexOf('test') > -1) return null;
		return (
			<div className="chart">
				<LineChart
							data={this.state.data}
							width={1000}
							height={500}
							margin={{top: 10, bottom: 50, left: 50, right: 10}}
							xAxis={{tickValues: this.state.xScale.ticks(20), tickFormat: d3.time.format("%m/%d"), label: "Date" }}
							yAxis={{tickValues: this.state.yScale.ticks(10), label: "Price (USD)" }}
							/>
			</div>
		)
	}
}
