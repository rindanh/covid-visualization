import React from 'react';
import Button from 'react-bootstrap/Button';
import './App.css';
import ChartMap from "./ChartMap";
import LineChart from './LineChart';
import DateDiscreteSlider from './Slider'
import MultiselectCheckboxes from './MultiselectCheckboxes'
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
			filterMapValue: 2, //total:2, meninggal:3, sembuh:4
			filterProvinceCodes: [], // pake index 0
			isMap: true
		}
	}

	getAllData() {
		let arr = {}
		let latestDate;
		dataJson.data.map((d) => {
			d.date = this.convertToDateValue(d.date)
			let temp = []
			temp.push([
				{type: 'string', label:'Code'}, // Province
				{type: 'string', label:'Province'}, //'Province Name', 
				{type: 'number', label:'Total'}, // 'Total Case', 
				{type: 'number', label:'Meninggal'}, //'Meninggal', 
				{type: 'number', label:'Sembuh'}, // 'Sembuh'
				{type: 'string', role:'tooltip'}
			])

			d.provinsi.map((p) => {
				let prov = []
				prov.push(p.kode)
				prov.push(p.nama)
				prov.push(p.total)
				prov.push(p.meninggal)
				prov.push(p.sembuh)
				prov.push(p.nama + '\n' + 'Terkonfirmasi: ' + p.total + '\n' + 'Sembuh: ' + p.sembuh + '\n' + 'Meninggal: ' + p.meninggal)
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
			filterMapValue: val
		})
	}

	handleRegionClicked = async (code) => {
		await this.setState({
			filterProvinceCodes: [code],
			isMap: false
		})

	}

	handleLineCheckboxChange = async (selected) => {
		await this.setState({
			filterProvinceCodes: selected
		})
	}

	convertToDateValue(date) {
		return moment(date).startOf('day').valueOf()
	} 

	convertToDateFormat(value) {
		return moment(value).format("DD MMMM YYYY")
	}

	componentWillMount() {
		this.getAllData();
	}

	handleButtonClick = async () => {
		await this.setState({
			isMap: !this.state.isMap
		})
	}

	handleChartView(first, latestDate) {
		if (this.state.isMap) {
			return(
				<div>
					<div className="row">
						<div className="col-8">

							<ChartMap 
								data={this.state.data[this.convertToDateValue(this.state.currentDate)]} // this.getFilteredMapTable()}
								col={this.state.filterMapValue}
								onClick={this.handleRegionClicked.bind(this)}
							/>
							<DateDiscreteSlider 
								latest={latestDate} 
								first={first}
								current={this.state.currentDate}
								onChange={this.handleSliderChange.bind(this)}
							/>
						</div>
						<div className='col-4'>
							<br/>
							<MapFilter 
								onChange={this.handleMapFilterChange.bind(this)}
								initValue={this.state.filterMapValue}
							/>
						</div>
						

						
					</div>
				</div>
			)
		} else {
			return(
				<div>
					<div className='row'>
						<div className="col">
							<MapFilter 
								onChange={this.handleMapFilterChange.bind(this)}
								initValue={this.state.filterMapValue}
							/>
							<MultiselectCheckboxes
								data={this.state.data[this.convertToDateValue(this.state.currentDate)]}
								opts={this.state.filterProvinceCodes}
								handleChange={this.handleLineCheckboxChange.bind(this)}
							/>
							
						</div>
						<div className="col">	
							
						</div>
						
						
				    </div>
				    <div className="row">
				    	<LineChart
							cols={this.state.filterProvinceCodes}
							data={this.state.data}
							currentDate={this.state.currentDate}
							latest={latestDate} 
							first={first}
						/>
				    </div>
				</div>
			)
		}
	}

	handleText() {
		if (this.state.isMap) {
			return(
				<div className="row">
					<div className="col">
						<h2>Peta Kasus COVID-19 Indonesia</h2>
						<h4>Tanggal: {this.convertToDateFormat(this.state.currentDate)}</h4>
					</div>
					<div className="col but">
						<Button 
							variant="primary" 
							onClick={this.handleButtonClick.bind(this)}
							className='float-right'
						>
						Lihat Tren Kasus >>
						</Button>
						<br/>
					</div>
				</div>
			)
		} else {
			return(
				<div className="row">
					<div className="col">
						<h2>Tren Kasus COVID-19 Indonesia</h2>
						<h4>Untuk Kasus Terkonfirmasi</h4>
						<br/>
					</div>
					<div className="col but">	
						<Button 
							variant="primary" 
							onClick={this.handleButtonClick.bind(this)}
							className='float-right'
						>
						Lihat Peta Kasus >>
						</Button>
					</div>
				</div>
			)
		}
	}


	render() {
		const latestDate = this.state.latestDate;
		const first = this.convertToDateValue("2020-03-02")

		return (
			<div className="App container">
				<h1>COVID-19 Indonesia</h1>
				{this.handleText()}
				{this.handleChartView(first, latestDate)}
			</div>
		);
	}

	
}

export default App;


/// <div className="row">
// 					<MapFilter 
// 						onChange={this.handleMapFilterChange.bind(this)}
// 						initValue={this.state.filterMapValue}
// 					/>
// 					<ChartMap 
// 						data={this.state.data[this.convertToDateValue(this.state.currentDate)]} // this.getFilteredMapTable()}
// 						col={this.state.filterMapValue}
// 						onClick={this.handleRegionClicked.bind(this)}
// 					/>

// 					<DateDiscreteSlider 
// 						latest={latestDate} 
// 						first={first}
// 						current={this.state.currentDate}
// 						onChange={this.handleSliderChange.bind(this)}
// 					/>
// 				</div>
// 				<div className='row'>
// 					<div className="col">	
// 						<MultiselectCheckboxes
// 							data={this.state.data[this.convertToDateValue(this.state.currentDate)]}
// 							opts={this.state.filterProvinceCodes}
// 							handleChange={this.handleLineCheckboxChange.bind(this)}
// 						/>
// 					</div>
// 					<div className="col">
// 						<LineChart
// 							cols={this.state.filterProvinceCodes}
// 							data={this.state.data}
// 							currentDate={this.state.currentDate}
// 							latest={latestDate} 
// 							first={first}
// 						/>
// 					</div>

					
					
// 			    </div>