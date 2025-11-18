"use client";
import React, { useState } from "react";
import Table from "@/components/requests/Table";
import RequestTimeOffModal from "@/components/requests/RequestTimeOffModal";
import RequestShiftSwapModal from "@/components/requests/RequestShiftSwapModal";
import { Button } from "@/components/ui/button";
import SuccessModal from "@/components/global/SuccessModal";

const Shifts = () => {
  const [timeOffOpen, setTimeOffOpen] = useState(false);
  const [shiftSwapOpen, setShiftSwapOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center gap-10">
        <div>
          <h1 className="section-heading">Requests </h1>
          <p className="text-[16px] text-[#202224]">
            Track all your time-off and shift swap requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setShiftSwapOpen(false);
              setTimeOffOpen(true);
            }}
            className={" py-3 px-4 font-medium "}
          >
            Request Time Off
          </Button>

          <Button
            onClick={() => {
              setTimeOffOpen(false);
              setShiftSwapOpen(true);
            }}
            className={" py-3 px-4 font-medium "}
          >
            Request Shift Swap
          </Button>
        </div>

        {/* <div className="flex items-center gap-5">
          <AddShiftAndScheduling isOpen={openForm} onOpenChange={setOpenForm} />
        </div> */}
      </div>
      <div className="mt-2">
        <Table />
      </div>
      {timeOffOpen && (
        <RequestTimeOffModal
          isOpen={timeOffOpen}
          onOpenChange={(val) => setTimeOffOpen(val)}
          setSuccessModal={setSuccessModal}
        />
      )}
      {successModal && (
        <SuccessModal
          isOpen={successModal}
          onOpenChange={(val) => setSuccessModal(val)}
          title="Request Submitted"
          content="Your request has been successfully submitted."
        />
      )}
      {shiftSwapOpen && (
        <RequestShiftSwapModal
          isOpen={shiftSwapOpen}
          onOpenChange={(val) => setShiftSwapOpen(val)}
          setSuccessModal={setSuccessModal}
        />
      )}
    </div>
  );
};

export default Shifts;
