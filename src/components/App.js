import React from 'react';
import {Nav, Navbar, Button} from 'react-bootstrap';
import './App.css';
import ChartMap from "./ChartMap";
import LineChart from './LineChart';
import LineChartMobile from './LineChartMobile';
import DateDiscreteSlider from './Slider'
import MultiselectCheckboxes from './MultiselectCheckboxes'
// import DateSlider from './DateSlider'
import MapFilter from './MapFilter'
import moment from 'moment';
import dataJson from '../data/data.json'; 
require('moment/locale/id');

class App extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			dataProvinces: [],// [[['Province', 'Total Case']]],
			dataIndonesia:[],
			latestDate: moment().valueOf(),
			currentDate: moment().valueOf(),
			filterMapValue: 2, //total:2, meninggal:3, sembuh:4
			filterProvinceCodes: [], // pake index 0
			showIndo: true,
			isMap: true,
			activeKey: 1
		}
	}

	getAllData() {
		let arr = {}
		let arrIndo = {}
		let latestDate;
		dataJson.data.map((d) => {
			d.date = this.convertToDateValue(d.date)

			// handle indo

			let tempIndo = []
			tempIndo.push(d.total)
			tempIndo.push(d.meninggal)
			tempIndo.push(d.sembuh)
			arrIndo[d.date] = tempIndo

			// handle provinsi
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

			arr[d.date] = temp
			latestDate = d.date
		})

		console.log(arrIndo)

		this.setState({
			currentDate: this.convertToDateValue(latestDate),
			latestDate: this.convertToDateValue(latestDate),
			dataProvinces: arr,
			dataIndonesia: arrIndo
		})

	}

	// combineData = () => {}

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
			isMap: false,
			showIndo: false,
			activeKey: 2
		})

	}

	handleLineCheckboxChange = async (selected, indo) => {
		console.log(indo)
		await this.setState({
			filterProvinceCodes: selected,
			showIndo: indo
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
		if (this.state.isMap == true) {
			this.setState({
				activeKey: 1
			})
		} else {
			this.setState({
				activeKey: 2
			})
		}
	}

	handleMap = async () => {
		await this.setState({
			isMap: true,
			activeKey: 1
		})
	}

	handleChart = async () => {
		await this.setState({
			isMap: false,
			activeKey: 2
		})
	}

	handleChartView(first, latestDate) {
		if (this.state.isMap) {
			return(
				<div>
					<div className="row container-fluid">
						<div className='col-sm-4 map-filter-mobile'>
							<br classname="br-mobile"/>
							<br classname="br-mobile"/>
							<h5>Tanggal: {this.convertToDateFormat(this.state.currentDate)}</h5>
							<br/>
							<MapFilter 
								onChange={this.handleMapFilterChange.bind(this)}
								initValue={this.state.filterMapValue}
							/>
						</div>
						<div className="col-sm-8">
							<div className='petunjuk-2'>
								Arahkan kursor pada daerah di peta untuk mengetahui jumlah kasus daerah tersebut<br/>
								Klik pada daerah di peta untuk diarahkan ke grafik tren kasus pada daerah tersebut
							</div>
							<ChartMap 
								data={this.state.dataProvinces[this.convertToDateValue(this.state.currentDate)]} // this.getFilteredMapTable()}
								col={this.state.filterMapValue}
								onClick={this.handleRegionClicked.bind(this)}
							/>
							<DateDiscreteSlider 
								latest={latestDate} 
								first={first}
								current={this.state.currentDate}
								onChange={this.handleSliderChange.bind(this)}
							/>
							<br classname="br-mobile"/>
							<br className="br-mobile"/>
						</div>
						<div className='col-sm-4 map-filter-web'>
							<br classname="br-mobile"/>
							<br classname="br-mobile"/>
							<h5>Tanggal: {this.convertToDateFormat(this.state.currentDate)}</h5>
							<br classname="br-mobile"/>
							<MapFilter 
								onChange={this.handleMapFilterChange.bind(this)}
								initValue={this.state.filterMapValue}
							/>
						</div>		
					</div>
				</div>
			)
		} else {
			if (window.innerWidth > 678){
				return(
					<div>
						<div className='row'>
							<div className="col-6">	
								<h5>Tambah Provinsi</h5>
								<MultiselectCheckboxes
									data={this.state.dataProvinces[this.convertToDateValue(this.state.currentDate)]}
									opts={this.state.filterProvinceCodes}
									handleChange={this.handleLineCheckboxChange.bind(this)}
									showIndo={this.state.showIndo}
								/>
							</div>
							<div className="col-2">
							</div>
							<div className="col-4 map-filter">
								<MapFilter 
									onChange={this.handleMapFilterChange.bind(this)}
									initValue={this.state.filterMapValue}
								/>
								
							</div>
						
						</div>
						<div className="row" style={{marginTop: 30, marginBottom: 200, width: '100%'}} media="screen and (min-width: 678px)">
							<LineChart
								cols={this.state.filterProvinceCodes}
								data={this.state.dataProvinces}
								dataIndo={this.state.dataIndonesia}
								currentDate={this.state.currentDate}
								latest={latestDate} 
								first={first}
								filterkasus={this.state.filterMapValue}
								showIndo={this.state.showIndo}
							/>
						</div>
					</div>
				)
			} else {
				return(
					<div>
						<div className='row container-fluid'>
							<div className="col-sm-6" style={{marginTop:-10, marginBottom: 15}}>	
								<h6>Tambah Provinsi</h6>
								<MultiselectCheckboxes
									data={this.state.dataProvinces[this.convertToDateValue(this.state.currentDate)]}
									opts={this.state.filterProvinceCodes}
									handleChange={this.handleLineCheckboxChange.bind(this)}
									showIndo={this.state.showIndo}
								/>
							</div>
							<div className="col-sm-2">
							</div>
							<div className="col-sm-4 map-filter">
								<MapFilter 
									onChange={this.handleMapFilterChange.bind(this)}
									initValue={this.state.filterMapValue}
								/>
								
							</div>
						
						</div>
						<div className="row" style={{marginTop: 30, marginBottom: 200, width: '100%'}} media="screen and (min-width: 678px)">
							<LineChartMobile
								cols={this.state.filterProvinceCodes}
								data={this.state.dataProvinces}
								dataIndo={this.state.dataIndonesia}
								currentDate={this.state.currentDate}
								latest={latestDate} 
								first={first}
								filterkasus={this.state.filterMapValue}
								showIndo={this.state.showIndo}
							/>
						</div>
					</div>
				)	
			}
		}
	}

	handleText() {
		if (this.state.isMap) {
			return(
				<div className="container-fluid row">
					<div className="title-peta-kasus col-sm-8">
						<h2>Peta Kasus COVID-19 Indonesia</h2>
					</div>
					<div className="col-sm-4 lihat-kasus-col">
						<Button 
							variant="primary" 
							onClick={this.handleButtonClick.bind(this)}
							className='lihat-kasus float-right'
						>
						Lihat Tren Kasus
						</Button>
						<br/>
					</div>
				</div>
			)
		} else {
			return(
				<div className="container-fluid row">
					<div className="title-peta-kasus col-sm-8">
						<h2 style={{paddingBottom: 10}}>Tren Kasus COVID-19 Indonesia</h2>
						<h4>Untuk Kasus Terkonfirmasi</h4>
						<div className="petunjuk">Dapat dilihat pada bahwa setiap provinsi jumlah kasus COVID rata-rata memiliki kenaikan. Setiap harinya, kasus semakin bertambah. Hal ini menjadi perhatian lebih untuk para pemerintah untuk menekan jumlah kasus COVID di Indonesia</div>
						<br/>
					</div>
					<div className="col-sm-4 lihat-peta-col">	
						<Button 
							variant="primary" 
							onClick={this.handleButtonClick.bind(this)}
							className='lihat-peta float-right'
						>
						Lihat Peta Kasus
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
			<div style={{backgroundColor:"#343A41", color:"White"}}>
				<Navbar bg="dark" variant="dark" fixed="top">
					<strong>
					<Navbar.Brand>
					<img
						src="https://image.flaticon.com/icons/svg/2659/2659980.svg"
						width="30"
						height="30"
						className="d-inline-block align-top"
					/>{' '}
					COVID-19
					</Navbar.Brand>
					<Nav activeKey={this.state.activeKey} className="mr-auto">
						<Nav.Link style={{fontSize:13}} onClick={this.handleMap} eventKey="1">Peta Kasus</Nav.Link>
						<Nav.Link style={{fontSize:13}} onClick={this.handleChart} eventKey="2">Tren Kasus</Nav.Link>
					</Nav>
					</strong>
				</Navbar>
				<div className="App container" style={{paddingTop:80}}>
					<br/>
					<h1>Persebaran COVID-19 di Indonesia</h1>
					<br class="br-mobile"/>
					<p className="text-caption">Kasus COVID-19 di Indonesia diawali dari temuan 2 kasus di Depok, Jawa Barat. Hingga saat ini sudah terdapat 
					13.112 kasus tersebut yang telah menyebar di 34 provinsi. Oleh karena itu, pemerintah telah memberlakukan PSBB untuk 
					memperlambat laju penyebaran virus COVID-19</p><br class="br-mobile"/>
					{this.handleText()}
					{this.handleChartView(first, latestDate)}
				</div>
				<div className="Footer">
					<img src="https://image.flaticon.com/icons/svg/2659/2659980.svg" width="65" height="65" style={{paddingBottom: 20}}></img>
					<p><b>
						13516013 Azka Nabilah Mumtaz<br/>
						13516091 Yasya Rusyda Aslina<br/>
						13516151 Rinda Nur Hafizha<br/>
					</b></p>
				</div>
			</div>
		);
	}

	
}

export default App;
