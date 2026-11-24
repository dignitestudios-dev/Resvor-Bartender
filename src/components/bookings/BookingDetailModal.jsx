"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import utils from "@/lib/utils";
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Users,
  Utensils,
  DollarSign,
  Package,
  Building,
  CheckCircle2,
  ShieldCheck,
  BellRing,
} from "lucide-react";

const BookingDetailModal = ({ isOpen, onOpenChange, booking }) => {
  if (!booking) return null;

  // Guest details
  const guestName =
    booking?.guestName ||
    `${booking?.userId?.firstName || ""} ${booking?.userId?.lastName || ""}`.trim() ||
    booking?.userId?.name ||
    "Guest";

  const guestEmail = booking?.guestEmail || booking?.userId?.email || "-";
  const guestPhone = booking?.guestPhone || booking?.userId?.phone || "-";

  // Booked by account (if different or registered)
  const userAccount = booking?.userId;
  const userName = userAccount
    ? `${userAccount.firstName || ""} ${userAccount.lastName || ""}`.trim()
    : null;
  const userEmail = userAccount?.email;
  const showUserAccount =
    userAccount && (userName !== guestName || userEmail !== guestEmail);

  // Lounge details
  const lounge = booking?.loungeId || {};
  const loungeName = lounge?.name || booking?.loungeName || "Assigned Lounge";
  const loungeLogo = lounge?.logo?.location || null;
  const loungeAddress =
    typeof lounge?.location === "object"
      ? lounge?.location?.address
      : lounge?.address || "-";
  const operatingHours = lounge?.operatingHours
    ? `${lounge.operatingHours.open || ""} - ${lounge.operatingHours.close || ""}`.trim()
    : null;
  const loungeEmail = lounge?.businessEmail;
  const loungePhone = lounge?.businessPhone;
  const specialization = lounge?.specialization;

  // Timing
  const bookingDate =
    utils.formatDateWithName(booking?.bookingDate || booking?.startTime) || "-";
  const startTime = booking?.startTime ? utils.formatTime12(booking?.startTime) : "";
  const endTime = booking?.endTime ? utils.formatTime12(booking?.endTime) : "";
  const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : startTime || "-";

  // Guests
  const guestCount = booking?.guestCount || 1;
  const childrenCount = booking?.childrenCount ?? 0;

  // Tables
  const tables = Array.isArray(booking?.tableIds) ? booking.tableIds : [];

  // Service packages
  const servicePackages = Array.isArray(booking?.servicePackageIds)
    ? booking.servicePackageIds
    : [];

  // Payment
  const amountPaid = booking?.amountPaid;
  const currency = booking?.currency || "usd";
  const paidAt = booking?.paidAt
    ? `${utils.formatDateWithName(booking.paidAt)} at ${utils.formatTime12(booking.paidAt)}`
    : null;
  const escrowId = booking?.escrowId;

  // Status
  const status = booking?.status || "pending";
  const normalizedStatus = utils.getNormalizedStatus(status);
  const statusColor = utils.getStatusColorHex(status);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-6 max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
            <div>
              <DialogTitle className="text-2xl font-bold text-[#181818]">
                Booking Details
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                
                {booking?.createdAt && (
                  <>
                    <span>•</span>
                    <span>
                      Created: {utils.formatDateWithName(booking.createdAt)}
                    </span>
                  </>
                )}
              </div>
            </div>

          <div className="flex items-center gap-2 pr-10">
              <span
                className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{
                  color: statusColor,
                  backgroundColor: `${statusColor}15`,
                  border: `1px solid ${statusColor}40`,
                }}
              >
                {normalizedStatus}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 my-2 text-sm">
          {/* Guest Information */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80">
            <div className="flex items-center gap-2 mb-3 text-[#012C57] font-semibold">
              <User size={17} />
              <span>Guest Details</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-gray-700">
              <div>
                <p className="text-xs text-gray-500">Guest Name</p>
                <p className="font-semibold text-gray-900">{guestName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{guestPhone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-900 break-all">{guestEmail}</p>
              </div>

              {showUserAccount && (
                <div className="sm:col-span-3 pt-2 mt-1 border-t border-gray-200/70 text-xs text-gray-600">
                  <span className="font-medium text-gray-800">
                    Booked via User Account:
                  </span>{" "}
                  {userName} ({userEmail})
                </div>
              )}
            </div>
          </div>

          {/* Lounge Information */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80">
            <div className="flex items-center gap-2 mb-3 text-[#012C57] font-semibold">
              <Building size={17} />
              <span>Lounge Information</span>
            </div>
            <div className="flex items-start gap-3">
              {loungeLogo && (
                <img
                  src={loungeLogo}
                  alt={loungeName}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0 bg-white"
                />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 text-gray-700">
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500">Lounge Name</p>
                  <p className="font-semibold text-gray-900 text-base">
                    {loungeName}
                  </p>
                  {specialization && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {specialization}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={12} /> Address
                  </p>
                  <p className="font-medium text-gray-900">{loungeAddress}</p>
                </div>

                {operatingHours && (
                  <div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> Operating Hours
                    </p>
                    <p className="font-medium text-gray-900">{operatingHours}</p>
                  </div>
                )}

                {(loungePhone || loungeEmail) && (
                  <div>
                    <p className="text-xs text-gray-500">Lounge Contact</p>
                    <p className="font-medium text-gray-900">
                      {loungePhone || loungeEmail}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Schedule & Party Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80">
              <div className="flex items-center gap-2 mb-2 text-[#012C57] font-semibold">
                <Calendar size={17} />
                <span>Date & Time</span>
              </div>
              <div className="space-y-2 text-gray-700">
                <div>
                  <p className="text-xs text-gray-500">Booking Date</p>
                  <p className="font-semibold text-gray-900">{bookingDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} /> Time Slot
                  </p>
                  <p className="font-semibold text-blue-950 text-base">
                    {timeRange}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80">
              <div className="flex items-center gap-2 mb-2 text-[#012C57] font-semibold">
                <Users size={17} />
                <span>Party Size</span>
              </div>
              <div className="space-y-2 text-gray-700">
                <div>
                  <p className="text-xs text-gray-500">Total Guests</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {guestCount} {guestCount === 1 ? "Guest" : "Guests"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Children</p>
                  <p className="font-medium text-gray-900">
                    {childrenCount > 0 ? `${childrenCount} Children` : "None"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Tables */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80">
            <div className="flex items-center justify-between mb-2 text-[#012C57] font-semibold">
              <div className="flex items-center gap-2">
                <Utensils size={17} />
                <span>Assigned Tables ({tables.length})</span>
              </div>
              {booking?.preferredSeatingArea && (
                <span className="text-xs font-normal text-gray-600 bg-white px-2 py-0.5 rounded border">
                  Area: {booking.preferredSeatingArea}
                </span>
              )}
            </div>

            {tables.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {tables.map((table, idx) => {
                  const isObj = typeof table === "object" && table !== null;
                  const code = isObj ? table.code || table.name || `T${idx + 1}` : table;
                  const type = isObj ? table.type : null;
                  const capacity = isObj ? table.capacity : null;

                  return (
                    <div
                      key={table?._id || idx}
                      className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-base">
                          {code}
                        </span>
                        {type && (
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded uppercase ${
                              type.toLowerCase() === "vip"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {type}
                          </span>
                        )}
                      </div>
                      {capacity && (
                        <p className="text-xs text-gray-500 mt-1">
                          Capacity: <span className="font-medium text-gray-700">{capacity} persons</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No specific tables assigned.</p>
            )}
          </div>

          {/* Service Packages */}
          {servicePackages.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80">
              <div className="flex items-center gap-2 mb-2 text-[#012C57] font-semibold">
                <Package size={17} />
                <span>Service Packages</span>
              </div>
              <div className="space-y-2 mt-2">
                {servicePackages.map((pkg, idx) => (
                  <div
                    key={pkg?._id || idx}
                    className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{pkg.name}</p>
                      {pkg.description && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {pkg.description}
                        </p>
                      )}
                    </div>
                    {pkg.price !== undefined && (
                      <span className="font-bold text-gray-900 text-base">
                        {utils.formatCurrency(pkg.price, currency)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment & Financials */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80">
            <div className="flex items-center gap-2 mb-3 text-[#012C57] font-semibold">
              <DollarSign size={17} />
              <span>Payment & Security</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-gray-700">
              <div>
                <p className="text-xs text-gray-500">Amount Paid</p>
                <p className="font-bold text-gray-900 text-lg text-emerald-700">
                  {amountPaid !== undefined && amountPaid !== null
                    ? utils.formatCurrency(amountPaid, currency)
                    : "Free / Complimentary"}
                </p>
              </div>

              {paidAt && (
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-600" /> Paid Date
                  </p>
                  <p className="font-medium text-gray-900 text-xs mt-1">{paidAt}</p>
                </div>
              )}

              {escrowId && (
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-blue-600" /> Escrow ID
                  </p>
                  <p className="font-mono text-xs text-gray-800 truncate" title={escrowId}>
                    {escrowId}
                  </p>
                </div>
              )}

              {booking?.reminderSent !== undefined && (
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <BellRing size={12} /> Reminder Sent
                  </p>
                  <p className="font-medium text-gray-900">
                    {booking.reminderSent ? "Yes" : "No"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Special Request / Notes if any */}
          {booking?.specialRequest && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Special Request / Guest Note
              </p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {booking.specialRequest}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full bg-[#012C57] hover:bg-[#011F3D] text-white py-2.5 rounded-xl font-medium cursor-pointer"
          >
            Close Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailModal;
