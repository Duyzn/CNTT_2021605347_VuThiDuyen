/* eslint-disable no-undef */
import React, { useState } from 'react';

const ContactInfoForm = ({ onSubmit, onSkip }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, phone });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h3>Quý khách có muốn để lại tên và số điện thoại?</h3>
      <input
        type="text"
        placeholder="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Số điện thoại"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <div style={{ marginTop: 12 }}>
        <button type="submit" onClick={handlePlaceOrder}>Gửi</button>
        <button type="button" onClick={onSkip} style={{ marginLeft: 8 }}>
          Bỏ qua
        </button>
      </div>
    </form>
  );
};

export default ContactInfoForm;
