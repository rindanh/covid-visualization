import React from 'react';
import ReactDropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const options = [
	{
		value: 1,
		label: 'Kasus total'
	},
	{
		value: 2,
		label: 'Kasus meninggal',
	},
	{
		value: 3,
		label: 'Kasus sembuh'
	}
]

export default function MapFilter(props) {

	const defaultOption = options[props.initValue-2]

	const handleChange = (e) => {
		props.onChange(e.value+1)
	}

	return(
		<div>
			<h3 className="align-left">Pilih kasus:</h3>
			<ReactDropdown options={options} onChange={handleChange} value={defaultOption} placeholder="Select an option" />
		</div>
	)
}