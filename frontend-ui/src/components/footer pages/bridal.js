import React, { Fragment, useEffect, useState } from "react";
import Footer from "../global/footer";
import Navbar from "../global/NavHeader";
import style from "./bridal.module.css";
import { getBridalDetail } from "../../api/service";
import parse from "html-react-parser";
import config from "../../api/config";
import "./bridal.css";
import { postBridalDetails } from "../../api/service";
import { Checkbox, Form, Input, notification } from "antd";
import "../../context.css";

const Bridal = () => {
  notification.destroy();
  const { TextArea } = Input;
  const [bridalText, setBridalText] = useState([]);
  const [bridalForm] = Form.useForm();

  // Addition by Om shirvastava on 03-12-23
  // Reason : Need to clear the date value when form is submit
  function clearDateValue() {
    var a = (document.getElementById("date").value = "");
    console.log(a, "funcitonannnnn");
  }
  // End of Addition by Om shirvastava on 03-12-23
  // Reason : Need to clear the date value when form is submit
  useEffect(() => {
    getBridalText();
    window.scrollTo(0, 0);
  }, []);

  const getBridalText = async () => {
    const bridalData = await getBridalDetail();
    if (bridalData) {
      setBridalText(bridalData);
    }
  };

  const saveBridalDetails = async (formData) => {
    const bridalDetail = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      zipCode: formData.zipCode,
      message: formData.message,
      contactNumber: formData.contactNumber,
      dateOfWedding: document.getElementById("date").value
        ? document.getElementById("date").value
        : null,
      termsAndCondition: formData.termsAndConditions,
    };

    // dateOfWedding:formData.dateOfWedding,

    const bridalPostResponse = await postBridalDetails(bridalDetail);
    if (bridalPostResponse) {
      if (bridalPostResponse.msg) {
        bridalForm.resetFields();
        clearDateValue();
        // document.getElementById('date').value==null
        notification.open({
          message: "",
          description: "Bridal details posted successfully",
          onClick: () => {},
          key: 1,
          // style: { backgroundColor: "var(--bannerColor)" },
          // Modification and addition by Om shrivastava on 01-12-23
          // REason : Create the popup class to apply the designing
          className: "popupClass",
          // style:{marginTop:"20px"},
          // style:{backgroundColor: "#f1cdd9",
          // padding:'0px 5px 5px 5px',borderRadius:'10px',width:'200px'},
          // End of modification and addition by Om shrivastava on 01-12-23
          // REason : Create the popup class to apply the designing
        });
        // bridalForm.resetFields();
      } else {
        notification.open({
          message: "Message",
          description: "Some problem occured while posting the data",
          onClick: () => {},
          key: 1,
          // style: { backgroundColor: "var(--bannerColor)" },
          // Modification and addition by Om shrivastava on 01-12-23
          // REason : Create the popup class to apply the designing
          className: "popupClass",
          // style:{marginTop:"20px"},
          // style:{backgroundColor: "#f1cdd9",
          // padding:'0px 5px 5px 5px',borderRadius:'10px',width:'200px'},
          // End of modification and addition by Om shrivastava on 01-12-23
          // REason : Create the popup class to apply the designing
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className={style.container}>
        <div className="headingFooter"> Bridal </div>
        {bridalText.length > 0 ? (
          <>
            {bridalText.map((bridal) => {
              return (
                <div className={style.row}>
                  <div
                    className={`${style.column} ${style.col1}`}
                    style={{ maxHeight: "60vh", overflow: "auto" }}
                  >
                    <span className={style.title}>{parse(bridal.title)}</span>
                    <span className={style.subtitle}>
                      {parse(bridal.subtitle1)}
                    </span>
                    <span className={style.subtitle}>
                      {parse(bridal.subtitle2)}
                    </span>
                  </div>
                  <div className={`${style.column} ${style.col2}`}>
                    {/* //  Modification and addition by Om Shrivastava on 20-10-23
                    // Reason : when image is not add then show the blank div */}
                    {bridal.bridalImage ? (
                      <img
                        className={style.bridalImg}
                        //  Modification and addition by Om Shrivastava on 20-10-23
                        // Reason : Need to add right path for the image */
                        // src={config.staticBaseURL + bridal.bridalImage}
                        src={
                          config.staticBaseURL + "media/" + bridal.bridalImage
                        }
                        //  End of modification and addition by Om Shrivastava on 20-10-23
                        // Reason : Need to add right path for the image */
                      ></img>
                    ) : (
                      <></>
                    )}
                    {/* //  End of Modification and addition by Om Shrivastava on 20-10-23
                    // Reason : when image is not add then show the blank div */}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          // Modification and addition by Om shrivastava on 27-11-23
          // Reason : Set the designing of content
          // <div>Please provide Bridal detail</div>
          <div className={style.divContent}>Please provide Bridal detail</div>
          // End of Modification and addition by Om shrivastava on 27-11-23
          // Reason : Set the designing of content
        )}

        <Form
          className={style.form}
          layout="vertical"
          form={bridalForm}
          name="registerBridalInfo"
          onFinish={saveBridalDetails}
        >
          {/* Modification and addition by Om Shrivastava on 29-11-23
          Reason : Need to add the asterik sign and remove the field */}
          <div className={style.row}>
            <div className={`${style.column} ${style.formInputContainer}`}>
              <Form.Item
                required={false}
                name="firstName"
                label={
                  <label style={{ color: "black", fontWeight: "500" }}>
                    First name <span style={{ color: "red" }}> *</span>
                  </label>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter your first name",
                    whitespace: true,
                  },
                  {
                    message: "First name must have letters only",
                    pattern: new RegExp("^[a-zA-Z ]+$"),
                  },

                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject();
                      }
                      if (value.length < 2) {
                        return Promise.reject(
                          "First name should be minimum 2 characters long"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input className={style.formInput} maxLength={50} />
              </Form.Item>
              <Form.Item
                required={false}
                name="lastName"
                label={
                  <label style={{ color: "black", fontWeight: "500" }}>
                    Last name <span style={{ color: "red" }}> *</span>
                  </label>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter your last name",
                    whitespace: true,
                  },
                  {
                    message: "Last name must have letters only",
                    pattern: new RegExp("^[a-zA-Z ]+$"),
                  },

                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject();
                      }
                      if (value.length < 2) {
                        return Promise.reject(
                          "Last name should be minimum 2 characters long"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input className={style.formInput} maxLength={50} />
              </Form.Item>
              <Form.Item
                required={false}
                name="email"
                label={
                  <label style={{ color: "black", fontWeight: "500" }}>
                    E-mail address <span style={{ color: "red" }}> *</span>
                  </label>
                }
                // rules={[
                //   {
                //     required: true,
                //     type: "email",
                //     message: "Please enter your email address",
                //     whitespace: true,
                //   }
                // ]}
                hasFeedback
              >
                <Input className={style.formInput} maxLength={250} />
              </Form.Item>

              <Form.Item
                required={false}
                name="zipCode"
                label={
                  <label style={{ color: "black", fontWeight: "500" }}>
                    ZIP code <span style={{ color: "red" }}> *</span>
                  </label>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter your ZIP code",
                    whitespace: true,
                  },
                  {
                    message: "ZIP code must have digits only",
                    pattern: new RegExp("^[0-9]+$"),
                  },

                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject();
                      }
                      if (value.length != 6) {
                        return Promise.reject(
                          "ZIP code should be 6 digits long"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input className={style.formInput} maxLength={6} />
              </Form.Item>

              <Form.Item
                required={false}
                name="message"
                label={
                  <label style={{ color: "black", fontWeight: "500" }}>
                    Message to our consultants{" "}
                    <span style={{ color: "red" }}> *</span>
                  </label>
                }
                rules={[
                  {
                    required: true,
                    message: "This Field can't be blank",
                    whitespace: true,
                  },
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject();
                      }
                      if (value.length < 5) {
                        return Promise.reject(
                          "Message should be minimum 5 characters long"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                hasFeedback
              >
                <TextArea
                  className={style.formInput}
                  rows={4}
                  style={{ paddingLeft: "0px" }}
                  maxLength={255}
                />
              </Form.Item>
            </div>
            <div className={`${style.column} ${style.formInputContainer}`}>
              {/* <Form.Item
                
                name="lastName"
                label={<label style={{ color: "#fff",fontWeight:"500" }}>Last name</label>}
                rules={[
                  {
                    required: true,
                    message: "Please enter your last name",
                    whitespace: true,
                  },
                  {
                    message: "Last name must have letters only",
                    pattern: new RegExp("^[a-zA-Z ]+$"),
                  },

                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject();
                      }
                      if (value.length < 2) {
                        return Promise.reject(
                          "Last name should be minimum 2 characters long"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input className={style.formInput} maxLength={50} />
              </Form.Item> */}

              <Form.Item
                required={false}
                name="contactNumber"
                label={
                  <label style={{ color: "black", fontWeight: "500" }}>
                    Contact number <span style={{ color: "red" }}> *</span>
                  </label>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter your contact number",
                    whitespace: true,
                  },
                  {
                    message: "Contact number must have digits only",
                    pattern: new RegExp("^[0-9 ]+$"),
                  },

                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject();
                      }
                      if (value.length < 10) {
                        return Promise.reject(
                          "Contact number should be atleast 10 digits long"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input className={style.formInput} maxLength={15} />
              </Form.Item>

              {/* <Form.Item
                name="dateOfWedding"
                label={<label style={{ color: "#fff" ,fontWeight:"500"}}>Date of wedding</label>}
               
                // rules={[
                //   {
                //     required: true,
                //     message: "Please enter your wedding date",
                    
                //   },
                // ]}
                hasFeedback
              >
                <DatePicker disabledDate={d => !d  || d.isSameOrBefore(Date()) } className={style.formInput} maxLength={50} />
              </Form.Item> */}

              <label style={{ color: "black", fontWeight: "500" }}>
                Date of wedding
              </label>
              <input
                type="date"
                id="date"
                className={style.formInput}
                style={{ marginBottom: "20px" }}
              />

              <Form.Item
                required={false}
                name="termsAndConditions"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              "You must accept the terms and conditions"
                            )
                          ),
                  },
                ]}
              >
                <div style={{ display: "flex" }}>
                  <Checkbox
                    style={{ paddingRight: "10px" }}
                    id="termsAndConditionsCheck"
                  ></Checkbox>
                  <label className={style.lbl} for="termsAndConditionsCheck">
                    I understand and agree that registration on or use of the
                    site constitutes agreement to its User Agreement and Privacy
                    Policy.
                  </label>
                </div>
              </Form.Item>
              <input
                type="submit"
                value="BOOK NOW"
                className={style.itemButton}
              ></input>
            </div>
          </div>
        </Form>

        <div className={style.footerMargin} style={{ paddingTop: "80px" }}>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Bridal;
