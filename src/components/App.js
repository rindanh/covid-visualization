import React from 'react';
import './App.css';
import ChartMap from "./ChartMap";
import DateDiscreteSlider from './Slider'
import DateSlider from './DateSlider'
import SliderDate from './SliderDate'
import moment from 'moment';
import dataJson from '../data/data.js'; 
require('moment/locale/id');

const dataTable1 = [
	['Province', 'Total Case'],
	['ID-AC', 200],
	['ID-BA', 300],
	['ID-BB', 400],
	['ID-BT', 500],
	['ID-BE', 600],
	['ID-GO', 700]
]

const dataTable2 = [
	['Province', 'Total Case'],
	['ID-AC', 300],
	['ID-BA', 500],
	['ID-BB', 600],
	['ID-BT', 600],
	['ID-BE', 800],
	['ID-GO', 900]
]

// const dataTable;

// const ourdata = dataJson.data.map((d) => {

// 	// return <p>{d.id}</p>;
// })

class App extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			data: [],// [[['Province', 'Total Case']]],
			latestDate: moment().valueOf(),
			currentDate: moment().valueOf()
		}
	}

	getAllData() {
		console.log("get all data called")
		let arr = {}
		let latestDate;
		dataJson.data.map((d) => {
			// console.log(d.id)
			d.date = this.convertToDateValue(d.date)
			let temp = []
			temp.push(['Province', 'Total Case'])

			d.provinsi.map((p) => {
				let prov = []
				prov.push(p.kode)
				prov.push(p.total)
				temp.push(prov)
			})

			arr[this.convertToDateValue(d.date)] = temp
			latestDate = d.date
			// arr.push(temp)
		})
		// console.log(arr[0])
		// dataTable = arr[arr.length-1]

		this.setState({
			currentDate: this.convertToDateValue(latestDate),
			latestDate: this.convertToDateValue(latestDate),
			data: arr
		})
		// console.log(dataTable2)

	}

	getCurrentDate() {
		return moment().valueOf()
	}

	handleChange = (newValue) => {
		this.setState({
			currentDate: newValue
		})
		console.log(this.state.currentDate)
		// console.log(newValue)
		// if (this.state.currentDate > moment("2020-04-01").valueOf()) {
		// 	this.setState({
		// 		data: dataTable2
		// 	})
		// } else {
		// 	this.setState({
		// 		data: dataTable1
		// 	})
		// }
	};

	convertToDateValue(date) {
		return moment(date).startOf('day').valueOf()
	} 

	componentWillMount() {
		this.getAllData();
	}


	render() {
		const latestDate = this.state.latestDate;
		const first = this.convertToDateValue("2020-03-02")

		console.log(this.state.currentDate)
		console.log(this.state.data)

		console.log(this.state.data[this.convertToDateValue(this.state.currentDate)])

		return (
			<div className="App container">
				<div className="row">
					<ChartMap data={this.state.data[this.convertToDateValue(this.state.currentDate)]}/>

					<DateDiscreteSlider 
						latest={latestDate} 
						first={first}
						current={this.state.currentDate}
						onChange={this.handleChange.bind(this)}
					/>
					{moment(this.state.currentDate).format("DD MMM YYYY")}
					<DateSlider />
					<SliderDate />
					
			    </div>
			</div>
		);
	}

	
}

export default App;
