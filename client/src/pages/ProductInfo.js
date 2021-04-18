import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Accessible from "../layouts/Accessible";
import axios from "../axios";
import "../static/css/ProductInfo.css";
import StarIcon from "@material-ui/icons/Star";
import StarHalfIcon from "@material-ui/icons/StarHalf";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { useDispatch, useSelector } from "react-redux";
import ResponseHandler from "../components/ResponseHandler";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Price from "../components/Price";
import ProductActions from "../components/ProductActions";

function ProductInfo() {
  const { id } = useParams();
  const [productInfo, setProductInfo] = useState({});
  const [feedback, setFeedback] = useState({ open: false });
  const [feedbackForm, setFeedbackForm] = useState({ product_id: id });
  const user = useSelector((state) => state.userAccountInfo.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const getProductInfo = () => {
      axios
        .get(`/product/details/${id}/`)
        .then((response) => {
          setProductInfo(response.data);
        })
        .catch((error) => {
          dispatch({
            type: "SET_RESPONSE_MESSAGE",
            message: error.response,
          });
        });
    };
    getProductInfo();

    // closing feedback
    setFeedback({ open: false });
  }, [id, dispatch]);

  const getRating = (rating, length) => {
    rating = parseFloat(rating).toFixed(1) / (10 / length);
    const fullStar =
      rating >= Math.round(rating)
        ? Math.round(rating)
        : Math.round(rating - 1);
    const halfStar = rating < Math.round(rating) ? 1 : 0;
    const emptyStar = length - fullStar - halfStar;
    return (
      <>
        {new Array(fullStar).fill("_").map((_, i) => (
          <StarIcon key={i} className="material-icons" />
        ))}
        {new Array(halfStar).fill("_").map((_, i) => (
          <StarHalfIcon key={i} className="material-icons" />
        ))}
        {new Array(emptyStar).fill("_").map((_, i) => (
          <StarBorderIcon key={i} className="material-icons" />
        ))}
      </>
    );
  };

  const renderFeedback = () => {
    axios.get(`/product/feedback/${productInfo.id}/`).then((response) => {
      setFeedback({ open: true, feedbacks: response.data });
    });
  };

  const postFeedback = (event) => {
    event.preventDefault();

    axios
      .post("/product/feedback/", feedbackForm, {
        headers: {
          Authorization: `Token ${window.localStorage.getItem("Token")}`,
        },
      })
      .then((response) => {
        renderFeedback();
        dispatch({
          type: "SET_RESPONSE_MESSAGE",
          message: response,
        });
      })
      .catch((error) => {
        dispatch({
          type: "SET_RESPONSE_MESSAGE",
          message: error.response,
        });
      });

    event.target.reset();
  };
  const deleteFeedback = () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your feedback ?"
    );
    if (confirm) {
      axios
        .delete(`/product/feedback/${id}/`, {
          headers: {
            Authorization: `Token ${window.localStorage.getItem("Token")}`,
          },
        })
        .then((response) => {
          dispatch({
            type: "SET_RESPONSE_MESSAGE",
            message: response,
          });
          renderFeedback();
        })
        .catch((error) => {
          dispatch({
            type: "SET_RESPONSE_MESSAGE",
            message: error.response,
          });
        });
    }
  };
  return (
    <Accessible>
      <div className="productInfo">
        <p className="title">
          {productInfo.name}{" "}
          {productInfo.model_number && productInfo.model_number}
        </p>
        <div className="content">
          <div className="display">
            <img
              src={process.env.REACT_APP_SERVER_API + productInfo.picture}
              alt=""
            />
          </div>
          <div className="description">
            <h2>Product Description</h2>
            <div className="rating">
              <p>
                Rating:{" "}
                <span className="rating__number">
                  {parseFloat(productInfo.rating).toFixed(1)}{" "}
                </span>
              </p>

              <span className="material-icons">
                {productInfo.rating && getRating(productInfo.rating, 10)}
              </span>
            </div>
            <p className="detail">{productInfo.description}</p>
            <Price
              discount_price={productInfo.discount_price}
              price={productInfo.price}
            />
          </div>
        </div>
        <p className="date_details">
          <span>Date of registration: {productInfo.date_of_entry}</span>{" "}
          <span>Stock: {productInfo.stock} remaining</span>
        </p>

        <ProductActions product={productInfo} />
        <div className="feedback">
          <p
            onClick={renderFeedback}
            className={feedback.open ? "close" : "feedback_footer"}
          >
            Open Feedback
          </p>
          <div className={feedback.open ? "feedback_content" : "close"}>
            <p className="feedback_header">Leave a feedback</p>
            <ResponseHandler />

            <form
              onSubmit={postFeedback}
              className="message_form"
              type="submit"
            >
              <div className="flex-row">
                <textarea
                  onChange={(event) =>
                    setFeedbackForm({
                      ...feedbackForm,
                      message: event.target.value,
                    })
                  }
                  placeholder="Feedback Message"
                  type="text"
                ></textarea>
              </div>
              <div className="flex-row">
                <div className="feedback_rating">
                  <input
                    onChange={() =>
                      setFeedbackForm({ ...feedbackForm, rating: 10 })
                    }
                    value="10"
                    type="radio"
                    id="star1"
                  />
                  <label htmlFor="star1">
                    <span className="material-icons">
                      <StarIcon />{" "}
                    </span>
                  </label>

                  <input
                    onChange={() =>
                      setFeedbackForm({ ...feedbackForm, rating: 8 })
                    }
                    value="8"
                    type="radio"
                    id="star2"
                  />
                  <label htmlFor="star2">
                    <span className="material-icons">
                      <StarIcon />{" "}
                    </span>
                  </label>

                  <input
                    onChange={() =>
                      setFeedbackForm({ ...feedbackForm, rating: 6 })
                    }
                    value="6"
                    type="radio"
                    id="star3"
                  />
                  <label htmlFor="star3">
                    <span className="material-icons">
                      <StarIcon />{" "}
                    </span>
                  </label>

                  <input
                    onChange={() =>
                      setFeedbackForm({ ...feedbackForm, rating: 4 })
                    }
                    value="4"
                    type="radio"
                    id="star4"
                  />
                  <label htmlFor="star4">
                    <span className="material-icons">
                      <StarIcon />{" "}
                    </span>
                  </label>

                  <input
                    onChange={() =>
                      setFeedbackForm({ ...feedbackForm, rating: 2 })
                    }
                    value="2"
                    type="radio"
                    id="star5"
                  />
                  <label htmlFor="star5">
                    <span className="material-icons">
                      <StarIcon />{" "}
                    </span>
                  </label>
                </div>
                <button className="submit_button primary_btn">Submit</button>
              </div>
            </form>

            <div className="other_feedbacks">
              {feedback.feedbacks?.response.length > 0 ? (
                feedback.feedbacks.response.map((feed, i) => (
                  <div
                    key={i}
                    className={`user_feedback ${
                      user?.id === feed.user.id && "highlight"
                    }`}
                  >
                    <div className="user_feedback_meta">
                      <span>{feed.user.email}</span>

                      <div className="meta_row">
                        <span>{feed.date_of_entry}</span>
                        {user?.id === feed.user.id && (
                          <span className="user_feedback_delete">
                            <button
                              onClick={deleteFeedback}
                              className="delete secondary_btn"
                            >
                              Delete
                            </button>
                          </span>
                        )}
                      </div>

                      <span className="material-icons">
                        {getRating(feed.rating, 5)}
                      </span>
                    </div>
                    <p className="user_feedback_message">{feed.message}</p>
                  </div>
                ))
              ) : (
                <div>No Feedbacks yet for this product.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Accessible>
  );
}

export default ProductInfo;
