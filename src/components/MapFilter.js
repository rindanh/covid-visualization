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
		label: 'Kasus sembuh',
	},
	{
		value: 3,
		label: 'Kasus meninggal'
	}
]

export default function MapFilter(props) {

	const defaultOption = options[props.initValue-1]

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