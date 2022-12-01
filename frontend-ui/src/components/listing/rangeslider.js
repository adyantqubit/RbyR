import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./ratingSlider.css";
import style from './listpage.module.css'
import { CartState } from "../../context";


const MultiRangeSlider = ({ min, max,minS,maxS,onChange }) => {
  const [minVal, setMinVal] = useState(minS);
  const [maxVal, setMaxVal] = useState(maxS);
  const minValRef = useRef(minS);
  const maxValRef = useRef(maxS);
  const range = useRef(null);
  const {currency}=CartState()

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <>
    <span className={style.categ} style={{marginLeft:"10px"}}>
            Price Range
        </span>
     <form id="form_range_slider">  
    <div className="container">

    <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className="thumb thumb--right"
      />

      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
        }}
        className="thumb thumb--left"
        style={{ zIndex: minVal > max - 100 && "5" }}
      />


       

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
        <div className="slider__left-value">{currency.sign} {(minVal*currency.value).toFixed(2).replace(/\.0+$/,'')}</div>
        <div className="slider__right-value">{currency.sign} {(maxVal*currency.value).toFixed(2).replace(/\.0+$/,'')}</div>
      </div>
     
    </div>
    </form> 
    </>
  );
};

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

export default MultiRangeSlider;
