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
  alignRight: {
    textAlign: 'right'
  },
  alignCenter: {
    textAlign: 'center',
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
    '&$active': {
      boxShadow: `0px 0px 0px 2px`,
    }
  },
  mark: {
    backgroundColor: 'white'
  },
  active: {},
  valueLabel: {
    // left: 'calc(-50% + 4px)',
    fontSize: 8
  },
  track: {
    height: 3,
  },
  rail: {
    color: '#6a89cc',
    opacity: 1,
    height: 3,
  },
  markLabel: {
    color: 'white',
    fontSize: 12
  },
  markLabelActive: {
    color: 'white'
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
      <Typography className={classes.alignRight} id="discrete-slider" style={{fontSize: 10}}>
      Keterangan: Provinsi Kalimantan Utara tidak tersedia pada peta ini karena tidak didukung oleh <i>platform</i>
      </Typography>
      <Typography id="discrete-slider" style={{fontSize: 10}}>
        Geser Untuk Mengatur Tanggal
      </Typography>
      <DateSlider
        onChange={(event, newVal) => props.onChange(newVal)}
        className={classes.alignCenter}
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
    </div>
  );
}