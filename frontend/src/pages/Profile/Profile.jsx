import React, { useState, useContext } from "react";
import ProfileStyle from "./Profile.module.css";
import { GlobalContext } from "../../context/Context";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useContext(GlobalContext);

  const navigate = useNavigate();
  const handleEdit = () => {
    navigate("/profileEdit");
  };

  return (
    <div className={ProfileStyle.pageFrame}>
      <div className={ProfileStyle.coloredBackground}>
        <div className={ProfileStyle.pageContainer}>
          <form className={ProfileStyle.form}>
            <div className={ProfileStyle.formGroup}>
              <label htmlFor="firstName" className={ProfileStyle.label}>
                Full name:
              </label>
              <div className={ProfileStyle.value}>
                {user.first_name} {user.last_name}
              </div>
            </div>
            <div className={ProfileStyle.formGroup}>
              <label htmlFor="email" className={ProfileStyle.label}>
                Email:
              </label>
              <div className={ProfileStyle.value}>{user.email}</div>
            </div>
            <div className={ProfileStyle.formGroup}>
              <label htmlFor="phone" className={ProfileStyle.label}>
                Phone Number:
              </label>
              <div className={ProfileStyle.value}>{user.contact_number}</div>
            </div>
            <div className={ProfileStyle.formGroup}>
              <label htmlFor="phone" className={ProfileStyle.label}>
                Gender
              </label>
              <div className={ProfileStyle.value}>-not added-</div>
            </div>
            <div className={ProfileStyle.formGroup}>
              <label htmlFor="phone" className={ProfileStyle.label}>
                Date of Birth
              </label>
              <div className={ProfileStyle.value}>-not added-</div>
            </div>
            <button
              type="button"
              onClick={handleEdit}
              className={ProfileStyle.editButton}
            >
              Edit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
