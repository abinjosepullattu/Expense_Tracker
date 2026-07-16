import axiosInstance from './axiosInstance';

export const reportAPI = {
  monthly:     (params) => axiosInstance.get('/reports/monthly', { params }),
  exportCSV:   (params) => axiosInstance.get('/reports/export/csv',
                             { params, responseType: 'blob' }),
  exportExcel: (params) => axiosInstance.get('/reports/export/excel',
                             { params, responseType: 'blob' }),
  exportPDF:   (params) => axiosInstance.get('/reports/export/pdf',
                             { params, responseType: 'blob' }),
};

/** Helper — trigger a browser file download from a Blob response */
export function downloadBlob(blobData, filename) {
  const url  = window.URL.createObjectURL(new Blob([blobData]));
  const link = document.createElement('a');
  link.href  = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
