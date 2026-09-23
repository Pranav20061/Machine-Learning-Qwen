import React from 'react';

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  className = '', 
  icon,
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
      <div className="input-group">
        {icon && (
          <span className="input-group-text bg-light border-end-0">
            <i className={`bi ${icon}`}></i>
          </span>
        )}
        <input
          type={type}
          className={`form-control ${icon ? 'border-start-0' : ''} ${error ? 'is-invalid' : ''}`}
          {...props}
        />
        {error && <div className="invalid-feedback d-block">{error}</div>}
      </div>
    </div>
  );
};

export default Input;
