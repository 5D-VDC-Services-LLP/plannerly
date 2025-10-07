// src/components/EditableText.jsx
import React, { useState } from 'react';

export const EditableText = ({ initialValue, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    if (value.trim()) {
      onSave(value);
    } else {
      setValue(initialValue); // Reset if empty
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        autoFocus
        className="bg-white border border-blue-400 rounded px-1 py-0 w-full"
      />
    );
  }

  return (
    <span onClick={() => setIsEditing(true)} className="hover:bg-gray-200 cursor-pointer rounded px-1 py-0">
      {value}
    </span>
  );
};