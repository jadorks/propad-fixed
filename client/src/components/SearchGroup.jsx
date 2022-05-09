import React from "react";
import search from "../assets/images/search.svg";
import loading from "../assets/images/loading.svg";
function SearchGroup({
  handleSearch,
  handleChange,
  value,
  placeholder,
  isLoading,
  ...props
}) {
  return (
    <div className="search-group">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        {...props}
      />
      {isLoading ? (
        <img className="search_loading" src={loading} alt="The Search Icon" />
      ) : (
        <img  src={search} alt="The Search Icon" />
      )}
    </div>
  );
}

export default SearchGroup;
