import React, { useMemo, useState } from "react";
import { ITable } from "../types";
import { Button } from "@radix-ui/themes";
import { tablesApi } from "../api/tablesApi";
import { BookingForm } from "./BookingForm";
import { useTables } from "@/app/_contexts/TableContext";

interface Props {
  table: ITable;
  onClose: () => void;
}

export const TableModal: React.FC<Props> = ({ table, onClose }) => {
  const { createReservation, freeTable, quickSeatTable } = useTables();
  const [isBooking, setIsBooking] = useState(false);
  const [isSeating, setIsSeating] = useState(false);
  const [isFreeing, setIsFreeing] = useState(false);
  const [isReserveFormOpen, setIsReserveFormOpen] = useState(false);

  // reservation form state is inside BookingForm component

  const statusBadge = useMemo(() => {
    const colorMap: Record<ITable["status"], string> = {
      AVAILABLE: "bg-green-100 text-green-700 border-green-200",
      RESERVED: "bg-yellow-100 text-yellow-700 border-yellow-200",
      OCCUPIED: "bg-red-100 text-red-700 border-red-200",
    };
    const labelMap: Record<ITable["status"], string> = {
      AVAILABLE: "Available",
      RESERVED: "Reserved",
      OCCUPIED: "Occupied",
    };
    return { cls: colorMap[table.status], label: labelMap[table.status] };
  }, [table?.status]);

  const handleOpenReserveForm = () => {
    setIsReserveFormOpen(true);
  };

  const handleSubmitReservation = async (payload: { customerName: string; phone: string; guests: number; time: string; }) => {
    setIsBooking(true);
    try {
      const data = await createReservation(table.id, payload);
      if (data) {
        setIsReserveFormOpen(false);
        onClose();
      }
    } finally {
      setIsBooking(false);
    }
  };

  const handleQuickSeat = async () => {
    if (!table) return;
    setIsSeating(true);
    try {
      await quickSeatTable(table.id, 2);
    } finally {
      setIsSeating(false);
      onClose();
    }
  };

  const handleFree = async () => {
    setIsFreeing(true);
    try {
      await freeTable(table.id);
    } finally {
      setIsFreeing(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md flex flex-col gap-4 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{table.name}</h2>
            <div className="mt-1 text-sm text-gray-500">ID: {table.id}</div>
          </div>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusBadge.cls}`}>
            {statusBadge.label}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div className="rounded-lg border bg-gray-50 p-3">
            <div className="text-xs text-gray-500">Capacity</div>
            <div className="mt-1 text-base font-medium text-gray-900">{table.capacity} guests</div>
          </div>
          <div className="rounded-lg border bg-gray-50 p-3">
            <div className="text-xs text-gray-500">Current Status</div>
            <div className="mt-1 text-base font-medium text-gray-900">{statusBadge.label}</div>
          </div>
        </div>
        {table?.reservation && (
          <div className="mt-2 flex">
            <div className="rounded-lg w-full border bg-gray-50 p-3">
              <div className="text-xs text-gray-500">Info</div>
              <div className="mt-1 text-base font-normal text-gray-900">Name: {table.reservation.customerName}</div>
              <div className="mt-1 text-base font-normal text-gray-900">Phone: {table.reservation.phone}</div>
              <div className="mt-1 text-base font-normal text-gray-900">Guests: {table.reservation.guests}</div>
              <div className="mt-1 text-base font-normal text-gray-900">Date: {table.reservation.time.split('.')[0]}</div>
            </div>
          </div>
        )}
        {isReserveFormOpen ? (
          <BookingForm
            table={table}
            isSubmitting={isBooking}
            onSubmit={handleSubmitReservation}
            onCancel={() => setIsReserveFormOpen(false)}
          />
        ) :
          (
            <div className="flex flex-col gap-2">
              {table.status === 'AVAILABLE' ? (
                <>
                  <Button
                    className="bg-blue-500 text-white p-2 rounded"
                    onClick={handleOpenReserveForm}
                    loading={false}
                    disabled={false}
                    color='blue'
                  >
                    Create Booking
                  </Button>
                  <Button
                    className="text-white p-2 rounded  "
                    onClick={handleQuickSeat}
                    loading={isSeating}
                    disabled={isSeating}
                    color='green'
                  >
                    Quick Seating
                  </Button>
                </>
              ) : (
                <Button
                  className="text-white p-2 rounded"
                  onClick={handleFree}
                  loading={isFreeing}
                  disabled={isFreeing}
                  color='gray'
                >
                  Free Table
                </Button>
              )}
            </div>
          )

        }
        <Button
          onClick={onClose}
          className="mt-4 w-full text-white p-2 rounded"
          color='red'
        >
          Close
        </Button>

      </div>
    </div>
  );
};
