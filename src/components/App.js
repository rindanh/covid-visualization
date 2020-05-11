import React from 'react';
import {Nav, Navbar, Button} from 'react-bootstrap';
import './App.css';
import ChartMap from "./ChartMap";
import LineChart from './LineChart';
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
			firstDate: this.convertToDateValue("2020-03-02"),
			latestDate: moment().startOf('day').valueOf(),
			currentDate: moment().startOf('day').valueOf(),
			filterMapValue: 2, //total:2, meninggal:3, sembuh:4
			filterProvinceCodes: [], // pake index 0
			showIndo: true,
			isMap: true,
			activeKey: 1,
			kasusTerkini: {
				total: 0,
				sembuh: 0,
				meninggal: 0
			}
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

		this.setState({
			currentDate: latestDate,
			latestDate: latestDate,
			dataProvinces: arr,
			dataIndonesia: arrIndo,
			kasusTerkini: {
				total: arrIndo[latestDate][0],
				sembuh: arrIndo[latestDate][1],
				meninggal: arrIndo[latestDate][2]
			}
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

	showLineChart() {
		if (this.state.showIndo || this.state.filterProvinceCodes.length !== 0) {
			console.log("cuy")
			return this.drawLineChart()
			console.log("end bos")
		} else {
			return (
				<h4>Silahkan pilih provinsi terlebih dahulu untuk menampilkan grafik tren kasus.</h4>
			)
		}
	}

	showMultiSelectCheckboxes() {
		return (
			<MultiselectCheckboxes
				data={this.state.dataProvinces[this.convertToDateValue(this.state.currentDate)]}
				opts={this.state.filterProvinceCodes}
				handleChange={this.handleLineCheckboxChange.bind(this)}
				showIndo={this.state.showIndo}
			/>
		)
	}


	drawLineChart() {
		console.log("hei hambar")
		return (
			<LineChart
				cols={this.state.filterProvinceCodes}
				data={this.state.dataProvinces}
				dataIndo={this.state.dataIndonesia}
				currentDate={this.state.currentDate}
				latest={this.state.latestDate} 
				first={this.state.firstDate}
				filterkasus={this.state.filterMapValue}
				showIndo={this.state.showIndo}
			/>
		)
	}

	handleChartView(first, latestDate) {
		if (this.state.isMap) {
			return(
				<div>
					<div className="row">
						<div className="col-8">
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
							<br/>
							<br/>
						</div>
						<div className='col-4'>
							<br/>
							<br/>
							<h5>Tanggal: {this.convertToDateFormat(this.state.currentDate)}</h5>
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
						<div className="col-6">	
							<h5>Tambah Provinsi</h5>
							{this.showMultiSelectCheckboxes()}
						</div>
						<div className="col-2">
						</div>
						<div className="col-4">
							<MapFilter 
								onChange={this.handleMapFilterChange.bind(this)}
								initValue={this.state.filterMapValue}
							/>
							
						</div>
					
				    </div>
				    <div className="row" style={{marginTop: 30, marginBottom: 200}}>
				    	<div className="col">
				    		{this.showLineChart()}
				    	</div>
				    </div>
				</div>
			)
		}
	}

	handleText() {
		if (this.state.isMap) {
			return(
				<div className="row">
					<div className="col-8" style={{paddingBottom: 10}}>
						<h2>Peta Kasus COVID-19 Indonesia</h2>
					</div>
					<div className="col but">
						<Button 
							variant="secondary" 
							onClick={this.handleButtonClick.bind(this)}
							className='float-right'
						>
						Lihat Tren Kasus
						</Button>
						<br/>
					</div>
				</div>
			)
		} else {
			return(
				<div className="row">
					<div className="col-8">
						<h2 style={{paddingBottom: 10}}>Tren Kasus COVID-19 Indonesia</h2>
						<div className="petunjuk">Dapat dilihat pada bahwa setiap provinsi jumlah kasus COVID rata-rata memiliki kenaikan. Setiap harinya, kasus semakin bertambah. Hal ini menjadi perhatian lebih untuk para pemerintah untuk menekan jumlah kasus COVID di Indonesia</div>
						<br/>
					</div>
					<div className="col but">	
						<Button 
							variant="secondary" 
							onClick={this.handleButtonClick.bind(this)}
							className='float-right'
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
		const first = this.state.firstDate

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
					COVID-19 Indonesia
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
					<br/>
					<p className="text-caption">Kasus COVID-19 di Indonesia diawali dari temuan 2 kasus di Depok, Jawa Barat. Hingga hari ini ({this.convertToDateFormat(latestDate)}) sudah terdapat
					&nbsp;{this.state.kasusTerkini['total']} kasus yang telah menyebar di 34 provinsi. Oleh karena itu, pemerintah telah memberlakukan PSBB untuk 
					memperlambat laju penyebaran virus COVID-19</p><br/>
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
