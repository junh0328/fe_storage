import React, { useEffect, useState } from "react";
import SearchModal from "./SearchModal.js";
import { SearchContainer } from "./styled.jsx";

const Search = () => {
  const [onSearch, setOnSearch] = useState(false);
  useEffect(() => {}, []);
  return (
    <SearchContainer>
      <div className="title">Googol</div>
      <div className="search">
        <span onClick={() => setOnSearch((prev) => !prev)}>
          {" "}
          Googol 검색 또는 url 입력{" "}
        </span>
      </div>

      {onSearch && <SearchModal setOnSearch={setOnSearch} />}
    </SearchContainer>
  );
};

export default Search;
