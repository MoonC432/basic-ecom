import React from "react";
import SelectProducts from "../components/SelectProducts";
import Accessible from "../layouts/Accessible";
import Carousel from "react-elastic-carousel";
import companyLogo from "../static/infoFiles/companyLogo";
import navigationalLink from "../static/infoFiles/navigationalLinks";
import axios from "../axios";

import "../static/css/Home.css";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import ResponseHandler from "../components/ResponseHandler";

function Home() {
  const dispatch = useDispatch();
  const [messageData, setMessageData] = useState({});
  const handleMessage = (event) => {
    setMessageData({ ...messageData, [event.target.name]: event.target.value });
  };
  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    await axios
      .post("/account/email-message/", messageData)
      .then((response) => {
        dispatch({
          type: "SET_RESPONSE_MESSAGE",
          message: response,
        });
        event.target.reset();
      })
      .catch((error) => {
        dispatch({
          type: "SET_RESPONSE_MESSAGE",
          message: error.response,
        });
      });
    dispatch({
      type: "SET_LOADING",
      loading: false,
    });
  };
  return (
    <Accessible>
      <div className="home">
        {/* banners */}
        <div className="landingPage">
          <Carousel
            enableAutoPlay={true}
            autoPlaySpeed={10000}
            showArrows={false}
            enableSwipe={false}
            pagination={false}
          >
            <div className="banner">
              <img
                src={process.env.PUBLIC_URL + "/images/banners/3.jpg"}
                alt=""
              />
              <div className="banner__title">
                <h2>Get Best Quality Straight From The Box</h2>
              </div>
            </div>
            <div className="banner">
              <img
                src={process.env.PUBLIC_URL + "/images/banners/2.jpg"}
                alt=""
              />
              <div className="banner__title">
                <h2>Claimable Certified Company Warranty</h2>
              </div>
            </div>
            <div className="banner">
              <img
                src={process.env.PUBLIC_URL + "/images/banners/1.jpg"}
                alt=""
              />
              <div className="banner__title">
                <h2>Cheapest In The Market</h2>
              </div>
            </div>
          </Carousel>
          <img
            src="https://lh3.googleusercontent.com/ogw/ADGmqu8hP0A9kHPPraRi5SP5jX6NoOAaID_4W7BM5TC3hw=s83-c-mo"
            alt=""
            className="ownerImg"
          />
          <div className="buttons">
            <HashLink smooth className="about" to="/#about">
              About us
            </HashLink>
            <HashLink smooth to="/#contact">
              <button className="primary_btn">Contact</button>
            </HashLink>
          </div>
        </div>

        {/* latest products */}
        <div id="latest"></div>
        <SelectProducts tag="latest" />
        <div id="featured"></div>
        <SelectProducts tag="featured" />

        {/* About Section */}
        <div id="about" className="about">
          <h3>About Us</h3>
          <div className="ownerInfo">
            <img
              src="https://lh3.googleusercontent.com/ogw/ADGmqu8hP0A9kHPPraRi5SP5jX6NoOAaID_4W7BM5TC3hw=s83-c-mo"
              alt=""
              className="ownerImg"
            />
            <div className="ownerDescription">
              Hi <br />I am (name) a (age) (gender) currently acting as a
              (designation) of (Bsn. Name) since the past (experience) years. I
              personally supervise over things concerning (roles / duties).
            </div>
          </div>
          <hr />
          <div className="businessInfo">
            <h3>Get Familiar with our Business</h3>
            <div className="businessDescription">
              <div className="header">
                <span>
                  Business Name Co. Inc. Pvt. Ltd. (Vat No. : 603620103)
                </span>
                <p>
                  Import / Export and Repairs of Laptops, Computers, Printers
                  and other electronic accessories.
                </p>
              </div>
              <div className="content">
                <div className="row">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/logo/quality.png`}
                    alt=""
                  />
                  <span>
                    We have the best quality products with vast variety.{" "}
                  </span>
                </div>
                <div className="row">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/logo/warranty.png`}
                    alt=""
                  />
                  <span>
                    International Warranty. Claiming warranty never been easier.{" "}
                  </span>
                </div>
                <div className="row">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/logo/cheap.png`}
                    alt=""
                  />
                  <span>
                    Get cheapest rates in the market of your favorite brand.{" "}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <hr />

          <div className="metaInfo">
            <div className="locationInfo">
              <span>Find us on map</span>
              <p>
                Nepal, Kathmandu, Newraod, Nachhen Galli, 44600, opposite to
                Civil Bank.
              </p>
              <iframe
                title="googleMap"
                className="googleMap"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.4659287689897!2d85.30971631453828!3d27.702897032295514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18551a6e083d%3A0xf07d0b209154a1ab!2sSai%20computer!5e0!3m2!1sen!2snp!4v1620364609685!5m2!1sen!2snp"
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
            <div className="companyLogo">
              {companyLogo.map((logo, i) => (
                <img key={i} draggable={false} src={logo} alt="" />
              ))}
            </div>
          </div>
        </div>
        <div id="contact" className="contact">
          <h3>Contact Details</h3>
          <div className="contactForm">
            <h4>Leave us an Email</h4>
            <form onSubmit={handleMessageSubmit}>
              <div className="md-col-12 row">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  value={messageData.email}
                  onChange={handleMessage}
                  className="form-control"
                  name="email"
                ></input>
              </div>
              <div className="md-col-12 row">
                <label className="form-label" htmlFor="message">
                  Message
                </label>
                <textarea
                  value={messageData.message}
                  onChange={handleMessage}
                  className="form-control"
                  name="message"
                  cols="30"
                  rows="10"
                ></textarea>
              </div>
              <button className="contactFormBtn btn btn-secondary">
                Submit
              </button>
            </form>
            <ResponseHandler />
          </div>
          <div className="contactDetails">
            <button
              onClick={() => {
                dispatch({
                  type: "SET_SUBSCRIBE",
                  open: true,
                });
              }}
              className="subscribeBtn"
            >
              Subscribe to our Newsletter
            </button>

            <div className="followLinks">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.facebook.com/Sai-Computer-104425248025077"
                className="facebookLink"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/icons/fbicon.png`}
                  alt=""
                />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://wa.me/9779841453623"
                className="whatsappLink"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/icons/whatsappicon.png`}
                  alt=""
                />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="mailto:rahulmunshi0@gmail.com"
                className="facebookLink"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/icons/gmailicon.png`}
                  alt=""
                />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://instagram.com"
                className="instagramLink"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/icons/instaicon.png`}
                  alt=""
                />
              </a>
            </div>
          </div>
          <div className="navigationalLinks">
            <h3>Navigational Links</h3>
            <div className="section">
              {navigationalLink.navigational.map((link, i) => (
                <HashLink key={i} smooth className="navLink" to={link.link}>
                  {link.name}
                </HashLink>
              ))}
            </div>
            <div className="section">
              <span>Contact 1</span>
              <span>Contact 2</span>
              <span>Email address</span>
            </div>
          </div>
        </div>
        <div className="copyrightFooter">
          <p>
            ©copyright 2021 All Rights Reserved.
            <Link to="/">Privacy | Policy</Link>
          </p>

          <p>
            Designed by{" "}
            <a href="https://github.com/pages/MoonC432">
              MoonC432 (Rahul Munshi)
            </a>
          </p>
        </div>
      </div>
    </Accessible>
  );
}

export default Home;
