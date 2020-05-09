import React from 'react';
import ReactDatetimeSlider from 'react-datetime-slider';
import moment from 'moment';

// import 'node_modules/react-datetime-slider/css/ReactDatetimeSlider.css';
// import 'rc-slider/assets/index.css';
// import 'rc-tooltip/assets/bootstrap.css';

export default function SliderDate() {

	return(
		<div>
			<p>{moment().subtract(1, 'hour').valueOf()}</p>
			<p>{moment().valueOf()}</p>
		</div>


	)
}


/// <div>
// 	<ReactDatetimeSlider
// 	  min={moment().subtract(1, 'hour').valueOf()}
// 	  max={moment().valueOf()}
// 	  onChange={console.log}
// 	/>
// </div>