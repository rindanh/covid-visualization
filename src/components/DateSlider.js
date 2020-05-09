import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}));



const DateSliderComponent = withStyles({
  root: {
    color: '#3a8589',
    height: 3,
    padding: '13px 0',
  },
  thumb: {
    height: 27,
    width: 27,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    marginTop: -12,
    marginLeft: -13,
    boxShadow: '#ebebeb 0px 2px 2px',
    '&:focus, &:hover, &$active': {
      boxShadow: '#ccc 0px 2px 3px 1px',
    },
    '& .bar': {
      // display: inline-block !important;
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1,
    },
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

function DateThumbComponent(props) {
  return (
    <span {...props}>
      <span className="bar" />
      <span className="bar" />
      <span className="bar" />
    </span>
  );
}

function valuetext(value) {
  return `Tanggal ${value}`;
}

export default function DateSlider() {
  const classes = useStyles();

  const now = moment().valueOf()

  const first = moment("2020-03-02").valueOf()

  const [value, setValue] = React.useState([now,now]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Typography gutterBottom>Date Slider 2</Typography>
      <DateSliderComponent
        ThumbComponent={DateThumbComponent}
        getAriaValueText={valuetext}
        min={first}
        max={now}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
      />
    </div>
  );
}

/// defaultValue={[now, now]}