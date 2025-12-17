/**Code added by Unnati on 30-05-2024
 * Reason-To have profile edit page
 */
import React, { useState, useContext, useEffect, useRef } from "react";
import ProfileEditStyle from "./ProfileEdit.module.css";
import { GlobalContext } from "../../context/Context";
import { updateUserDetails } from "../../Api/services";
import {
  checkIsEmailInvalid,
  checkIsEmpty,
  checkIsNotADigit,
} from "../../utils/validations";
import DatePicker from "react-datepicker";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Date_yyyy_mm_dd_Formatter } from "../../utils/DateFormat";
import { MdCalendarToday } from "react-icons/md";

const ProfileEdit = ({ onProfileEditSuccess }) => {
  const { user, setUser } = useContext(GlobalContext);
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  // Code changed by - Ashlekh on 21-11-2024
  // Reason - If dob is present in user then to select that dob else null
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(user.date_of_birth ? new Date(user.date_of_birth) : null);
  // End of code - Ashlekh on 21-11-2024
  // Reason - If dob is present in user then to select that dob else null
  // Added by - Ashlekh on 29-11-2024
  // Reason - useState for calendar
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  // End of code - Ashlekh on 29-11-2024
  // Reason - useState for calendar
  /**Code added by Unnati Bajaj on 30-05-2024
   * Reason -To scroll to the top when component loads
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  /**End of code addition by Unnati Bajaj on 30-05-2024
   * Reason -To scroll to the top when component loads
   */
  /**Code commented by Unnati on 27-10-2024
   * Reason-This code is not in use
   */
  // const [formData, setFormData] = useState({
  //   first_name: user.first_name,
  //   last_name: user.last_name  || "",
  //   email: user.email || "",
  //   contact_number: user.contact_number || "",
  //   gender: user.gender || "",
  //   /* Modified by jhamman on 23-10-2024
  //   Reason - changed value  because we used date picker*/
  //   // date_of_birth: user.date_of_birth || "",
  //   date_of_birth: selectedDate || "",
  //    /* End of modification by jhamman on 23-10-2024
  //   Reason - changed value because we used date picker*/
  // });
  /**End of code comment by Unnati on 27-10-2024
   * Reason-This code is not in use
   */
  /**Code added by Unnati on 27-10-2024
   * Reason-Added variable
   */
  const [formData, setFormData] = useState({
    first_name: " ",
    last_name: "",
    email: "",
    contact_number: "",
    gender: "",
    date_of_birth: "",
  });
  /**End of code addition by Unnati on 27-10-2024
   * Reason-Added variable
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleGenderClick = (gender) => {
    setFormData({ ...formData, gender });
  };

  /**
   * Added by - Unnati Bajaj on 30-05-2024
   * Reason - To validate input on blur
   */
  const isValidOnBlur = (input, value) => {
    if (input === "first_name") {
      if (checkIsEmpty(value)) {
        setFirstNameError("Please enter first name");
        return false;
      }
    }
    if (input === "email") {
      if (checkIsEmpty(value)) {
        setEmailError("Please enter email address");
        return false;
      } else {
        if (checkIsEmailInvalid(value)) {
          setEmailError("Please type correct email format");
          return false;
        }
      }
    }
  };

  /**
   * End of code addition by - Unnati Bajaj on 30-05-2024
   * Reason - To validate input on blur
   */

  /**Code added by Unnati on 30-06-2024
   * *Reason-To validate form fields on submit
   */
  const isValidOnSubmit = (data) => {
    if (checkIsEmpty(data.email)) {
      setEmailError("Please enter email address");
      return false;
    } else {
      if (checkIsEmailInvalid(data.email)) {
        setEmailError("Please type correct email format");
        return false;
      }
    }
    if (checkIsEmpty(data.first_name)) {
      setFirstNameError("Please enter first name");
      return false;
    } else {
      if (!checkIsNotADigit(data.first_name)) {
        setFirstNameError("Please enter a valid first name");
      }
    }

    return true;
  };
  /**End of code addition by Unnati on 30-06-2024
   * *Reason-To validate form fields on submit
   */

  /**Code added by Unnati on 30-06-2024
   * Reason -To update user details on form submit
   */
  const updateUserDetail = async (e) => {
    const userData = {
      first_name: e.target.first_name.value,
      last_name: e.target.last_name.value,
      email: e.target.email.value,
      contact_number: e.target.contact_number.value,
      gender: e.target.gender.value,
      /* Modified by jhamman on 23-10-2024
      Reason - changed date format before sending date in Backend*/
      // date_of_birth: e.target.date_of_birth.value,
      // Code changed by - Ashlekh on 21-11-2024
      // Reason - No date will save in backend, if user has not selected date
      // date_of_birth: Date_yyyy_mm_dd_Formatter(selectedDate),
      date_of_birth: selectedDate ? Date_yyyy_mm_dd_Formatter(selectedDate) : null,
      // End of code - Ashlekh on 21-11-2024
      // Reason - No date will save in backend, if user has not selected date
      /* End of modification by jhamman on 23-10-2024
      Reason - changed date format before sending date in Backend*/
    };

    if (isValidOnSubmit(userData)) {
      try {
        const response = await updateUserDetails(userData);

        if (response && response.user) {
          setUser(response.user);
          if (onProfileEditSuccess) {
            onProfileEditSuccess();
          }
        } else {
          console.error(
            "Error: Invalid response from updateUserDetails",
            response
          );
        }
      } catch (error) {
        console.error("Error updating user details:", error);
      }
    }
  };

  /**
   * End of code addition by - Unnati Bajaj on 30-05-2024
   * Reason - To update signup details when user submits the form
   */

  /**Code added by Unnati on 30-06-2024
   * Reason -To handle submit button
   */

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateUserDetail(e);
  };

  /**End of code addition by Unnati on 30-06-2024
   * Reason -To handle submit button
   */


  // Added by - Ashlekh on 29-11-2024
  // Reason - To handle date (selected by user) and to open calendar and to format date
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const toggleCalendar = () => {
    setShowCalendar((prev) => !prev);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };
  const handleOutsideClick = (event) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target)
    ) {
      setShowCalendar(false); 
    }
  };
  useEffect(() => {
    if (showCalendar) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showCalendar]);
  // End of code - Ashlekh on 29-11-2024
  // Reason - To handle date (selected by user) and to open calendar and to format date
  return (
    /**Code commented by Unnati on 17-08-2024
     * Reason-This part of the code is not in use
     */
    // <div className={ProfileEditStyle.pageFrame}>
    //   <div className={ProfileEditStyle.coloredBackground}>
    // <div className={ProfileEditStyle.pageContainer}>
    /**End of code comment by Unnati on 17-08-2024
     * Reason-This part of the code is not in use
     */
    <form className={ProfileEditStyle.form} onSubmit={handleSubmit}>
      {/* Modified by jhamman on 13-10-2024
    Reason - changed title*/}
      {/* <span className={ProfileEditStyle.heading}>Account Information</span> */}
      <span className={ProfileEditStyle.heading}>Profile Details</span>
      {/* End of modification by jhamman on 13-10-2024
    Reason - changed title*/}

      {/* <div className={ProfileEditStyle.profileImageWrapper}>
          <img
            className={ProfileEditStyle.profileImage}
            src="./profile.png"
            alt="Profile"
          />
        </div> */}
      {/**Code added by Unnati on 22-07-2024
       *Reason-Added my profile details like first name ,last name */}
      <div className={ProfileEditStyle.fieldset}>
        <div className={ProfileEditStyle.column}>
          <div className={ProfileEditStyle.mandatoryLabel}>
            <label className={ProfileEditStyle.legend}>First Name</label>
            <span className={ProfileEditStyle.mandatoryField}>* </span>
          </div>
          <input
            type="text"
            id="first_name"
            name="first_name"
            /**Code added by Unnati on 27-10-2024
             *Reason-Changed value to default value */
            defaultValue={user.first_name}
            /**End of code addition by Unnati on 27-10-2024
             *Reason-Changed value to default value */
            onChange={(e) => {
              setFirstNameError("");
              handleChange(e);
            }}
            onBlur={(e) => isValidOnBlur("first_name", e.target.value)}
            className={ProfileEditStyle.input}
          />
        </div>
      </div>
      <div className={ProfileEditStyle.formInputError}>{firstNameError}</div>

      <div className={ProfileEditStyle.fieldset}>
        <div className={ProfileEditStyle.column}>
          {/* Added by jhamman on 14-10-2024
          Reason - Added a div to apply css */}
          {/* Code changed by - Ashlekh on 20-11-2024
          Reason - To change classname of div */}
          {/* <div className={ProfileEditStyle.notMandatoryLabel}> */}
          <div className={ProfileEditStyle.lastNameLabel}>
            {/* End of code - Ashlekh on 20-11-2024
            Reason - To change classname of div */}
            {/* End of addition by jhamman on 14-10-2024
            Reason - Added a div to apply css */}
            <label className={ProfileEditStyle.legend}>Last Name</label>
          </div>
          <input
            type="text"
            id="last_name"
            name="last_name"
            /**Code added by Unnati on 27-10-2024
             *Reason-Changed value to default value */
            defaultValue={user.last_name}
            /**End of code addition Unnati on 27-10-2024
             *Reason-Changed value to default value */
            onChange={handleChange}
            className={ProfileEditStyle.input}
          />
        </div>
      </div>
      <div className={ProfileEditStyle.fieldset}>
        <div className={ProfileEditStyle.column}>
          <div className={ProfileEditStyle.mandatoryLabel}>
            <label className={ProfileEditStyle.legend}>Email</label>
            <span className={ProfileEditStyle.mandatoryField}
              // Added by - Ashlekh on 13-12-2024
              // Reason - To hide mandatory from email
              style={{display: "none"}}
              // End of code - Ashlekh on 13-12-2024
              // Reason - To hide mandatory from email
            >* </span>
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            style={{ backgroundColor: " #f0f0f0" }}
            onChange={(e) => {
              setEmailError("");
              // handleChange(e);
            }}
            onBlur={(e) => isValidOnBlur("email", e.target.value)}
            className={ProfileEditStyle.input}
            // Added by - Ashlekh on 13-12-2024
            // Reason - To disable email input field
            disabled={true}
            // End of code - Ashlekh on 13-12-2024
            // Reason - To disable email input field
          />
        </div>
      </div>
      <div className={ProfileEditStyle.formInputError}>{emailError}</div>

      <div className={ProfileEditStyle.fieldset}>
        <div className={ProfileEditStyle.column}>
          <div className={ProfileEditStyle.mandatoryLabel}>
            <label className={ProfileEditStyle.legend}>Contact Number</label>
          </div>
          <input
            type="tel"
            id="contact_number"
            name="contact_number"
            placeholder="Contact Number"
            /**Code added by Unnati on 27-10-2024
             *Reason-Changed value to default value */
            defaultValue={user.contact_number}
            /**End of code addition by Unnati on 27-10-2024
             *Reason-Changed value to default value */
            onChange={(e) => {
              handleChange(e);
            }}
            onBlur={(e) => isValidOnBlur("contact_number", e.target.value)}
            className={ProfileEditStyle.input}
          />
        </div>
      </div>

      <div className={ProfileEditStyle.fieldset}>
        <div className={ProfileEditStyle.column}>
          {/* Added by jhamman on 14-10-2024
          Reason - Added a div to apply css */}
          <div className={ProfileEditStyle.notMandatoryLabel}>
            {/* End of addition by jhamman on 14-10-2024
            Reason - Added a div to apply css */}
            <label className={ProfileEditStyle.legend}>Date of Birth</label>
          </div>

          {/* Modified by jhamman on 23-10-2024
          Reason - Changes made because we need to change format */}
          {/* <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            defaultValue={formData.date_of_birth}
            onChange={handleChange}
            className={ProfileEditStyle.input}
          /> */}
          {/* Code changed by - Ashlekh on 29-11-2024
          Reason - Used another library (Calendar from react-calendar) */}
          {/* <DatePicker
            showIcon
            toggleCalendarOnIconClick
            selected={selectedDate}
            id="date_of_birth"
            name="date_of_birth"
            onChange={(date) => {
              setSelectedDate(date);
            }}
            // Added by - Ashlekh on 21-11-2024
            // Reason - If no date is selected then to display default date format
            placeholderText="--/--/----"
            // End of code - Ashlekh on 21-11-2024
            // Reason - If no date is selected then to display default date format
            className={ProfileEditStyle.dateInput}
          /> */}
          <div className={ProfileEditStyle.calendarWrapper} ref={calendarRef}>
            <input
              type="text"
              value={formatDate(selectedDate)}
              readOnly
              onClick={toggleCalendar}
              className={ProfileEditStyle.dateInput}
              placeholder={user?.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString("en-US"): "--/--/----"}
            />
            {showCalendar && (
              <div className={ProfileEditStyle.calendarContainer}>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  className={ProfileEditStyle.calendar}
                />
              </div>
            )}
          </div>
          {/* End of code - Ashlekh on 29-11-2024
          Reason - Used another library (Calendar from react-calendar) */}
          {/* End of modification by jhamman on 23-10-2024
          Reason - Changes made because we need to change format */}
        </div>
      </div>
      {/**End of code addition by Unnati on 22-07-2024
       *Reason-Added my profile details like first name ,last name */}
      <div className={ProfileEditStyle.fieldset}>
        <div className={ProfileEditStyle.column}>
          {/* Added by jhamman on 14-10-2024
          Reason - Added a div to apply css */}
          <div className={ProfileEditStyle.notMandatoryLabelGender}>
            {/* End of addition by jhamman on 14-10-2024
            Reason - Added a div to apply css */}
            <label htmlFor="gender" className={ProfileEditStyle.legend}>
              Gender
            </label>
          </div>
          {/**Code added by Unnati on 24-08-2024
           *Reason-Change button to radio button */}
          <div className={ProfileEditStyle.genderContainer}>
            <label className={ProfileEditStyle.genderButton}>
              <input
                type="radio"
                name="gender"
                /**Code added by Unnati on 24-11-2024
                *Reason-Change 'm' to 'M' */
                // value="male"
                value="Male"
                /*End of code addition by Unnati on 24-11-2024
                *Reason-Change 'm' to 'M' */
                /**Code added by Unnati on 27-10-2024
                 *Reason-Changed checked to default checked */
                 /**Code added by Unnati on 24-11-2024
                *Reason-Change 'm' to 'M' */
                defaultChecked={user.gender === "Male"}
                /*End of code addition by Unnati on 24-11-2024
                *Reason-Change 'm' to 'M' */
                /**End of code addition by Unnati on 27-10-2024
                 *Reason-Changed checked to default checked */
                 /**Code added by Unnati on 24-11-2024
                *Reason-Change 'm' to 'M' */
                onChange={() => handleGenderClick("Male")}
                /*End of code addition by Unnati on 24-11-2024
                *Reason-Change 'm' to 'M' */
                className={ProfileEditStyle.radioInput}
              />
              Male
            </label>
            <label className={ProfileEditStyle.genderButton}>
              <input
                type="radio"
                name="gender"
                /*code addition by Unnati on 24-11-2024
                *Reason-Change 'f' to 'F' */
                // value="female"
                value="Female"
                /*End of code addition by Unnati on 24-11-2024
                *Reason-Change 'f' to 'F' */
                /**Code added by Unnati on 27-10-2024
                 *Reason-Changed checked to default checked */
                 /*code addition by Unnati on 24-11-2024
                *Reason-Change 'f' to 'F' */
                defaultChecked={user.gender === "Female"}
                 /*End of code addition by Unnati on 24-11-2024
                *Reason-Change 'f' to 'F' */
                /**End of code addition by Unnati on 27-10-2024
                 *Reason-Changed checked to default checked */
                 /*code addition by Unnati on 24-11-2024
                *Reason-Change 'f' to 'F' */
                onChange={() => handleGenderClick("Female")}
                 /*End of code addition by Unnati on 24-11-2024
                *Reason-Change 'f' to 'F' */
                className={ProfileEditStyle.radioInput}
              />
              Female
            </label>
            <label className={ProfileEditStyle.genderButton}>
              <input
                type="radio"
                name="gender"
                value="others"
                /**Code added by Unnati on 27-10-2024
                 *Reason-Changed checked to default checked */
                defaultChecked={user.gender === "others"}
                /*End of code addition by Unnati on 27-10-2024
                 *Reason-Changed checked to default checked */
                onChange={() => handleGenderClick("others")}
                className={ProfileEditStyle.radioInput}
              />
              Others
            </label>
            {/**End of code addition by Unnati on 24-08-2024
             *Reason-Change button to radio button */}
          </div>
        </div>
      </div>

      <button type="submit" className={ProfileEditStyle.submitButton}>
        Save
      </button>
    </form>
    // </div>
    //   </div>
    // </div>
  );
};

export default ProfileEdit;

/**End of code addition by Unnati on 30-05-2024
 * Reason-User can edit profile
 */
