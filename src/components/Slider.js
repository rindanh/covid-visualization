import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import moment from 'moment';
require('moment/locale/id');

const useStyles = makeStyles((theme) => ({
  root: {
    width: 730,
  },
  slider: {
    padding: '22px 0px',
  },
}));

const DateSlider = withStyles({
  root: {
    color: '#0c2461',
    height: 3,
    padding: '13px 0',
  },
  thumb: {
    height: 27,
    width: 27,
    backgroundColor: '#6a89cc',
    border: '1px solid currentColor',
    marginTop: -12,
    marginLeft: -13,
    '& .bar': {
      // display: inline-block !important;
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1,
    },
  },
  mark: {
    backgroundColor: 'white'
  },
  active: {},
  valueLabel: {
    // left: 'calc(-50% + 4px)',
  },
  track: {
    height: 3,
  },
  rail: {
    color: '#d8d8d8',
    opacity: 1,
    height: 3,
  },
})(Slider);

function valuetext(value) {
  return moment(value).format("DD MMM YYYY");
}


export default function DateDiscreteSlider(props) {
  const classes = useStyles();
  const latest = props.latest
  const first = props.first
  const current = props.current
  const step = 86400000 // selisih satu hari

  const marks = [
    {
      value: first,
      label: valuetext(first),
    },
    {
      value: latest,
      label: valuetext(latest),
    }
  ]

  return (
    <div className={classes.root}>
      <DateSlider
        onChange={(event, newVal) => props.onChange(newVal)}
        value={current}
        valueLabelFormat={valuetext}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={step}
        min={first}
        max={latest}
        marks={marks}
      />
      <Typography id="discrete-slider" gutterBottom>
        Geser Untuk Mengatur Tanggal
      </Typography>
    </div>
  );
}