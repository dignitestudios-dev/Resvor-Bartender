import React from "react";

const Notifications = ({ color }) => {
  return (
    <svg
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill={color || "white"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.98661 13.026C11.6218 13.026 13.7661 12.4314 13.9732 10.0447C13.9732 7.65962 12.4782 7.813 12.4782 4.88661C12.4782 2.60078 10.3116 0 6.98661 0C3.66162 0 1.49501 2.60078 1.49501 4.88661C1.49501 7.813 0 7.65962 0 10.0447C0.207915 12.4404 2.35225 13.026 6.98661 13.026Z"
        fill={color || "white"}
      />
      <path
        d="M8.95037 15.5C7.82911 16.745 6.07998 16.7598 4.948 15.5"
        stroke="white"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Notifications;
