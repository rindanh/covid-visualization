import React from 'react';
import './App.css';
import ChartMap from "./ChartMap";
import DateDiscreteSlider from './Slider'
// import DateSlider from './DateSlider'
import MapFilter from './MapFilter'
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
	['Province', 'Total Case','Province Name', 'Meninggal', 'Sembuh'],
	['ID-AC', 300],
	['ID-BA', 500],
	['ID-BB', 600],
	['ID-BT', 600],
	['ID-BE', 800],
	['ID-GO', 900]
]


class App extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			data: [],// [[['Province', 'Total Case']]],
			latestDate: moment().valueOf(),
			currentDate: moment().valueOf(),
			filterValue: 2 //total:2, meninggal:3, sembuh:4
		}
	}

	getAllData() {
		let arr = {}
		let latestDate;
		dataJson.data.map((d) => {
			d.date = this.convertToDateValue(d.date)
			let temp = []
			temp.push([
				{type: 'string', role:'tooltip', label:'Code'}, // Province
				{type: 'string', role:'tooltip', label:'Province'}, //'Province Name', 
				{type: 'number', role:'tooltip', label:'Kasus Total'}, // 'Total Case', 
				{type: 'number', role:'tooltip', label:'Meninggal'}, //'Meninggal', 
				{type: 'number', role:'tooltip', label:'Sembuh'} // 'Sembuh'
			])

			d.provinsi.map((p) => {
				let prov = []
				prov.push(p.kode)
				prov.push(p.nama)
				prov.push(p.total)
				prov.push(p.meninggal)
				prov.push(p.sembuh)
				temp.push(prov)
			})

			arr[this.convertToDateValue(d.date)] = temp
			latestDate = d.date
		})

		this.setState({
			currentDate: this.convertToDateValue(latestDate),
			latestDate: this.convertToDateValue(latestDate),
			data: arr
		})

	}

	getCurrentDate() {
		return moment().valueOf()
	}

	handleSliderChange = async (newValue) => {
		await this.setState({
			currentDate: newValue
		})
	};

	handleMapFilterChange = async (val) => {
		await this.setState({
			filterValue: val
		})
	}

	convertToDateValue(date) {
		return moment(date).startOf('day').valueOf()
	} 

	convertToDateFormat(value) {
		return moment(value).format("DD MMM YYYY")
	}

	componentWillMount() {
		this.getAllData();
	}


	render() {
		const latestDate = this.state.latestDate;
		const first = this.convertToDateValue("2020-03-02")

		return (
			<div className="App container">
				<div className="row">
					<MapFilter 
						onChange={this.handleMapFilterChange.bind(this)}
						initValue={this.state.filterValue}
					/>
					<ChartMap 
						data={this.state.data[this.convertToDateValue(this.state.currentDate)]} // this.getFilteredMapTable()}
						col={this.state.filterValue}
					/>

					<DateDiscreteSlider 
						latest={latestDate} 
						first={first}
						current={this.state.currentDate}
						onChange={this.handleSliderChange.bind(this)}
					/>

					
					
			    </div>
			</div>
		);
	}

	
}

export default App;
