// components/VerificationEmail.tsx
import React from 'react';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({ username, otp }) => {
  return (
    <html>
      <body>
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            color: '#333',
            padding: '20px',
            margin: '0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
          className="max-w-lg mx-auto border border-gray-200 p-6 rounded-lg bg-gray-50"
        >
          <h1 className="text-2xl font-bold mb-4">Hello {username},</h1>
          <p className="text-lg mb-4">Thank you for signing up! To complete your registration, please use the following OTP:</p>
          <p className="text-xl font-bold mb-4">Your OTP: {otp}</p>
          <p className="mb-4">If you did not request this, please ignore this email.</p>
          <p>Best regards,<br />The Team</p>
        </div>
      </body>
    </html>
  );
};

export default VerificationEmail;
