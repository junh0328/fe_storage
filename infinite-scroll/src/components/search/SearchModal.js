import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import { SearchModalContainer } from "./SearchModal_style";
import axios from "axios";
import SearchList from "./SearchList";

const SearchModal = (props) => {
  const { setOnSearch } = props;

  const [done, setDone] = useState(false);

  const [query, setQuery] = useState("");
  const [nextPage, setNextPage] = useState(1);
  const [result, setResult] = useState([]);
  const [currentData, setCurrentData] = useState(-1);

  const [request, setRequest] = useState(false);

  useEffect(() => {
    if (currentData === result.length) {
      setRequest(true);
    }
  }, [currentData, result]);

  const onChange = useCallback(
    (e) => {
      if (e.target.value !== query) {
        setNextPage(1);
      }
      setQuery(e.target.value);
    },
    [query]
  );

  const fetchData = useCallback(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${query}&page=${nextPage}&include_adult=false`
      )
      .then((res) => {
        if (res.status === 200) {
          setCurrentData(res.data.total_results);

          let arr = [];
          arr = res.data.results.map((item) => ({
            id: item.id,
            original_title: item.original_title,
            title: item.title,
            src: item.poster_path,
          }));

          setResult([...result, ...arr]);
          setDone(true);
          setNextPage((num) => num + 1);
        } else {
          setResult([]);
          throw Error("error occures in axios get status", res.status);
        }
      })
      .catch((err) => {
        setResult([]);
        setDone(true);
        console.log("err: ", err);
      });
  }, [nextPage, query, result]);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setDone(false);
      fetchData();
      setResult(query);
    },
    [query, fetchData]
  );

  return (
    <SearchModalContainer>
      <div className="exit">
        <span onClick={() => setOnSearch(false)}>X</span>
      </div>

      <form onSubmit={onSubmit}>
        <input
          className="header"
          onChange={onChange}
          type="search"
          placeholder="Googol 검색 또는 url 입력"
        />
      </form>

      {done && (
        <div className="result">
          <SearchList
            data={result}
            query={query}
            request={request}
            fetchData={fetchData}
          />
        </div>
      )}
    </SearchModalContainer>
  );
};

export default SearchModal;

SearchModal.propTypes = {
  setOnSearch: PropTypes.func.isRequired,
};
SearchModal.defaultProps = {};
