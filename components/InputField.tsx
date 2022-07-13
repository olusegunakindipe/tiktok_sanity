import React from 'react';

interface IProps {
  value?: string;
  name: string;
  placeholder: string;
  type: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  big?: boolean;
}

const InputField = ({
  value,
  name,
  big,
  placeholder,
  type,
  onChange,
}: IProps) => {
  return (
    <div className="inputField">
      <input
        type={type}
        value={value}
        name={name}
        className={`form-control ${big ? 'big-input' : 'small-input'}`}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
