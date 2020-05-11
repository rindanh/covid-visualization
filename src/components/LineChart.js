import React from 'react';
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
		while (i<=this.props.latest) {
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

	getKasus = () => {
		if (this.props.filterkasus===2) {
			return 'Terkonfirmasi Positif'
		} else 
		if (this.props.filterkasus===3) {
			return 'Meninggal'
		} else 
		if (this.props.filterkasus===4) {
			return 'Sembuh'
		}
	}


	render() {

		const options = {
			// Use the same chart area width as the control for axis alignment.
		    // chartArea: { height: '80%', width: '90%' },
		    title: 'Tren Akumulasi Kasus ' + this.getKasus() + '\nTanggal ' + convertToDateFormat(this.props.first) + ' hingga ' + convertToDateFormat(this.props.latest),
		    titleTextStyle: {
		    	color: '#ffffff',
		    	fontSize: 25
		    },
		    hAxis: { 
		    	title: 'Tanggal',
		    	textStyle: {
		            color: '#ffffff'
		        },
		        titleTextStyle: {
		            color: '#ffffff'
		        }
		    },
		    vAxis: { 
		    	viewWindow: { min: 0 },
		    	title: 'Jumlah Kasus (orang)',
		    	textStyle: {
		            color: '#ffffff'
		        },
		        titleTextStyle: {
		            color: '#ffffff'
		        }
		    },
		    backgroundColor: {
	        	fill:'#343A41'     
	        },
		    legend: { 
		    	textStyle: {
					color: '#ffffff'
				},
				position: 'top',
				alignment: 'end'
			},
			chartArea: { width: '80%', height: '70%' },
		    lineWidth:4
		}

		const controls = [
		    {
		      controlType: 'ChartRangeFilter',
		      options: {
		        filterColumnIndex: 0,
		        is3D: true,
		        ui: {
		          chartType: 'LineChart',
		          chartOptions: {
		            chartArea: { width: '70%', height: '60%' },
		            hAxis: { 
		            	title: 'Geser untuk melihat kasus dalam range tanggal tertentu',
		            	baselineColor: 'none',
		            	textPosition: 'out',
		            	textStyle: {
				            color: '#ffffff'
				        },
				        titleTextStyle: {
				            color: '#ffffff',
				            italic: false
				        }
		            },
		            vAxis: {
		            	textStyle: {
				            color: '#ffffff'
				        },
				        titleTextStyle: {
				            color: '#ffffff'
				        }
		            },
		            backgroundColor: {
			        	fill:'#343A41'     
			        },
		          },
		        },
		      },
		      controlPosition: 'bottom',
		      controlWrapperParams: {
		        state: {
		          range: { start: new Date(this.props.first), end: new Date(this.props.currentDate) },
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