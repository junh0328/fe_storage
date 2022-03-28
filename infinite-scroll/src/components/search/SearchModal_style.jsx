import styled from "styled-components";

export const SearchModalContainer = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  position: fixed;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.8);
  padding: 3%;
  color: white;

  .exit {
    width: 100%;
    display: flex;
    justify-content: end;

    span {
      font-size: 2vw;

      :hover {
        cursor: pointer;
        color: #1b64da;
      }
    }
  }

  .header {
    display: block;
    margin: 0 auto;
    width: 50%;
    padding: 1% 2%;
    border-radius: 4vw;
    font-size: 2vw;
    font-weight: 400;
    padding-left: 2%;

    :focus { outline: none; }.
  }

  .result{
    margin-top: 5%;
    width: 100%;
    height: 70vh;
    overflow-y: auto;

    ::-webkit-scrollbar {
    width: 5px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #fff;
    }
    ::-webkit-scrollbar-track {
      background-color: grey;
    }


  }
`;
