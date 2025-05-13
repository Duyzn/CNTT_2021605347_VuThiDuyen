/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
// src/components/table/TableRedirect.js
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


function TableRedirect() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const{setTableInfo} = useTable();
  const [valid, setValid] = useState(false);
  
  /*
  const [tableInfo, setTableInfo] = useState({
    tableId: localStorage.getItem('tableId') || null,
    name: '',
    phone: '',
  });
*/
  // Kiểm tra xem tableId có hợp lệ không
  useEffect(() => {
    const validateAndRedirect = async () => {
      try {
        // Kiểm tra bàn có tồn tại
        const response = await axios.get(`http://localhost:5000/api/tables/info/${tableId}`);
        if (response.data.success) {
          
          const status = response.data.table.status;

        //  Chỉ cho vào nếu bàn đang sẵn sàng
          if ( status === 'complete') {
            setValid(true);
          } else {
            alert(`Bàn đang có đơn "${status.toUpperCase()}", vui lòng chờ nhân viên xác nhận.`);
            navigate('/');
          }
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

  const handleSubmit = ({ name, phone }) => {
    localStorage.setItem('tableId', tableId);
    setTableInfo({ ...tableId, name, phone });
    //setValid(true);
    navigate('/');
  };

  const handleSkip = () => {
    localStorage.setItem('tableId', tableId);
    setTableInfo({ ...tableId, name: '', phone: '' });
    //setValid(true);
    navigate('/');
  };


  return valid ?(
    <ContactInfoForm onSubmit={handleSubmit} onSkip={handleSkip} />
  ) :null;
}

export default TableRedirect;