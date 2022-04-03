import { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import { SearchListContainer } from "./SearchList_style";

const SearchList = ({ data, query, request, fetchData }) => {
  let noResult = null;

  const handleScroll = useCallback(
    (e) => {
      const scrollHeight = e.target.scrollHeight;
      const scrollTop = e.target.scrollTop;
      const clientHeight = e.target.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        !request && fetchData();
      }
    },
    [request, fetchData]
  );

  const throttleHandleScroll = _.throttle(handleScroll, 400);

  useEffect(() => {
    const searchSection = document.querySelector(".result");
    searchSection.addEventListener("scroll", throttleHandleScroll);
    return () => {
      searchSection.removeEventListener("scroll", throttleHandleScroll);
    };
  }, [throttleHandleScroll]);

  if (data?.length === 0) {
    noResult = (
      <div className="noResult">
        {query !== "" && <p>'{query}' 에 대한 검색 결과가 없습니다.</p>}
      </div>
    );
  }

  return (
    <>
      {data.length === 0 ? (
        noResult
      ) : (
        <SearchListContainer>
          {data.map((item) => (
            <li key={item.id}>
              <p>{item.title}</p>
              <img
                src={
                  item.src
                    ? `https://image.tmdb.org/t/p/original/${item.src}`
                    : "https://freesvg.org/img/1645699345cat.png"
                }
                alt="img"
                width="200"
              />
            </li>
          ))}
        </SearchListContainer>
      )}
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
