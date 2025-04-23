import React from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useTable } from '../../contexts/TableContext';

function HelpButton() {
    const { currentTableId } = useTable();

    const handleHelpRequest = async () => {
        if (!currentTableId) {
            Swal.fire({
                title: 'Thông báo',
                text: 'Vui lòng quét mã QR để gọi nhân viên',
                icon: 'warning',
                confirmButtonText: 'Đồng ý'
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Bạn cần trợ giúp?',
            text: 'Nhân viên sẽ đến hỗ trợ bạn ngay!',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await axios.post('http://localhost:5000/api/support/request-help', {
                    tableId: currentTableId
                });
                
                Swal.fire(
                    'Đã gửi yêu cầu!',
                    'Nhân viên sẽ đến ngay!',
                    'success'
                );
            } catch (error) {
                console.error('Error:', error);
                Swal.fire(
                    'Lỗi!',
                    'Không thể gửi yêu cầu. Vui lòng thử lại!',
                    'error'
                );
            }
        }
    };

    return (
        <a onClick={handleHelpRequest} className="bordered-btn" href="#">
            Cần trợ giúp?
        </a>
    );
}

export default HelpButton;