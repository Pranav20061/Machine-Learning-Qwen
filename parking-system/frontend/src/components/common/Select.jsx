import React from 'react';

const Select = ({ 
  label, 
  error, 
  options = [], 
  className = '', 
  placeholder = 'Select an option',
  ...props 
}) => {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label className="form-label fw-semibold text-dark">
          {label}
          {props.required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <select
        className={`form-select ${error ? 'is-invalid' : ''}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default Select;
