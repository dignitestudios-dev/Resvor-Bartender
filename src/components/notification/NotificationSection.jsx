"use client";
import React, { useState } from "react";

const NotificationSection = () => {
  const filteredTasks = [
    {
      title: "New Task Assigned",
      description:
        "Lorem ipsum dolor sit amet consectetur. In volutpat et mattis ut tristique viverra blandit.",
      createdAt: "12-03-2025",
    },
  ];
  const [selectTab, setSelectTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (val) => {
    setSelectTab(val);
  };
  return (
    <div className="rounded-lg shadow-customShadow bg-white py-4  ">
      <div className="w-full border-b-2 border-gray-100 ">
        <div className="flex justify-start items-center gap-4 mx-6 pb-2">
          <button
            onClick={() => handleSelect("all")}
            className={` ${
              selectTab === "all"
                ? "text-indigo-950 font-bold"
                : "text-gray-500"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleSelect("read")}
            className={` ${
              selectTab === "read"
                ? "text-indigo-950 font-bold"
                : "text-gray-500"
            } `}
          >
            Read
          </button>
          <button
            onClick={() => handleSelect("unread")}
            className={` ${
              selectTab === "unread"
                ? "text-indigo-950 font-bold"
                : "text-gray-500"
            } `}
          >
            Unread
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4 h-[430px] overflow-y-auto">
          {Array(4)
            .fill()
            .map((_, index) => (
              <div key={index}>
                <div className="flex items-center w-[85%] py-3 border-gray-100">
                  <div className="bg-white flex p-2 max-w-[95%]">
                    <div className="py-3 px-2">
                      <div className="w-[100px] h-[20px] bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="w-[180px] h-[20px] bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-[7%] flex flex-col items-center">
                    <div className="w-[50px] h-[10px] bg-gray-200 rounded animate-pulse mb-2"></div>
                  </div>
                </div>
                <hr className="h-px my-2 ml-20 w-[90%] bg-gray-100 border" />
              </div>
            ))}
        </div>
      ) : (
        <div>
          {filteredTasks?.length > 0 ? (
            <div className=" h-[430px] overflow-y-auto ">
              {filteredTasks?.map((item, index) => (
                <div className="pl-8" key={index}>
                  <div className="flex justify-between items-center py-2 w-[95%] border-gray-100">
                    <div className="bg-white flex w-[95%]">
                      {/* <div className="py-3 px-2 mt-1">
                  <img
                    src={task.image}
                    alt="profile"
                    className="w-[55px] h-[55px] rounded-full mx-2"
                  />
                </div> */}

                      <div className="py-3 px-2">
                        <h1 className="text-[16px] text-[#787F8C] font-bold">
                          {item?.title}
                        </h1>
                        <p className="text-[16px] text-[#18181880] ">
                          {item?.description}
                        </p>
                      </div>
                    </div>

                    <div className="w-[20%] flex flex-col items-center">
                      <p className="text-[14px] text-[#717171] mb-2">
                        {item?.createdAt}
                      </p>
                      {/* {unReadLoadingId === item._id ? (
                        <p className="text-xs text-gray-500">Loading...</p>
                      ) : (
                        <span className="flex items-center pt-1">
                          <p className="text-green-600 pr-1">Mark As Read</p>
                          <input
                            type="checkbox"
                            className="w-5 h-5 accent-[#62466b] rounded cursor-pointer"
                            onChange={() => handleMarkAsRead(item?._id)}
                          />
                        </span>
                      )} */}
                    </div>
                  </div>
                  <hr className="h-px my-2 ml-2 w-[90%] bg-gray-100 border" />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[430px]">No record found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSection;
