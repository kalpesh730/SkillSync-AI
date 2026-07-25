import React from 'react';

const DataTable = ({ columns, data, keyField = 'id', isLoading = false, emptyMessage = 'No data available.' }) => {
  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading data...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm text-left text-gray-500 border-collapse">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row[keyField]} className="bg-white border-b hover:bg-gray-50">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
