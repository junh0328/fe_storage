import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import { SearchModalContainer } from "./SearchModal_style";
import axios from "axios";
import SearchList from "./SearchList";

const SearchModal = (props) => {
  const { setOnSearch } = props;
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    console.log("result: ", result);
  }, [result]);

  const onChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setDone(false);
      axios
        .get(
          `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`
        )
        .then((res) => {
          if (res.status === 200) {
            let arr = [];
            // https://image.tmdb.org/t/p/original/isvHZEzGHCqOtmS3KL28dZcG7AD.jpg
            // 필요한 것만 추상화해서 사용하기
            arr = res.data.results.map((item) => ({
              id: item.id,
              original_title: item.original_title,
              title: item.title,
              src: item.poster_path,
            }));

            console.log("arr: ", arr);
            setResult(arr);
            setDone(true);
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
      //
      setResult(query);
    },
    [query]
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
          <span> '{query}' 에 대한 검색 결과는 다음과 같습니다</span>
          <SearchList data={result} />
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
