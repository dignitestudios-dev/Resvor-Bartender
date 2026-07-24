"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetNotifications } from "@/lib/hooks/queries/useNotifications";
import { useMarkNotificationAsRead } from "@/lib/hooks/mutations/NotificationMutations";

const NotificationSection = () => {
  const router = useRouter();
  const [selectTab, setSelectTab] = useState("all");
  const { data: notifications = [], isLoading, refetch } = useGetNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();

  const handleSelect = (val) => {
    setSelectTab(val);
  };

  const handleMarkAsRead = async (e, item) => {
    e.stopPropagation();
    try {
      await markAsReadMutation.mutateAsync({
        id: item?._id || item?.id,
        title: item?.title || "",
        description: item?.description || "",
      });
      refetch();
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const handleItemClick = (item) => {
    const resourceType = item?.metadata?.resourceType || item?.resourceType;

    if (resourceType === "TimeOffRequest") {
      router.push("/dashboard/requests");
    } else if (resourceType === "Shift") {
      router.push("/dashboard/shift");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const year = d.getFullYear();
      return `${month}-${day}-${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  // derive filtered tasks from notifications and selected tab
  const filteredTasks = notifications.filter((n) => {
    const isRead = n.read === true || n.isRead === true;
    if (selectTab === "all") return true;
    if (selectTab === "read") return isRead;
    if (selectTab === "unread") return !isRead;
    return true;
  });
  return (
    <div className="rounded-lg shadow-customShadow bg-white py-4  ">
      <div className="w-full border-b-2 border-gray-100 ">
        <div className="flex justify-start items-center gap-4 mx-6 pb-2">
          <button
            onClick={() => handleSelect("all")}
            className={` ${selectTab === "all"
              ? "text-indigo-950 font-bold"
              : "text-gray-500"
              }`}
          >
            All
          </button>
          <button
            onClick={() => handleSelect("read")}
            className={` ${selectTab === "read"
              ? "text-indigo-950 font-bold"
              : "text-gray-500"
              } `}
          >
            Read
          </button>
          <button
            onClick={() => handleSelect("unread")}
            className={` ${selectTab === "unread"
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
                <div
                  className="pl-8 cursor-pointer hover:bg-gray-50 transition-colors"
                  key={item?._id || item?.id || index}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex justify-between items-center py-2 w-[95%] border-gray-100">
                    <div className="flex w-[95%]">
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

                    <div className="w-[25%] flex flex-col items-end pr-4">
                      <p className="text-[14px] text-[#717171] mb-2">
                        {formatDate(item?.createdAt)}
                      </p>
                      <div className="flex items-center gap-2">
                        {!(item?.read || item?.isRead) ? (
                          <>
                            <span className="bg-primary rounded-full w-2 h-2" title="Unread" />
                            {markAsReadMutation.isPending && markAsReadMutation.variables?.id === (item?._id || item?.id) ? (
                              <p className="text-xs text-gray-500">Updating...</p>
                            ) : (
                              <button
                                onClick={(e) => handleMarkAsRead(e, item)}
                                className="text-green-600 hover:underline text-xs font-semibold cursor-pointer"
                              >
                                Mark As Read
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs font-medium">Read</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <hr className="h-px my-2 ml-2 w-[90%] bg-gray-100 border" />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[430px] w-full flex items-center justify-center">No record found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSection;
