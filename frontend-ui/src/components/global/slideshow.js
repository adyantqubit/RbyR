import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import config from "../../api/config";
import { picApi, SlideShowApi } from "../../api/service";
import style from "./slideshow.module.css";

function Slideshow() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const [pay, setpay] = useState([]);

  useEffect(() => {
    fun();
  }, []);

  const fun = async () => {
    await picApi().then((r) => {
      setpay([...r.j]);
      console.log(r);
    });
  };

  if (pay != null && pay.length > 0) {
    return (
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        className={style.car}
      >
        {pay.map((item) => (
          <Carousel.Item>
            <a href={`listing/${item.category}`}>
              {" "}
              <img
                className={style.dblock}
                // src={pay[0].src}
                src={config.apiBaseURL + item.src}
                alt="First slide"
              />
            </a>
            <Carousel.Caption>
              <h3>{item.label}</h3>
              <p>{item.about}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    );
  }
}

export default Slideshow;
