const Table = ({ columns = [], data = [] }) => {
  return (
    <div>
      {/* Desktop/table view */}
      <div className="hidden md:block overflow-auto">
        <table className="min-w-full table-auto bg-transparent">
          <thead>
            <tr className="text-left text-sm text-white/80">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-2">{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-t border-white/6">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 align-top">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/card view */}
      <div className="md:hidden flex flex-col gap-3">
        {data.map((row, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-white/6 backdrop-blur-md border border-white/10">
            {columns.map((col) => (
              <div key={col.key} className="mb-2">
                <div className="text-xs text-white/70">{col.title}</div>
                <div className="text-sm">{col.render ? col.render(row) : row[col.key]}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
