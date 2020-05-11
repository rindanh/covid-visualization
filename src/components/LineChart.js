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

	getMax = (max, val) => {
		if (val > max) {
			return val
		} else {
			return max
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
			head.push('INDONESIA')
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

		// this.setState({
		// 	maxKasus: max
		// })
		// console.log(tab)
		return tab;
	}

	getMaxKasus = async () => {
		let tab = this.getFilteredLineTable()
		let max = this.state.maxKasus
		await tab.slice(1, tab.length).map((row) => {
			row.slice(1, row.length).map((element) => {
				max = this.getMax(max, element)
			})
		})
		console.log(max)

		await this.setState({
			maxKasus: max
		})
	}

	render() {

		const options = {
			// Use the same chart area width as the control for axis alignment.
		    // chartArea: { height: '80%', width: '90%' },
		    hAxis: { title: 'Tanggal'},
		    vAxis: { 
		    	viewWindow: { min: 0 },
		    	title: 'Jumlah Kasus',
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
			  width={'900px'}
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