// src/components/table/TableRedirect.js
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function TableRedirect() {
  const { tableId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const validateAndRedirect = async () => {
      try {
        // Kiểm tra bàn có tồn tại
        const response = await axios.get(`http://localhost:5000/api/tables/info/${tableId}`);
        if (response.data.success) {
          // Lưu tableId vào localStorage
          localStorage.setItem('tableId', tableId);
          // Chuyển hướng về trang chủ
          navigate('/');
        } else {
          alert('Bàn không tồn tại!');
          navigate('/');
        }
      } catch (error) {
        console.error('Error validating table:', error);
        alert('Có lỗi xảy ra!');
        navigate('/');
      }
    };

    validateAndRedirect();
  }, [tableId, navigate]);

  return null;
}

export default TableRedirect;