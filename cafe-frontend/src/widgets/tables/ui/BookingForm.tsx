import React, { useState } from "react";
import { Button } from "@radix-ui/themes";
import { ITable } from "../types";

interface BookingFormProps {
  table: ITable;
  isSubmitting?: boolean;
  onSubmit: (payload: {
    customerName: string;
    phone: string;
    guests: number;
    time: string;
  }) => void | Promise<void>;
  onCancel: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  table,
  isSubmitting = false,
  onSubmit,
  onCancel,
}) => {
  const [customerName, setCustomerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [guests, setGuests] = useState<number>(1);
  const [dateTime, setDateTime] = useState<string>("");

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const [hours, minutes] = value.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const minMinutes = 10 * 60; // 10:00
      const maxMinutes = 22 * 60; // 22:00
      
      if (totalMinutes >= minMinutes && totalMinutes <= maxMinutes) {
        setDateTime(value);
      }
    } else {
      setDateTime(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем время перед отправкой
    if (dateTime) {
      const [hours, minutes] = dateTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const minMinutes = 10 * 60; // 10:00
      const maxMinutes = 22 * 60; // 22:00
      
      if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
        alert('Время должно быть с 10:00 до 22:00');
        return;
      }
    }
    
    const today = new Date().toISOString().split('T')[0]; // Получаем сегодняшнюю дату в формате YYYY-MM-DD
    const timeIso = dateTime ? new Date(`${today}T${dateTime}`).toISOString() : new Date().toISOString();
    await onSubmit({ customerName: customerName || "Guest", phone, guests, time: timeIso });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-3">
      <div className="grid grid-cols-1 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-600">Customer Name</span>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="John"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-600">Phone</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (___) ___-__-__"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-600">Guests</span>
            <input
              type="number"
              min={1}
              max={table.capacity}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-600">Time</span>
            <input
              type="time"
              value={dateTime}
              onChange={handleTimeChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          className="bg-blue-600 text-white p-2 rounded flex-1"
          loading={isSubmitting}
          disabled={isSubmitting}
          color='blue'
          type="submit"
        >
          Confirm Booking
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="p-2 rounded flex-1"
          color='gray'
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};


