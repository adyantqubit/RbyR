import React from "react";

import PropTypes from "prop-types";

import style from "./likeCard.module.css";
import {
  useGetLikedProductQuery,
  useLikedUpdateMutation,
} from "../../Redux-manage/services/userAuthapi";
import { CartState } from "../../context";
import { getToken } from "../../Redux-manage/services/localStorageService";
import config from "../../api/config";
import styles from "./cartCard.module.css";
import { TiDeleteOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const LikeCard = (props) => {
  const { like, setLike,currency } = CartState();
  let { access_token } = getToken();
  const [saveLikeApi, { isLoading }] = useLikedUpdateMutation();

  const LikedSave = async (product) => {
    const data = {
      item: product.id,
      size: product.size,
    };

    const resp = await saveLikeApi({ data, access_token });

    if (like.filter((l) => l.id === product.id).length > 0) {
      var p = like.filter((i) => i.id != product.id);
      setLike([...p]);
    } else {
      setLike([...like, product]);
    }
  };

  const nav = useNavigate();
  function openDetail(id) {
    nav(`/listing/${id.category}/detail/${id.id}`);
    // window.location.reload(false);
  }

  return (
    <>
      {like.length > 0 ? (
        like.map((l) => (
          <div style={{marginBottom:"3%"}}>
            <div className={style.wishContainer}>
              <img
                className={style.wishImage}
                src={config.apiBaseURL + l.img_main}
                onClick={(e) => openDetail(l)}
              ></img>
              <div className={style.wishItem}>
                <div className={style.wishItemTitleContainer}>
                  {" "}
                  <h3
                    className={style.wishItemTitle}
                    onClick={(e) => openDetail(l)}
                  >
                    {l.title}
                  </h3>
                  <TiDeleteOutline
                    className={style.wishItemCancelButton}
                    onClick={(e) => LikedSave(l)}
                  ></TiDeleteOutline>
                </div>
                <div className={style.wishItemBodyContainer}>
                  <div className={style.itemText}>{l.category}</div>
                  <div className={style.itemText}> {currency.sign} {(l.price*currency.value).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={style.emptyWishList}>
          <span>Your wishlist is empty.</span>
          <br></br>
          <span className={style.para}>Don't hesitate and browse our catalog to find something beautiful for You!</span>

        </div>
      )}
    </>
  );
};

LikeCard.defaultProps = {
  image_src: "https://play.teleporthq.io/static/svg/default-img.svg",
  image_alt: "image",
  heading: "Heading",
  text: "Text",
  heading1: "Heading",
  button: "Button",
};

LikeCard.propTypes = {
  image_src: PropTypes.string,
  image_alt: PropTypes.string,
  heading: PropTypes.string,
  text: PropTypes.string,
  heading1: PropTypes.string,
  button: PropTypes.string,
};

export default LikeCard;
