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
			return this.drawLineChart()
		} else {
			return (
				<h4>Silahkan pilih provinsi terlebih dahulu untuk menampilkan grafik tren kasus.</h4>
			)
		}
	}

	showLineChartMobile() {
		if (this.state.showIndo || this.state.filterProvinceCodes.length !== 0) {
			return this.drawLineChart()
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

	drawLineChartMobile() {
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
							<div className="col">
								{this.showLineChart()}
							</div>
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
							<div className='col'>
								{this.showLineChartMobile()}
							</div>
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
						<p className="petunjuk">Kasus COVID-19 sudah dimiliki semua provinsi di Indonesia, dengan Provinsi DKI Jakarta serta Pulau Jawa sebagai pemilik kasus terbanyak.</p>
					</div>
					<div className="col-sm-4 lihat-kasus-col">
						<Button 
							variant="secondary" 
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
						<div className="petunjuk">Dapat dilihat pada bahwa setiap provinsi jumlah kasus COVID-19 rata-rata memiliki kenaikan. Setiap harinya, kasus semakin bertambah. Hal ini menjadi perhatian lebih untuk para pemerintah untuk menekan jumlah kasus COVID di Indonesia
						dan tugas kita bersama untuk mengurangi angka kenaikan jumlah kasus COVID-19.</div>
						<br/>
					</div>
					<div className="col-sm-4 lihat-peta-col">	
						<Button 
							variant="secondary" 
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

	sunSymbol() {
		return(
			<svg class="bi bi-sun" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
			  <path d="M3.5 8a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"/>
			  <path fill-rule="evenodd" d="M8.202.28a.25.25 0 00-.404 0l-.91 1.255a.25.25 0 01-.334.067L5.232.79a.25.25 0 00-.374.155l-.36 1.508a.25.25 0 01-.282.19l-1.532-.245a.25.25 0 00-.286.286l.244 1.532a.25.25 0 01-.189.282l-1.509.36a.25.25 0 00-.154.374l.812 1.322a.25.25 0 01-.067.333l-1.256.91a.25.25 0 000 .405l1.256.91a.25.25 0 01.067.334L.79 10.768a.25.25 0 00.154.374l1.51.36a.25.25 0 01.188.282l-.244 1.532a.25.25 0 00.286.286l1.532-.244a.25.25 0 01.282.189l.36 1.508a.25.25 0 00.374.155l1.322-.812a.25.25 0 01.333.067l.91 1.256a.25.25 0 00.405 0l.91-1.256a.25.25 0 01.334-.067l1.322.812a.25.25 0 00.374-.155l.36-1.508a.25.25 0 01.282-.19l1.532.245a.25.25 0 00.286-.286l-.244-1.532a.25.25 0 01.189-.282l1.508-.36a.25.25 0 00.155-.374l-.812-1.322a.25.25 0 01.067-.333l1.256-.91a.25.25 0 000-.405l-1.256-.91a.25.25 0 01-.067-.334l.812-1.322a.25.25 0 00-.155-.374l-1.508-.36a.25.25 0 01-.19-.282l.245-1.532a.25.25 0 00-.286-.286l-1.532.244a.25.25 0 01-.282-.189l-.36-1.508a.25.25 0 00-.374-.155l-1.322.812a.25.25 0 01-.333-.067L8.203.28zM8 2.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" clip-rule="evenodd"/>
			</svg>
		)
	}

	showPersuasiveText() {
		if (this.state.isMap) {
			return(
				<div>
					<h6>Ayo bersama-sama kita patuhi aturan PSBB untuk mendukung pemerintah dalam menurunkan angka kasus sehingga daerah kita menjadi terang! {this.sunSymbol()}</h6>
					
				</div>
			) 
		} else {
			return(
				<h6>Ayo bersama-sama kita patuhi aturan PSBB untuk menurunkan tren kenaikan kasus pada grafik ini!</h6>
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

					<br class="br-mobile"/>
					<p className="text-caption">Kasus COVID-19 di Indonesia diawali dari temuan 2 kasus di Depok, Jawa Barat. Hingga hari ini ({this.convertToDateFormat(latestDate)}) sudah terdapat 
					&nbsp;{this.state.kasusTerkini['total']} kasus  yang telah menyebar di 34 provinsi. Oleh karena itu, pemerintah telah memberlakukan PSBB untuk 
					memperlambat laju penyebaran virus COVID-19</p><br class="br-mobile"/>
					{this.handleText()}
					{this.handleChartView(first, latestDate)}
				</div>
				<div className="Footer">
					<div className="persuasive-text">
						{this.showPersuasiveText()}
					</div>
					<br/>
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
