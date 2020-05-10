import React from 'react';
import ReactDropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const options = [
	{
		value: 1,
		label: 'Kasus Terkonfirmasi'
	},
	{
		value: 2,
		label: 'Kasus Meninggal',
	},
	{
		value: 3,
		label: 'Kasus Sembuh'
	}
]

export default function MapFilter(props) {

	const defaultOption = options[props.initValue-2]

	const handleChange = (e) => {
		props.onChange(e.value+1)
	}

	return(
		<div>
			<h5 className="align-left">Pilih kasus:</h5>
			<ReactDropdown options={options} onChange={handleChange} value={defaultOption} placeholder="Select an option" />
		</div>
	)
}