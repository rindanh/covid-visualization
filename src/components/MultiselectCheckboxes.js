import React from 'react';
import Select from 'react-select';

export default function MultiselectCheckboxes(props) {

	const options = props.data.slice(1,props.data.length).map((row, idx) => {
		return {
			label: row[1],
			value: idx // data pertama di idx 0
		}
	})

	const selected = () => {
		let s = []
		props.opts.map((opt) => {
			// console.log(opt)
			s.push(options[opt])
		})

		return s;
		
	}

	const handleChange = (selected) => {
		
		selected = selected.map((s) => {
			return s.value
		})
		props.handleChange(selected)
	}
	
	return(
		<Select
			value={selected()}
	        onChange={handleChange}
	        options={options}
	        isMulti
		/>

	)
}