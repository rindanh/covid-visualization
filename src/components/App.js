import React from 'react';
import './App.css';
import ChartMap from "./ChartMap";
import DateDiscreteSlider from './Slider'
import DateSlider from './DateSlider'
import SliderDate from './SliderDate'
import moment from 'moment';

const dataTable1 = [
	['Province', 'Total Case'],
	['ID-AC', 200],
	['ID-BA', 300],
	['ID-BB', 400],
	['ID-BT', 500],
	['ID-BE', 600],
	['ID-GO', 700],
]

const dataTable2 = [
	['Province', 'Total Case'],
	['ID-AC', 300],
	['ID-BA', 500],
	['ID-BB', 600],
	['ID-BT', 600],
	['ID-BE', 800],
	['ID-GO', 900],
]

class App extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			data:dataTable2,
			currentDate: this.getCurrentDate()
		}
	}

	getCurrentDate() {
		return moment().valueOf()
	}

	handleChange = (newValue) => {
		this.setState({
			currentDate: newValue
		})
		if (this.state.currentDate > moment("2020-04-01").valueOf()) {
			this.setState({
				data: dataTable2
			})
		} else {
			this.setState({
				data: dataTable1
			})
		}
	};


	render() {
		const now = moment().valueOf()
		const first = moment("2020-03-02").valueOf()

		return (
			<div className="App container">
				<div className="row">
					<ChartMap data={this.state.data}/>

					<DateDiscreteSlider 
						now={now} 
						first={first}
						current={this.state.currentDate}
						onChange={this.handleChange.bind(this)}
					/>
					<DateSlider />
					<SliderDate />
					
			    </div>
			</div>
		);
	}

	
}

export default App;
