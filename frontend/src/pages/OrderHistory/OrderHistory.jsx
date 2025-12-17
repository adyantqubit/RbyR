/**Code added by Unnati on 02-08-2024
 * Reason-To have Order history page
 */

import React, { useState, useEffect, useContext } from "react";
import OrderHistoryStyle from "./OrderHistory.module.css";
import { GlobalContext } from "../../context/Context";
import { getOrderHistory, getSearchedOrder } from "../../Api/services";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
/**Code added by Unnati on 03-10-2024
 * Reason-Added imports for date picker and pagination
 */
import { Pagination } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
/**End of code addition by Unnati on 03-10-2024
 * Reason-Added imports for date picker and pagination
 */
import { DateFormatter } from "../../utils/DateFormat";
const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [defaultOrderHistory, setDefaultOrderHistory] = useState([]);
  const { user } = useContext(GlobalContext);
  /**Code added by Unnati on 03-10-2024
   * Reason-Added variables for pagination
   */
  const [listPerPage, setListPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  /**End of code addition by Unnati on 03-10-2024
   * Reason-Added variables for pagination
   */
  const navigate = useNavigate();
  /**Code added by Unnati Bajaj on 02-08-2024
   * Reason -To get order history when the component loads
   */
  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        /**Code added by Unnati on 03-10-2024
         * Reason-Added currentPage and listPerPage
         */
        const data = await getOrderHistory(user.id, currentPage, listPerPage);
        /**End of code addition by Unnati on 03-10-2024
         * Reason-Added currentPage and listPerPage
         */
        setOrderHistory(data.orderSummary);
        setTotalProducts(data.total);
        /**Code added by Unnati on 17-10-2024
         * Reason-To set default orderhistory in a variable
         */
        setDefaultOrderHistory(data.orderSummary);
        /**End of code addition by Unnati on 17-10-2024
         * Reason-To set default orderhistory in a variable
         */
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchOrderHistory();
    /**Code added by Unnati on 30-09-2024
     * Reason-Added current page and list per page for pagination
     */
  }, [user.id, currentPage, listPerPage]);
  /**End of code addition by Unnati on 30-09-2024
   * Reason-Added current page and list per page for pagination
   */
  /**End of code addition by Unnati Bajaj on 02-08-2024
   * Reason -To get order history when the component loads
   */

  /**Code commented by Unnati on 16-10-2024
   * Reason-To handleListPerPage
   */
  // const handleListsPerPageChange = (event) => {
  //   setListPerPage(event.target.value);
  //   setCurrentPage(1);
  // };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  /**End of code addition by Unnati on 30-09-2024
   * Reason-To handleListPerPage
   */
  /**Code added by Unnati on 03-08-2024
   * Reason-To pass orders from order history page to order detail page
   */
  const handleViewOrder = (order) => {
    navigate(`/orderdetail/${order.id}`, { state: { order } });
  };
  /**End of code addition by Unnati on 03-08-2024
   * Reason-To pass orders from order history page to order detail page
   */
  /**Code added by Unnati on 03-10-2024
   * Reason-To fetchSearchOrder
   */
  const fetchSearchOrder = async () => {
    try {
      const formattedDate = selectedDate
        ? format(selectedDate, "yyyy-MM-dd")
        : "";
      setSelectedDate(formattedDate);
      const data = await getSearchedOrder(
        searchTerm,
        formattedDate,
        currentPage,
        listPerPage,
        // Added by - Ashlekh on 15-11-2024
        // Reason - To send user id in backend (will be used in filter)
        user.id,
        // End of code - Ashlekh on 15-11-2024
        // Reason - To send user id in backend (will be used in filter)
      );
      setTotalProducts(data.searched_order_count);
      setOrderHistory(data.order);
    } catch (error) {
      console.error(error.message);
    }
  };

  /**End of code addition by Unnati on 03-10-2024
   * Reason-To fetchSearchOrder
   */
  /**Code added by Unnati on 03-10-2024
   * Reason-Added use effect and condition
   */
  useEffect(() => {
    if (searchTerm.length >= 3 || selectedDate) {
      fetchSearchOrder();
    }
  }, [searchTerm, selectedDate, currentPage, listPerPage]);
  /**End of code addition by Unnati on 03-10-2024
   * Reason-Added use effect and condition
   */
  /**Code added by Unnati on 03-10-2024
   * Reason-To handle search change
   */
  const handleSearchChange = (e) => {
    const value = e.target.value.replace(/\s{2,}/g, " ");
    setSearchTerm(value);
  };
  /**End of code addition by Unnati on 03-10-2024
   * Reason-To handle search change
   */
  /**Code added by Unnati on 17-10-2024
   * Reason-To handle clear button
   */
  const handleClear = async () => {
    setSelectedDate(null);
    /**Code added by Unnati on 22-10-2024
     * Reason-To get orderHistory when clear button is clicked
     */
    const data = await getOrderHistory(user.id, currentPage, listPerPage);
    setOrderHistory(data.orderSummary);
    /**End of code addition by Unnati on 22-10-2024
     * Reason-To get orderHistory when clear button is clicked
     */
    // setOrderHistory(defaultOrderHistory);

    /* Added by jhamman on 26-10-2024
    Reason - searial number is showing in minus when clear*/
    setTotalProducts(data.total);
    /* End of addition by jhamman on 26-10-2024
    Reason - searial number is showing in minus when clear*/
  };
  /**End of code addition by Unnati on 17-10-2024
   * Reason-To handle clear button
   */
  return (
    <div>
      {/**Code added by Unnati on 03-10-2024
       *Reason-Added search bar,filter by date and pagination */}
      <div className={OrderHistoryStyle.searchBarWithShowOrder}>
        {/**Code commented by Unnati on 16-10-2024
         *Reason-This code is not in use currently */}
        {/* <div className={OrderHistoryStyle.searchBarInput}>
          <input
            type="text"
            className={OrderHistoryStyle.searchBar}
            placeholder="Search Orders..."
            onChange={handleSearchChange}
          />
        </div> */}
        {/*End of code comment by Unnati on 16-10-2024
         *Reason-This code is not in use currently */}
        <div className={OrderHistoryStyle.filterAndPage}>
          <div className={OrderHistoryStyle.datePickerContainer}>
            <label className={OrderHistoryStyle.labelViews}>
              Filter by Date:{" "}
            </label>
            <button
              type="button"
              onClick={() => setCalendarOpen((prev) => !prev)}
              className={OrderHistoryStyle.calendarIconButton}
            >
              <FaCalendarAlt />
            </button>
            <DatePicker
              selected={selectedDate || undefined}
              onChange={(date) => {
                setSelectedDate(date);
                // Added by - Ashlekh on 15-11-2024
                // Reason - if date field is empty then
                if (date == null){
                  handleClear();
                }
                // End of code - Ashlekh on 15-11-2024
                // Reason - if date field is empty then
              }}
              /* Modified by jhamman on 26-10-2024
              Reason - Changed date format*/
              // dateFormat="yyyy/MM/dd"
              dateFormat="MM/dd/yyyy"
              /* End of modification by jhamman on 26-10-2024
              Reason - Changed date format*/
              placeholderText="Select a date"
              className={OrderHistoryStyle.datePicker}
              open={calendarOpen}
              onClickOutside={() => setCalendarOpen(false)}
              /**Code added by Unnati on 21-10-2024
               *Reason-Added yaer dropdown and month dropdown */
              yearDropdownItemNumber={5}
              scrollableYearDropdown
              minDate={new Date(1900, 0, 1)}
              maxDate={new Date()}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              /**End of code addition by Unnati on 21-10-2024
               *Reason-Added yaer dropdown and month dropdown */
            />
          </div>
          {/**Code commented by Unnati on 16-10-2024
           */}
          {/* <div className={OrderHistoryStyle.showProduct}>
            <label className={OrderHistoryStyle.labelViews}>Show </label>
            <select
              className={`${OrderHistoryStyle.dropdownpage} `}
              value={listPerPage}
              onChange={handleListsPerPageChange}
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
            </select>

            <label> per page</label>
          </div> */}
          {/**End of code comment by Unnati on 16-10-2024
           */}
          {/**Code added by Unnati on 17-10-2024
           *Reason-To show clear filter button */}
          <button
            className={OrderHistoryStyle.clearButton}
            onClick={handleClear}
          >
            Clear
          </button>
          {/**End of code addition  by Unnati on 17-10-2024
           *Reason-To show clear filter button */}
        </div>
      </div>
      {/**End of code addition by Unnati on 03-10-2024
       *Reason-Added search bar,filter by date and pagination */}
      <div className={OrderHistoryStyle.pageContainer}>
        <div className={OrderHistoryStyle.tableAndPagination}>
          <div className={OrderHistoryStyle.table}>
            <div className={OrderHistoryStyle.headerRow}>
              {/* Added by jhamman on 13-10-2024
            Reason - as per remaining feature 53*/}
              <div className={OrderHistoryStyle.column}>S. No.</div>
              {/* End of addition by jhamman on 13-10-2024
            Reason - as per remaining feature 53*/}
              <div className={OrderHistoryStyle.column}>Order ID</div>
              <div className={OrderHistoryStyle.columnAmount}>Amount($)</div>
              <div className={OrderHistoryStyle.column}>Date</div>
              <div className={OrderHistoryStyle.column}>View</div>
            </div>
            {/**Code added by Unnati on 18-09-2024
             *Reason-To sort order history accoridng to order id */}
            <div className={OrderHistoryStyle.historyContainer}>
              {/* Code changed by - Ashlekh on 16-11-2024
              Reason - If no product founds then to display No data found */}
            {totalProducts > 0 && 
              orderHistory.length > 0 ? (
              orderHistory
                .sort((a, b) => {
                  const numA = parseInt(a.order_id.slice(-5));
                  const numB = parseInt(b.order_id.slice(-5));
                  return numB - numA;
                })
                .map((order, index) => {
                  // Added by Jhamman on 23-10-2024
                  // Reason - Calculate serial number based on the current page and page size
                  const serialNumber =
                    totalProducts - (currentPage - 1) * listPerPage - index;
                  // End of addition by Jhamman on 23-10-2024
                  // Reason - Calculate serial number based on the current page and page size
                  return (
                    <div
                      key={order.order_id}
                      className={OrderHistoryStyle.dataRow}>
                      {/* Added by Jhamman on 13-10-2024
                      Reason - as per remaining feature 53 */}
                      <div className={OrderHistoryStyle.column}>
                        {/* {order.id} */}
                        {serialNumber}
                      </div>
                      {/* End of addition by jhamman on 13-10-2024
                      Reason - as per remaining feature 53*/}
                      <div className={OrderHistoryStyle.column}>
                        {order.order_id}
                      </div>
                      <div className={OrderHistoryStyle.columnAmount}>
                        {order.grand_total}
                      </div>
                      <div className={OrderHistoryStyle.column}>
                        {/* {order.date} */}
                        {/**Code modified by Unnati on 20-11-2024
                        *Reason-Added order date */}
                        {DateFormatter(order.order_date)}
                        {/**End of code modification by Unnati on 20-11-2024
                        *Reason-Added order date */}
                      </div>
                      <div className={OrderHistoryStyle.column}>
                        <FaEye
                          color="green"
                          onClick={() => handleViewOrder(order)}
                        />
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className={OrderHistoryStyle.noDataFound}>
                No data found
              </div>
            )}
            {/* End of code - Ashlekh on 16-11-2024
            Reason - If no product founds then to display No data found */}
              {/**End of code addition by Unnati on 18-09-2024
               *Reason-To sort order history accoridng to order id */}
            </div>
          </div>
          {/**Code added by Unnati on 30-09-2024
           *Reason-Added pagination in order history */}
          {/* Added by - Ashlekh on 16-11-2024
          Reason - To hide pagination if no data is present */}
          {totalProducts > 0 && (
          // End of code - Ashlekh on 16-11-2024
          // Reason - To hide pagination if no data is present
            <div className={`${OrderHistoryStyle.pagination}`}>
              <Pagination
                current={currentPage}
                pageSize={listPerPage}
                total={totalProducts}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
        {/**End of code addition by Unnati on 30-09-2024
         *Reason-Added pagination in order history */}
      </div>
    </div>
  );
};

export default OrderHistory;
/**End of code addition by Unnati on 02-08-2024
 * Reason-To have Order history page
 */
