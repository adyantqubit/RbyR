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
import { Link, useNavigate } from "react-router-dom";
import { LikeDeleteApi } from "../../api/service";

const LikeCard = (props) => {
  const { like, setLike,currency ,setLikeDrawer} = CartState();
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
    nav(`/listing/${id.menu}/${id.category}/detail/${id.id}`);
    // window.location.reload(false);
  }

  async function likeDelete(product){
    const data={
      id:product.id
    }
    await LikeDeleteApi(data,localStorage.getItem('access_token'))

    if (like.filter((l) => l.id === product.id).length > 0) {
      const p = like.filter((i) => i.id !== product.id);
      setLike(p);
    } else {
      setLike([...like, product]);
    }
  }

  return (
    // Addition by Om Shrivastava on 02-12-23
    // Reaosn : Set the grid property
    <div className={style.mainDivDesign} 
    // style={{border:'1px solid black',display:'grid',gridTemplateColumns:'auto auto',}}
    >
      {like.length > 0 ? (
        like.map((l) => (
          <div style={{marginBottom:"3%"
          
          // flexWrap:'wrap'
          }}>
            <div className={style.wishContainer}>
              <img
                className={style.wishImage}
                src={config.staticBaseURL + l.img_main}
                onClick={(e) => openDetail(l)}
              ></img>
              <div className={style.wishItem}>
                <div className={style.wishItemTitleContainer}>
                  {" "}
                  <h3
                    className={style.wishItemTitle}
                    onClick={(e) => openDetail(l)}
                  >
                    {l.title.toLowerCase()}
                  </h3>
                  <TiDeleteOutline
                    className={style.wishItemCancelButton}
                    onClick={(e) => likeDelete(l)}
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
          <span>Your Wishlist is empty.</span>
          <br></br>
          <span className={style.para}>Don't hesitate and <Link to="/" className={style.para2} style={{color:"blue",fontWeight:'500'}} onClick={e=>setLikeDrawer(false)}>browse our catalog</Link> to find something beautiful for You!</span>
        </div>
      )}
    </div>
    // End of Addition by Om Shrivastava on 02-12-23
    // Reaon : Set the grid property
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
