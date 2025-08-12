'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ITable, TTableStatus } from '@/widgets/tables/types';
import { tablesController, ITablesState } from '@/shared/lib/api';

interface TablesContextType {
  tables: ITable[];
  loading: boolean;
  error: string | null;
  fetchTables: (forceRefresh?: boolean) => Promise<void>;
  updateTableStatus: (tableId: number, status: TTableStatus) => Promise<void>;
  createReservation: (tableId: number, reservationData: { customerName: string; phone: string; guests?: number; time: string }) => Promise<ITable | null>;
  cancelReservation: (tableId: number) => Promise<void>;
  quickSeatTable: (tableId: number) => Promise<void>;
  freeTable: (tableId: number) => Promise<void>;
  getAvailableTables: () => ITable[];
  getOccupiedTables: () => ITable[];
  getReservedTables: () => ITable[];
  getTablesByCapacity: (minCapacity: number, maxCapacity?: number) => ITable[];
  clearCache: () => void;
}

const TablesContext = createContext<TablesContextType | undefined>(undefined);

export function TablesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ITablesState>({
    tables: [],
    loading: false,
    error: null,
    lastUpdated: null,
  });

  useEffect(() => {
    // Подписываемся на изменения состояния от контроллера
    const unsubscribe = tablesController.subscribe((newState) => {
      setState(newState);
    });

    // Загружаем данные при монтировании
    fetchTables();

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchTables = async (forceRefresh = false) => {
    try {
      await tablesController.getAllTables(forceRefresh);
    } catch (err) {
      console.error('Error fetching tables:', err);
      throw err;
    }
  };

  const updateTableStatus = async (tableId: number, status: TTableStatus) => {
    try {
      await tablesController.updateTableStatus(tableId, status);
    } catch (err) {
      console.error('Error updating table status:', err);
      throw err;
    }
  };

  const createReservation = async (tableId: number, reservationData: { customerName: string; phone: string; guests?: number; time: string }): Promise<ITable | null> => {
    try {
      return await tablesController.createReservation(tableId, reservationData);
    } catch (err) {
      console.error('Error creating reservation:', err);
      throw err;
    }
  };

  const cancelReservation = async (tableId: number) => {
    try {
      await tablesController.cancelReservation(tableId);
    } catch (err) {
      console.error('Error canceling reservation:', err);
      throw err;
    }
  };

  const quickSeatTable = async (tableId: number) => {
    try {
      await tablesController.quickSeatTable(tableId);
    } catch (err) {
      console.error('Error seating table:', err);
      throw err;
    }
  };

  const freeTable = async (tableId: number) => {
    try {
      await tablesController.freeTable(tableId);
    } catch (err) {
      console.error('Error freeing table:', err);
      throw err;
    }
  };

  const getAvailableTables = () => {
    return tablesController.getAvailableTables();
  };

  const getOccupiedTables = () => {
    return tablesController.getOccupiedTables();
  };

  const getReservedTables = () => {
    return tablesController.getReservedTables();
  };

  const getTablesByCapacity = (minCapacity: number, maxCapacity?: number) => {
    return tablesController.getTablesByCapacity(minCapacity, maxCapacity);
  };

  const clearCache = () => {
    tablesController.clearCache();
  };

  const value: TablesContextType = {
    tables: state.tables,
    loading: state.loading,
    error: state.error,
    fetchTables,
    updateTableStatus,
    createReservation,
    cancelReservation,
    quickSeatTable,
    freeTable,
    getAvailableTables,
    getOccupiedTables,
    getReservedTables,
    getTablesByCapacity,
    clearCache,
  };

  return <TablesContext.Provider value={value}>{children}</TablesContext.Provider>;
}

export function useTables() {
  const context = useContext(TablesContext);
  if (context === undefined) {
    throw new Error('useTables must be used within a TablesProvider');
  }
  return context;
}
