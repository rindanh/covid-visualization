import React from 'react';
import Select from 'react-select';

export default function MultiselectCheckboxes(props) {

	const optionsProvince = props.data.slice(1,props.data.length).map((row, idx) => {
		return {
			label: row[1],
			value: idx // data pertama di idx 0
		}
	})

	const options = [{label: 'ALL', value:'ID'}].concat(optionsProvince)

	const selected = () => {
		let s = props.opts.map((opt) => {
			return options[opt+1]
		})

		if (props.showIndo) {
			s.push({label: 'ALL (INDONESIA)', value:'ID'})
		}

		console.log(s)

		return s;
		
	}

	const handleChange = (selected) => {
		
		selected = selected.map((s) => {
			return s.value
		})
		console.log(selected)

		let isIndoSelected = false
		selected = selected.filter((s) => {
			if (s==='ID') {
				isIndoSelected= true
			}
			return (s !== 'ID')
		})
		console.log(selected)
		props.handleChange(selected, isIndoSelected)
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