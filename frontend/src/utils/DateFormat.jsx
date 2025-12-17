// Added by jhamman on 19-10-2024
// Reason - added function to format date from yyyy-mm-dd

// const formatDate = (dateString) => {
//   const [year, month, day] = dateString.split("-");
//   return `${month}-${day}-${year}`;
// };

// export default formatDate;

// End of addition by jhamman on 19-10-2024
// Reason - added function to format date from yyyy-mm-dd


export const DateFormatter = (date) => {
  const newDate = new Date(date);

  const formattedDate = newDate
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  return formattedDate
};


/* Added by jhamman on 23-10-2024
Reason - changed date format before sending date in Backend*/
export const Date_yyyy_mm_dd_Formatter = (date) => {

  const newDate = new Date(date);
  const formattedDate = newDate
    .toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  return formattedDate
};
/* End of addition by jhamman on 23-10-2024
Reason - changed date format before sending date in Backend*/