import React, { useEffect, useState } from 'react';
import InputField from '../components/InputField';
import { BiSearch } from 'react-icons/bi';
import Router from 'next/router';
const Search = () => {
  const [value, setValue] = useState('');

  const handleSearch = () => {
    Router.push(`/search?query=${value}`);
  };

  return (
    <div className="search-field">
      <InputField
        type="text"
        name="search"
        placeholder="Search accounts and videos"
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <button className="search-button" onClick={handleSearch}>
        <BiSearch size={15} color="gray" />
      </button>
    </div>
  );
};

export default Search;
