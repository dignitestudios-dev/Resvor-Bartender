import React from "react";
import { Button } from "@/components/ui/button";
import NotificationSection from "@/components/notification/NotificationSection";

const Notifications = () => {
  return (
    <div>
      <div className="flex justify-between items-center gap-10 mt-2">
        <h1 className="section-heading">Notifications</h1>
        <Button className={" py-3 "}>Clear All</Button>
      </div>
      <div className="mt-4 mr-12 ">
        <NotificationSection />
      </div>
    </div>
  );
};

export default Notifications;
