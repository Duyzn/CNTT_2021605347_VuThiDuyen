import React, { createContext, useContext, useState, useEffect } from 'react';

const TableContext = createContext();

export function TableProvider({ children }) {
  const [currentTableId, setCurrentTableId] = useState(() => {
    return localStorage.getItem('tableId');
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const tableId = localStorage.getItem('tableId');
      setCurrentTableId(tableId);
    };

    window.addEventListener('storage', handleStorageChange);
    
    const tableId = localStorage.getItem('tableId');
    if (tableId) {
      setCurrentTableId(tableId);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <TableContext.Provider value={{ currentTableId, setCurrentTableId }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  return useContext(TableContext);
}