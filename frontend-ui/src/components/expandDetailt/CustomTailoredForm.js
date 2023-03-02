// Created by Ashish on 24-11-2022
// Reason - To Have custom tailored form functionality
import { style } from "@mui/system";
import { Form, Input, notification } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { postCustomTailoredDetails } from "../../api/service";
import customTailoredStyle from "./CustomTailoredForm.module.css";

function CustomTailoredForm() {
  const { TextArea } = Input;
  const [customTailoredRequestForm] = Form.useForm();

  const saveCustomTailoredDetails = async (formData) => {
    const customTailoredDetail = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      contactNumber: formData.contactNumber,
      shoulder: formData.shoulder,
      chest: formData.chest,
      upperChest: formData.upperChest,
      lowerChest: formData.lowerChest,
      dartPoint: formData.dartPoint,
      armhole: formData.armhole,
      armround: formData.armround,
      waist: formData.waist,
      lowerWaist: formData.lowerWaist,
      hips: formData.hips,
      length: formData.length,
      otherInstructions: formData.otherInstructions,
    };
    const customTailoredPostResponse = await postCustomTailoredDetails(
      customTailoredDetail
    );
    if (customTailoredPostResponse) {
      if (customTailoredPostResponse.msg) {
        
        notification.open({
          message: "",
          description: "Custom tailored request posted successfully",
          onClick: () => {},
        });
        customTailoredRequestForm.resetFields();
      } else {
        notification.open({
          message: "Message",
          description: "Some problem occured while posting the data",
          onClick: () => {},
        });
      }
    }
  };

  return (
    <div className={customTailoredStyle.formContainer}>
      <Form
        className={customTailoredStyle.form}
        layout="vertical"
        form={customTailoredRequestForm}
        name="customTailoredForm"
        onFinish={saveCustomTailoredDetails}
      >
        <div className={customTailoredStyle.row}>
          <div className={customTailoredStyle.column}>
            <Form.Item
              name="firstName"
              label={
                <label className={customTailoredStyle.label}>First name</label>
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
              <Input className={customTailoredStyle.formInput} maxLength={50} />
            </Form.Item>
          </div>

          <div className={customTailoredStyle.column}>
            <Form.Item
              name="lastName"
              label={
                <label className={customTailoredStyle.label}>Last name</label>
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
              <Input className={customTailoredStyle.formInput} maxLength={50} />
            </Form.Item>
          </div>
        </div>

        <div className={customTailoredStyle.row}>
          <div className={customTailoredStyle.column}>
            <Form.Item
              name="email"
              label={
                <label className={customTailoredStyle.label}>
                  E-mail address
                </label>
              }
              // rules={[
              //   {
              //     required: true,
              //     type: "email",
              //     message: "Please enter your email address",
              //     whitespace: true,
              //   },
              // ]}
              hasFeedback
            >
              <Input className={customTailoredStyle.formInput} maxLength={50} />
            </Form.Item>
          </div>

          <div className={customTailoredStyle.column}>
            <Form.Item
              name="contactNumber"
              label={
                <label className={customTailoredStyle.label}>Telephone</label>
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
                    if (value.length != 10) {
                      return Promise.reject(
                        "Contact number should be 10 digits long"
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              hasFeedback
            >
              <Input className={customTailoredStyle.formInput} maxLength={10} />
            </Form.Item>
          </div>
        </div>

        <div className={customTailoredStyle.row}>
          <div className={customTailoredStyle.column}>
            <Form.Item
              name="shoulder"
              label={
                <label className={customTailoredStyle.label}>Shoulder</label>
              }
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter shoulder size",
              //     whitespace: true,
              //   },
              //   () => ({
              //     validator(_, value) {
              //       if (!value) {
              //         return Promise.reject();
              //       }
              //       if (value.length < 2) {
              //         return Promise.reject(
              //           "shoulder size should be atleast 2 characters long"
              //         );
              //       }
              //       return Promise.resolve();
              //     },
              //   }),
              // ]}
              hasFeedback
            >
              <Input className={customTailoredStyle.formInput} maxLength={50} />
            </Form.Item>
          </div>
          <div className={customTailoredStyle.column}>
            <Form.Item
              name="chest"
              label={<label className={customTailoredStyle.label}>Chest</label>}
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter chest size",
              //     whitespace: true,
              //   },
              //   () => ({
              //     validator(_, value) {
              //       if (!value) {
              //         return Promise.reject();
              //       }
              //       if (value.length < 2) {
              //         return Promise.reject(
              //           "Chest size should be atleast 2 characters long"
              //         );
              //       }
              //       return Promise.resolve();
              //     },
              //   }),
              // ]}
              hasFeedback
            >
              <Input className={customTailoredStyle.formInput} maxLength={50} />
            </Form.Item>
          </div>
        </div>
        <div className={customTailoredStyle.row}>
          <div className={customTailoredStyle.column}>
            <Form.Item
              name="upperChest"
              label={
                <label className={customTailoredStyle.label}>Upper chest</label>
              }
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter upper chest size",
              //     whitespace: true,
              //   },
              //   () => ({
              //     validator(_, value) {
              //       if (!value) {
              //         return Promise.reject();
              //       }
              //       if (value.length < 2) {
              //         return Promise.reject(
              //           "Upper chest size should be atleast 2 characters long"
              //         );
              //       }
              //       return Promise.resolve();
              //     },
              //   }),
              // ]}
              hasFeedback
            >
              <Input className={customTailoredStyle.formInput} maxLength={50} />
            </Form.Item>
          </div>
          <div className={customTailoredStyle.column}>
            <Form.Item
              name="lowerChest"
              label={
                <label className={customTailoredStyle.label}>Lower chest</label>
              }
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter lower chest size",
              //     whitespace: true,
              //   },
              //   () => ({
              //     validator(_, value) {
              //       if (!value) {
              //         return Promise.reject();
              //       }
              //       if (value.length < 2) {
              //         return Promise.reject(
              //           "Lower chest size should be atleast 2 characters long"
              //         );
              //       }
              //       return Promise.resolve();
              //     },
              //   }),
              // ]}
              hasFeedback
            >
              <Input className={customTailoredStyle.formInput} maxLength={50} />
            </Form.Item>
          </div>
        </div>
        <div className={customTailoredStyle.row}>
          <div className={customTailoredStyle.column}>
            <Form.Item
              name="dartPoint"
              label={
                <label className={customTailoredStyle.label}>Dart point</label>
              }
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter dart point",
              //     whitespace: true,
              //   },
              //   () => ({
              //     validator(_, value) {
              //       if (!value) {
              //         return Promise.reject();
              //       }
              //       if (value.length < 2) {
              //         return Promise.reject(
              //           "Dart point should be atleast 2 characters long"
              //         );
              //       }
              //       return Promise.resolve();
              //     },
              //   }),
              // ]}
              hasFeedback
            >
              <Input className={customTailoredStyle.formInput} maxLength={50} />
            </Form.Item>
          </div>
          <div className={customTailoredStyle.column}>
            <Form.Item
              name="armhole"
              label={
                <label className={customTailoredStyle.label}>Armhole</label>
              }
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter armhole size",
              //     whitespace: true,
              //   },
              //   () => ({
              //     validator(_, value) {
              //       if (!value) {
              //         return Promise.reject();
              //       }
              //       if (value.length < 2) {
              //         return Promise.reject(
              //           "Armhole size should be atleast 2 characters long"
              //         );
              //       }
              //       return Promise.resolve();
              //     },
              //   }),
              // ]}
              hasFeedback
            >
              <Input className={customTailoredStyle.formInput} maxLength={50} />
            </Form.Item>
          </div>
        </div>
        <div className={customTailoredStyle.row}>
          <div className={customTailoredStyle.column}>
            <Form.Item
              name="armround"
              label={
                <label className={customTailoredStyle.label}>Armround</label>
              }
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter armround size",
              //     whitespace: true,
              //   },
              //   () => ({
              //     validator(_, value) {
              //       if (!value) {
              //         return Promise.reject();
              //       }
              //       if (value.length < 2) {
              //         return Promise.reject(
              //           "Armround size should be atleast 2 characters long"
              //         );
              //       }
              //       return Promise.resolve();
              //     },
              //   }),
              // ]}
              hasFeedback
            >
              <Input className={customTailoredStyle.formInput} maxLength={50} />
            </Form.Item>
          </div>
          <div className={customTailoredStyle.column}>
            <Form.Item
              name="waist"
              label={<label className={customTailoredStyle.label}>Waist</label>}
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter waist size",
              //     whitespace: true,
              //   },
              //   () => ({
              //     validator(_, value) {
              //       if (!value) {
              //         return Promise.reject();
              //       }
              //       if (value.length < 2) {
              //         return Promise.reject(
              //           "waist size should be atleast 2 characters long"
              //         );
              //       }
              //       return Promise.resolve();
              //     },
              //   }),
              // ]}
              hasFeedback
            >
              <Input className={customTailoredStyle.formInput} maxLength={50} />
            </Form.Item>
          </div>
        </div>
        <div className={customTailoredStyle.row}>
          <div className={customTailoredStyle.column}>
            <Form.Item
              name="lowerWaist"
              label={
                <label className={customTailoredStyle.label}>Low waist</label>
              }
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter low waist size",
              //     whitespace: true,
              //   },
              //   () => ({
              //     validator(_, value) {
              //       if (!value) {
              //         return Promise.reject();
              //       }
              //       if (value.length < 2) {
              //         return Promise.reject(
              //           "Low waist size should be atleast 2 characters long"
              //         );
              //       }
              //       return Promise.resolve();
              //     },
              //   }),
              // ]}
              hasFeedback
            >
              <Input className={customTailoredStyle.formInput} maxLength={50} />
            </Form.Item>
          </div>
          <div className={customTailoredStyle.column}>
            <Form.Item
              name="hips"
              label={<label className={customTailoredStyle.label}>Hips</label>}
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter hips size",
              //     whitespace: true,
              //   },
              //   () => ({
              //     validator(_, value) {
              //       if (!value) {
              //         return Promise.reject();
              //       }
              //       if (value.length < 2) {
              //         return Promise.reject(
              //           "Hips size should be atleast 2 characters long"
              //         );
              //       }
              //       return Promise.resolve();
              //     },
              //   }),
              // ]}
              hasFeedback
            >
              <Input className={customTailoredStyle.formInput} maxLength={50} />
            </Form.Item>
          </div>
        </div>
        <div className={customTailoredStyle.row}>
          <div className={customTailoredStyle.column}>
            <Form.Item
              name="length"
              label={
                <label className={customTailoredStyle.label}>Length</label>
              }
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter length",
              //     whitespace: true,
              //   },
              //   () => ({
              //     validator(_, value) {
              //       if (!value) {
              //         return Promise.reject();
              //       }
              //       if (value.length < 2) {
              //         return Promise.reject(
              //           "Length should be atleast 2 characters long"
              //         );
              //       }
              //       return Promise.resolve();
              //     },
              //   }),
              // ]}
              hasFeedback
            >
              <Input className={customTailoredStyle.formInput} maxLength={50} />
            </Form.Item>
          </div>
          <div className={customTailoredStyle.column}></div>
        </div>
        <div className={customTailoredStyle.row}>
          <div className={customTailoredStyle.column} style={{ width: "100%" }}>
            <Form.Item
              name="otherInstructions"
              label={
                <label style={{ color: "#212121", fontWeight: "500" }}>
                  Other Instructions
                </label>
              }
            >
              <TextArea
                className={customTailoredStyle.formInput}
                rows={5}
                maxLength={255}
              />
            </Form.Item>
          </div>
        </div>
        <div className={customTailoredStyle.row}>
          <div className={customTailoredStyle.column} style={{ width: "100%" }}>
            <input
              type="submit"
              value="SUBMIT"
              className={customTailoredStyle.itemButton}
              style={{
                marginTop: "3vh",
                marginBottom: "3vh",
                height: "5vh",
                alignSelf: "center",
              }}
            ></input>
          </div>
        </div>
      </Form>
    </div>
  );
}
export default CustomTailoredForm;
