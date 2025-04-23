// server/src/routes/supportRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../config/database');

const BOT_TOKEN = '7496594083:AAGq0mKoLFP6o6gdVVYNBN7LoICGYPuM5NE';
const CHAT_ID = '-1002296514978';

router.post('/request-help', async (req, res) => {
    try {
        const { tableId } = req.body;
        
        // Lấy thông tin bàn từ database
        const [table] = await db.execute(
            'SELECT table_number FROM tables WHERE id = ?',
            [tableId]
        );

        if (!table || table.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Không tìm thấy thông tin bàn' 
            });
        }

        const message = `Khách hàng ở bàn *${table[0].table_number.toUpperCase()}* cần trợ giúp!`;
        
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Telegram notification error:', error);
        res.status(500).json({ success: false });
    }
});

router.post('/notify-order', async (req, res) => {
    try {
        const { tableId, products, totalAmount } = req.body;
        
        // Lấy thông tin bàn
        const [table] = await db.execute(
            'SELECT table_number FROM tables WHERE id = ?',
            [tableId]
        );

        if (!table || table.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Không tìm thấy thông tin bàn' 
            });
        }

        // Tạo nội dung tin nhắn
        let message = `🔔 ĐƠN HÀNG MỚI\n`;
        message += `🪑 Bàn: *${table[0].table_number.toUpperCase()}*\n\n`;
        message += `📝 Chi tiết đơn hàng:\n`;

        // Thêm thông tin từng món (không hiển thị giá)
        for (const item of products) {
            message += `- ${item.name} x${item.quantity}\n`;
            if (item.toppings && item.toppings.length > 0) {
                message += `  (Toppings: ${item.toppings.map(t => t.name).join(', ')})\n`;
            }
        }

        message += `\n💵 Tổng tiền: ${totalAmount.toLocaleString('vi-VN')}đ`;

        // Gửi tin nhắn qua Telegram
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Telegram order notification error:', error);
        res.status(500).json({ success: false });
    }
});

module.exports = router;