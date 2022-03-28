import styled from "styled-components";

export const SearchContainer = styled.div`
  width: 100%;
  height: 100vh;
  user-select: none;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .title {
    font-weight: 400;
    font-size: 5vw;

    :hover {
      color: #1b64da;
    }
  }

  .search {
    border: 1px solid black;
    border-radius: 20px;
    width: 30%;
    margin-top: 10%;
    padding: 1%;
    font-weight: 400;
    font-size: 1.5vw;
    text-align: center;

    :hover {
      cursor: pointer;
      color: #1b64da;
      border: 1px solid #1b64da;
    }
  }
`;
