import React from "react";
import PropTypes from "prop-types";

import { SearchListContainer } from "./SearchList_style";

const SearchList = ({ data }) => {
  return (
    <>
      <SearchListContainer>
        {data.map((item) => (
          <li key={item.id}>
            <p>{item.title}</p>
            <img
              src={`https://image.tmdb.org/t/p/original/${item.src}`}
              alt="img"
              width="200"
            />
          </li>
        ))}
      </SearchListContainer>
    </>
  );
};

export default SearchList;

SearchList.propTypes = {
  // data: PropTypes.object.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      src: PropTypes.string,
    })
  ).isRequired,
};

SearchList.defaultProps = {
  data: {
    id: "",
    title: "",
    src: "",
  },
};
