import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  IconButton
} from '@mui/material';
import { Edit, Trash2, Database } from 'lucide-react';

const DataTable = ({ columns, data, loading, onEdit, onDelete, totalCount, page, setPage, rowsPerPage, setRowsPerPage }) => {
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse">
        <div className="h-16 bg-slate-100 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 border-b border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800"></div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
        <div className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-2">
          <Database size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-900 dark:text-white">No data found</h3>
        <p className="text-slate-500 dark:text-slate-500 dark:text-slate-400">There are no records to display at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="data table">
          <TableHead className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id} className="text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  {col.label}
                </TableCell>
              ))}
              <TableCell align="right" className="text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id || row._id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                {columns.map((col) => (
                  <TableCell key={col.id} className="text-slate-800 dark:text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                    {col.render ? col.render(row) : row[col.id]}
                  </TableCell>
                ))}
                <TableCell align="right" className="border-b border-slate-200 dark:border-slate-700">
                  <div className="flex justify-end gap-2">
                    <IconButton size="small" onClick={() => onEdit(row)} className="text-blue-600 dark:text-blue-400">
                      <Edit size={18} />
                    </IconButton>
                    <IconButton size="small" onClick={() => onDelete(row)} className="text-red-600 dark:text-red-400">
                      <Trash2 size={18} />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount || data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700"
        sx={{
          color: 'inherit',
          '.MuiTablePagination-selectIcon': {
            color: 'inherit',
          }
        }}
      />
    </div>
  );
};

export default DataTable;
