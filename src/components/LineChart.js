import React from 'react';
import ReactDOM from 'react-dom';
import { Chart } from "react-google-charts";
import moment from 'moment';

const convertToDateFormat = (value) => {
	return moment(value).format("DD MMM YYYY")
}


class LineChart extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			maxKasus: 6000
		}
	}

	getFilteredLineTable = () => {
		console.log("berapa kali")
		const step = 86400000
		let tab = []

		let head = this.props.cols.map((col) => {
			return this.props.data[this.props.first][col+1][1]
		})

		if (this.props.showIndo) {
			head.push('ALL (INDONESIA)')
		}

		let header = ['date'].concat(head) 
		tab.push(header)

		// handle indo and province
		let i = this.props.first
		// let max=this.state.maxKasus
		while (i<=this.props.currentDate) {
			let temp = []
			temp.push(new Date(i))

			// insert province
			this.props.cols.map((col) => {
				temp.push(this.props.data[i][col+1][this.props.filterkasus])
			})

			// insert indo
			if (this.props.showIndo) {
				temp.push(this.props.dataIndo[i][this.props.filterkasus-2])	
			}

			tab.push(temp)


			i+=step
		}
		return tab;
	}


	render() {

		const options = {
			// Use the same chart area width as the control for axis alignment.
		    // chartArea: { height: '80%', width: '90%' },
		    hAxis: { title: 'Tanggal'},
		    vAxis: { 
		    	viewWindow: { min: 0 },
		    	title: 'Jumlah Kasus (orang)',
		    },
		    // legend: { position: 'none' },
		}

		const controls = [
		    {
		      controlType: 'ChartRangeFilter',
		      options: {
		        filterColumnIndex: 0,
		        ui: {
		          chartType: 'LineChart',
		          chartOptions: {
		            chartArea: { width: '62%', height: '30%' },
		            hAxis: { 
		            	baselineColor: 'none',
		            	position: 'bottom'
		            },
		          },
		        },
		      },
		      controlPosition: 'bottom',
		      controlWrapperParams: {
		        state: {
		          range: { start: new Date(this.props.first), end: new Date(this.props.latest) },
		        },
		      },
		    },
		]

		

		return(
			<Chart
			  width={'100%'}
			  height={'600px'}
			  chartType="LineChart"
			  loader={<div>Loading Chart</div>}
			  data={this.getFilteredLineTable()}
			  // options={{
			  //   hAxis: {
			  //     title: 'Tanggal',
			  //   },
			  //   vAxis: {
			  //     title: 'Jumlah Kasus',
			  //   },
			  //   series: {
			  //     1: { curveType: 'function' },
			  //   },
			  // }}
			  options={options}
			  chartPackages={['corechart', 'controls']}
			  controls={controls}
			/>
			
		)
	}
}

export default LineChart;