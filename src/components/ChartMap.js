import React from 'react';
import ReactDOM from 'react-dom';
import { Chart } from "react-google-charts";

// import data from '../data/data.json';



const options = {
	region: 'ID',
	resolution: 'provinces',
	displayMode: 'regions'
};


export default function ChartMap(props) {

	const chartEvents = [
		{
			eventName: "select",
			callback({ chartWrapper }) {
				// console.log("Selected ", chartWrapper.getChart().getSelection());
				var selection = chartWrapper.getChart().getSelection();
				var message = '' , str = '';
				var dataTable = chartWrapper.getDataTable()

				for (var i = 0; i < selection.length; i++) {
					var item = selection[i];
					if (item.row != null && item.column != null) {
						message += '{row:' + item.row + ',column:' + item.column + '}';
						str = dataTable.getFormattedValue(item.row, item.column);
					} else if (item.row != null) {
						message += '{row:' + item.row + '}';
						str = dataTable.getFormattedValue(item.row, 0);
					} else if (item.column != null) {
						message += '{column:' + item.column + '}';
						str = dataTable.getFormattedValue(0, item.column);
					}

				}
				if (message === '') {
					message = 'nothing';
				}
				console.log('You selected ' + message + "\n" + str);
				props.onClick(item.row)
			}
		}
	];

	const getFilteredMapTable = () => {
		let tab = []

		props.data.map((row) => {
			let temp = []
			temp.push(row[0])
			temp.push(row[1])
			temp.push(row[props.col])
			tab.push(temp)
		})
		return tab;
	}
	
	return(
		<Chart
			width={'1000px'}
			height={'600px'}
			chartType="GeoChart"
			data={ getFilteredMapTable() }
			options={options}
			chartWrapperParams={{ view: { columns: [0, 2] } }}
			// Note: you will need to get a mapsApiKey for your project.
			// See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
			mapsApiKey="AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY"
			rootProps={{ 'data-testid': '1' }}
			chartEvents={chartEvents}
	    />
	)
}
