/**
 * Created by - Ashish Dewangan on 24-05-2024
 * Reason - To have header component
 */
import React, { useEffect, useState } from "react";
import headerStyle from "./header.module.css";
import config from "../../Api/config";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { FiShoppingCart} from "react-icons/fi";
/**Added by - Unnati Bajaj on 26-05-2024
 * Reason- To import globalcontext,navigate and profile icon
 * */
import { GlobalContext } from "../../context/Context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { getCategory } from "../../Api/services";
/**End of code addition by - Unnati Bajaj on 26-05-2024
 * Reason- To import globalcontext,navigate and profile icon
 */

const Header = () => {
  const [logo, setLogo] = useState("");
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  /**
   * Added by - Unnati Bajaj on 26-05-2024
   * Reason - Implementing user logout functionality
   */
  const { user, setUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser({});
    navigate("/login");
  };

  const SubCategories = ({ subcategories }) => {
    return (
      <ul className={headerStyle.dropdown}>
        {subcategories.map((subcat, subIndex) => (
          <li key={subcat.id} className={headerStyle.dropdownItem}>
            <span className={headerStyle.dropdownText}>{subcat.name}</span>
            {subcat.children && (
              <ul className={headerStyle.subdropdown}>
                {subcat.children.map((subItem) => (
                  <li key={subItem.id} className={headerStyle.dropdownItem}>
                    <span className={headerStyle.dropdownText}>
                      {subItem.name}
                    </span>
                    {subItem.children && (
                      <ul className={headerStyle.subdropdown}>
                        {subItem.children.map((subSubItem) => (
                          <li
                            key={subSubItem.id}
                            className={headerStyle.dropdownItem}
                          >
                            <span className={headerStyle.dropdownText}>
                              {subSubItem.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  /**End of code addition by Unnati Bajaj on 26-05-2024
   * Reason -Implementing user logout functionality
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategory();
        setCategory(data.categoryList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    getHeaderLogo();
  }, []);

  const getHeaderLogo = async () => {};

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className={headerStyle.mainHeaderContainer}>
      <div className={headerStyle.section1}>
        <div className={headerStyle.headerItem}>
          {logo?.length > 0 ? (
            <Link to="/">
              <img
                src={config.baseURL + logo}
                alt=""
                className={headerStyle.logo}
              />
            </Link>
          ) : (
            <div className={headerStyle.logo}>LOGO</div>
          )}
        </div>
        <div className={headerStyle.headerItem}>
          <div className={headerStyle.searchInput}></div>
        </div>
      </div>

      <div className={headerStyle.section2}>
        <ul className={headerStyle.navlinks}>
          <li className={headerStyle.navitem}>
            <span
              className={`${headerStyle.headerItem} ${headerStyle.link} ${headerStyle.headerFont}`}
            >
              CATEGORIES
            </span>
            {category && <SubCategories subcategories={category} />}
          </li>
          <li className={headerStyle.navitem}>
            <span
              className={`${headerStyle.headerItem} ${headerStyle.link} ${headerStyle.headerFont}`}
            >
              BRANDS
            </span>
          </li>
          <li className={headerStyle.navitem}>
            <span
              className={`${headerStyle.headerItem} ${headerStyle.link} ${headerStyle.headerFont}`}
            >
              SECURITY
            </span>
          </li>
          <li className={headerStyle.navitem}>
            <span
              className={`${headerStyle.headerItem} ${headerStyle.link} ${headerStyle.headerFont}`}
            >
              POLICE
            </span>
          </li>
          <li className={headerStyle.navitem}>
            <Link
              to="/"
              className={`${headerStyle.headerItem} ${headerStyle.link} ${headerStyle.headerFont}`}
            >
              HOME
            </Link>
          </li>

          {user && user.email ? (
            <>
              <li className={headerStyle.navitem}>
                <div
                  onClick={toggleDropdown}
                  className={`${headerStyle.headerFont} ${headerStyle.icon}`}
                >
                  <CgProfile />
                </div>
                <ul className={headerStyle.dropdown}>
                  <li className={headerStyle.dropdownItem}>
                    <Link
                      className={headerStyle.dropdownText}
                      to={`/profileEdit`}
                    >
                      Hello! {user.first_name}
                    </Link>
                  </li>
                  <li className={headerStyle.dropdownItem}>
                    <span
                      className={headerStyle.dropdownText}
                      onClick={handleLogout}
                    >
                      Logout
                    </span>
                  </li>
                </ul>
              </li>
            </>
          ) : (
            <li className={headerStyle.navitem}>
              <Link
                to="/login"
                className={`${headerStyle.headerItem} ${headerStyle.link} ${headerStyle.headerFont}`}
              >
                LOGIN
              </Link>
            </li>
          )}
          <li className={headerStyle.navitem}>
            <FiShoppingCart
              className={`${headerStyle.headerFont} ${headerStyle.icon}`}
            />
          </li>
        </ul>
        <div className={headerStyle.HamburgerMenu}>
          <GiHamburgerMenu
            onClick={toggleDrawer}
            className={`${headerStyle.button}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
