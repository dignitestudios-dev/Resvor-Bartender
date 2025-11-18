import React from "react";

const Notifications = ({ color }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={color || "white"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13.5137 18.5866C18.1489 18.5866 20.2932 17.992 20.5003 15.6052C20.5003 13.2202 19.0053 13.3735 19.0053 10.4472C19.0053 8.16132 16.8387 5.56055 13.5137 5.56055C10.1887 5.56055 8.02211 8.16132 8.02211 10.4472C8.02211 13.3735 6.5271 13.2202 6.5271 15.6052C6.73501 18.001 8.87935 18.5866 13.5137 18.5866Z"
        fill={color || "white"}
      />
      <path
        d="M15.4775 21.0605C14.3562 22.3056 12.6071 22.3203 11.4751 21.0605"
        stroke="white"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Notifications;
