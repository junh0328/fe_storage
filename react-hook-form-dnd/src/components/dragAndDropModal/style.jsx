import styled from "styled-components";

export const CustomForm = styled.form`
  width: 96%;
  padding: 2%;

  user-select: none;
`;

export const ButtonContainer = styled.div`
  margin-bottom: 2%;
  button {
    margin-right: 1%;
  }
`;

export const DragContainer = styled.div`
  margin-top: 1%;
  .flex {
    margin-bottom: 1%;
    display: flex;
    justify-content: flex-start;
    border: 1px solid black;
  }

  span {
    margin-right: 1%;
  }

  label {
    width: 100%;
    padding: 1%;
    cursor: pointer;
  }

  .content {
    width: 5%;
  }

  .id {
    width: 2%;
  }

  .input {
    border: none;
    cursor: pointer;
    user-select: none;

    :focus {
      outline: none;
    }
  }

  .remove {
    margin-left: 2%;
    color: red;

    :hover {
      cursor: pointer;
      font-weight: bold;
    }
  }
`;

export const ScriptModal = styled.div`
  display: ${(props) => (props.modalOn ? "flex" : "none")};
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #fff;

  cursor: auto;

  z-index: 3;

  input[type="text"] {
    width: 100%;
    border: none;
    border-bottom: 0.5px solid #000;
    background: none;
    font-size: 2vw;
    font-weight: 400;
  }

  textarea {
    margin-top: 1%;
    margin-bottom: 0;
    width: 100%;
    height: 40vh;
    border: 1px solid #000;
    overflow-y: auto;
    background: none;
    font-size: 1.5vw;
    font-weight: 400;

    ::-webkit-scrollbar-thumb {
      background: black;
    }
  }

  button {
    margin-top: 2%;
    border: 1px solid #000;
    color: #000;
    font-size: 1.5vw;
    font-weight: 400;
  }

  .exit {
    position: absolute;
    top: 2%;
    right: 2%;
    color: #000;
    cursor: pointer;

    :hover {
      color: #0064ff;
    }
  }

  .save {
    padding: 1%;
    background: inherit;
    color: #000;
    font-weight: 400;
    cursor: pointer;

    :hover {
      color: #0064ff;
    }
  }

  .text_container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    margin: 0 auto;
    width: 70%;
  }
`;
