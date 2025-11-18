import React from "react";
import Table from "@/components/shift/Table";

const Shifts = () => {
  return (
    <div>
      <div className="flex justify-between items-center gap-10">
        <h1 className="section-heading">Shifts </h1>

        {/* <div className="flex items-center gap-5">
          <AddShiftAndScheduling isOpen={openForm} onOpenChange={setOpenForm} />
        </div> */}
      </div>
      <div className="mt-2">
        <Table />
      </div>
    </div>
  );
};

export default Shifts;
