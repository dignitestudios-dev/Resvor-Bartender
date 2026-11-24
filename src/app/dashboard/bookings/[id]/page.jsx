"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetBookingDetail } from "@/lib/hooks/queries/useBookings";
import PageLoader from "@/components/common/PageLoader";
import utils from "@/lib/utils";
import {
  ArrowLeft,
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
import { Button } from "@/components/ui/button";

const BookingDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id;

  const { data: booking, isLoading } = useGetBookingDetail(bookingId);

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex justify-center items-center">
        <PageLoader />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/bookings")}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft size={16} /> Back to Bookings
        </Button>
        <div className="p-12 text-center text-gray-500 bg-white rounded-xl">
          Booking not found or could not be loaded.
        </div>
      </div>
    );
  }

  // Guest details
  const guestName =
    booking?.guestName ||
    `${booking?.userId?.firstName || ""} ${booking?.userId?.lastName || ""}`.trim() ||
    booking?.userId?.name ||
    "Guest";

  const guestEmail = booking?.guestEmail || booking?.userId?.email || "-";
  const guestPhone = booking?.guestPhone || booking?.userId?.phone || "-";

  // Registered user
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
    <div className="p-2 md:p-4 max-w-5xl mx-auto space-y-4">
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/bookings")}
          className="flex items-center gap-2 w-fit bg-white"
        >
          <ArrowLeft size={16} /> Back to Bookings
        </Button>

        <span
          className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider w-fit"
          style={{
            color: statusColor,
            backgroundColor: `${statusColor}15`,
            border: `1px solid ${statusColor}40`,
          }}
        >
          {normalizedStatus}
        </span>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold text-[#181818]">
            Booking Details
          </h1>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span>ID: {booking?._id || "-"}</span>
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

        {/* Guest Information */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80">
          <div className="flex items-center gap-2 mb-3 text-[#012C57] font-semibold text-base">
            <User size={18} />
            <span>Guest Information</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-gray-700">
            <div>
              <p className="text-xs text-gray-500">Guest Name</p>
              <p className="font-semibold text-gray-900 text-base">{guestName}</p>
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
                  Booked via Account:
                </span>{" "}
                {userName} ({userEmail})
              </div>
            )}
          </div>
        </div>

        {/* Lounge Information */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80">
          <div className="flex items-center gap-2 mb-3 text-[#012C57] font-semibold text-base">
            <Building size={18} />
            <span>Lounge Information</span>
          </div>
          <div className="flex items-start gap-4">
            {loungeLogo && (
              <img
                src={loungeLogo}
                alt={loungeName}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0 bg-white"
              />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 text-gray-700">
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500">Lounge Name</p>
                <p className="font-bold text-gray-900 text-lg">{loungeName}</p>
                {specialization && (
                  <p className="text-xs text-gray-500 mt-0.5">{specialization}</p>
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

        {/* Date, Time & Party */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80">
            <div className="flex items-center gap-2 mb-2 text-[#012C57] font-semibold">
              <Calendar size={17} />
              <span>Schedule</span>
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
                <p className="font-bold text-blue-950 text-base">{timeRange}</p>
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
                <p className="font-bold text-gray-900 text-xl">
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
          <div className="flex items-center justify-between mb-3 text-[#012C57] font-semibold">
            <div className="flex items-center gap-2">
              <Utensils size={18} />
              <span>Assigned Tables ({tables.length})</span>
            </div>
            {booking?.preferredSeatingArea && (
              <span className="text-xs font-normal text-gray-600 bg-white px-2 py-0.5 rounded border">
                Area: {booking.preferredSeatingArea}
              </span>
            )}
          </div>

          {tables.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {tables.map((table, idx) => {
                const isObj = typeof table === "object" && table !== null;
                const code = isObj ? table.code || table.name || `T${idx + 1}` : table;
                const type = isObj ? table.type : null;
                const capacity = isObj ? table.capacity : null;

                return (
                  <div
                    key={table?._id || idx}
                    className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-lg">
                        {code}
                      </span>
                      {type && (
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded uppercase ${
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
                      <p className="text-xs text-gray-500 mt-2">
                        Capacity:{" "}
                        <span className="font-semibold text-gray-800">
                          {capacity} persons
                        </span>
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
            <div className="flex items-center gap-2 mb-3 text-[#012C57] font-semibold">
              <Package size={18} />
              <span>Service Packages</span>
            </div>
            <div className="space-y-2">
              {servicePackages.map((pkg, idx) => (
                <div
                  key={pkg?._id || idx}
                  className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900 text-base">{pkg.name}</p>
                    {pkg.description && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {pkg.description}
                      </p>
                    )}
                  </div>
                  {pkg.price !== undefined && (
                    <span className="font-bold text-gray-900 text-lg">
                      {utils.formatCurrency(pkg.price, currency)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment & Security */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80">
          <div className="flex items-center gap-2 mb-3 text-[#012C57] font-semibold">
            <DollarSign size={18} />
            <span>Payment & Security</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-gray-700">
            <div>
              <p className="text-xs text-gray-500">Amount Paid</p>
              <p className="font-bold text-gray-900 text-xl text-emerald-700">
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

        {/* Special Request */}
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
    </div>
  );
};

export default BookingDetailPage;
