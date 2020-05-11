import React from 'react';
import { Chart } from "react-google-charts";

// import data from '../data/data.json';


export default function ChartMap(props) {

	const color1 = () => {
		if (props.col === 2) {
			// total kasus
			return '#6a89cc'
		} else
		if (props.col === 3) {
			// meninggal
			return '#f8c291'
		} else {
		}
	}
	
	const color2 = () => {
		if (props.col === 2) {
			// total kasus
			return '#4a69bd'
		} else
		if (props.col === 3) {
			// meninggal
			return '#e55039'
		} else {
			return '#78e08f'
		}
	}
	
	const color3 = () => {
		if (props.col === 2) {
			// total kasus
			return '#1e3799'
		} else
		if (props.col === 3) {
			// meninggal
			return '#eb2f06'
		} else {
			return '#38ada9'
		}
	}

	const color4 = () => {
		if (props.col === 2) {
			// total kasus
			return '#0c2461'
		} else
		if (props.col === 3) {
			// meninggal
			return '#b71540'
		} else {
			return '#079992'
		}
	}

	const options = {
		region: 'ID',
		resolution: 'provinces',
		displayMode: 'regions',
		colorAxis: {colors: [color1(), color2(), color3(), color4()]},
		backgroundColor: '#343A41',
		datalessRegionColor: '#87929f',
	};

	const chartEvents = [
		{
			eventName: "select",
			callback({ chartWrapper }) {
				var selection = chartWrapper.getChart().getSelection();
				var item = selection[0]
				props.onClick(item.row)
			}
		}
	];

	const getFilteredMapTable = () => {
		let tab = []
		props.data.map((row) => {
			let temp = []
			temp.push(row[0])
			temp.push(row[props.col])
			temp.push(row[5])
			tab.push(temp)
		})
		return tab;
	}
	
	return(
		<Chart
			width={'100%'}
			chartType="GeoChart"
			data={ getFilteredMapTable() }
			options={options}
			chartWrapperParams={{ view: { columns: [0, 1, 2] } }}
			// Note: you will need to get a mapsApiKey for your project.
			// See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
			mapsApiKey="AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY"
			rootProps={{ 'data-testid': '1' }}
			chartEvents={chartEvents}
			chartPackages={['corechart', 'controls']}
	    />
	)
}