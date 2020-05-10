import React from 'react';
import ReactDOM from 'react-dom';
import { Chart } from "react-google-charts";
import moment from 'moment';

const convertToDateFormat = (value) => {
	return moment(value).format("DD MMM YYYY")
}


export default function LineChart(props) {

	const step = 86400000
	const latest = props.latest
	const first = props.first
	const current = props.currentDate

	const validateDateInRange = (date) => {
		return (date=>first && date<=current)
	}

	const options = {
		// Use the same chart area width as the control for axis alignment.
	    // chartArea: { height: '80%', width: '90%' },
	    hAxis: { title: 'Tanggal'},
	    vAxis: { 
	    	viewWindow: { min: 0, max: 6000 },
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
	          range: { start: new Date(first), end: new Date(latest) },
	        },
	      },
	    },
	]

	const getFilteredLineTable = () => {
		let tab = []

		let head = props.cols.map((col) => {
			return props.data[first][col+1][1]
		})


		let header = ['date'].concat(head) 
		tab.push(header)

		
		let i = first
		while (i<=current) {
			let temp = []
			temp.push(new Date(i))
			props.cols.map((col) => {
				temp.push(props.data[i][col+1][2]) //total kasus only
			})
			tab.push(temp)
			i+=step
		}
		console.log(tab)
		return tab;
	}

	return(
		<Chart
		  width={'900px'}
		  height={'600px'}
		  chartType="LineChart"
		  loader={<div>Loading Chart</div>}
		  data={getFilteredLineTable()}
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

