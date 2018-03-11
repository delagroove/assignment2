import React, { Component } from 'react';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from "react-timeseries-charts";
import io from '../helpers/io';

export default class Graph extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			series: null
		}
	}

	componentWillMount () {
        io.emit('message', ((res) => {
					this.setState({series: res});
		}));
	}

	render() {

		return (
			<div>
               <ChartContainer timeRange={this.state.series} width={800}>
                   <ChartRow height="200">
                       <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f"/>
                       <Charts>
                           <LineChart axis="axis1" series={this.state.series}/>
                       </Charts>
                       <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>
                   </ChartRow>
               </ChartContainer>
			</div>
		)
	}
}