import React from 'react';
import ReactDropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const options = [
	{
		value: 'total',
		label: 'Kasus total'
	},
	{
		value: 'sembuh',
		label: 'Kasus sembuh',
	},
	{
		value: "meninggal",
		label: 'Kasus meninggal'
	}
]

export default function MapFilter(props) {

	const defaultOption = props.initValue //options[0]

	const handleChange = (e) => {
		props.onChange(e.value)
	}

	return(
		<div>
			Pilih kasus:
			<ReactDropdown options={options} onChange={handleChange} value={defaultOption} placeholder="Select an option" />
		</div>
	)
}