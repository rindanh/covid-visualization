import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import moment from 'moment';
require('moment/locale/id');

const useStyles = makeStyles({
  root: {
    width: 600,
  },
});

function valuetext(value) {
  return moment(value).format("DD MMM YYYY");
}


export default function DateDiscreteSlider(props) {
  const classes = useStyles();
  const now = props.now
  const first = props.first
  const current = props.current
  const step = 86400000 // selisih satu hari


  const marks = [
    {
      value: first,
      label: valuetext(first)
    },
    {
      value: now,
      label: valuetext(now)
    }
  ]

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider" gutterBottom>
        Date Discrete Slider
      </Typography>
      <Slider
        onChange={(event, newVal) => props.onChange(newVal)}
        value={current}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={step}
        min={first}
        max={now}
        marks={marks}
      />
    </div>
  );
}