import React from 'react';
import './App.css';
import ChartMap from "./ChartMap";
import Slider from './Slider'
import DateSlider from './DateSlider'
// import SliderDate from './SliderDate'

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
			isEven:true,
			data:dataTable2
		}
	}

	handleClick() {
		if (this.state.isEven) {
			this.setState({
				isEven: !this.state.isEven,
				data: dataTable2
			})
		} else {
			this.setState({
				isEven: !this.state.isEven,
				data: dataTable1
			})
		}
	}


	render() {
		return (
			<div className="App container">
				<div className="row">
					<div className="col">
						<ChartMap data={this.state.data}/>

						<Slider />
						<DateSlider />
					</div>
					<div className="col">
						<button onClick={() => this.handleClick()}>Click me!</button>
					</div>
			    </div>
			</div>
		);
	}

	
}

export default App;
