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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const timeIso = dateTime ? new Date(dateTime).toISOString() : new Date().toISOString();
    await onSubmit({ customerName: customerName || "Гость", phone, guests, time: timeIso });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-3">
      <div className="grid grid-cols-1 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-600">Имя клиента</span>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Иван"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-600">Телефон</span>
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
            <span className="text-xs text-gray-600">Гостей</span>
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
            <span className="text-xs text-gray-600">Дата и время</span>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
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
          Подтвердить бронь
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="p-2 rounded flex-1"
          color='gray'
        >
          Отмена
        </Button>
      </div>
    </form>
  );
};


