import styled from "styled-components";

export const CustomForm = styled.form`
  width: 96%;
  padding: 2%;

  user-select: none;
`;

export const ButtonContainer = styled.div`
  button {
    margin-right: 1%;
  }
`;

export const DragContainer = styled.div`
  margin-top: 1%;
  .flex {
    margin-bottom: 1%;
    padding: 0.5%;
    display: flex;
    justify-content: flex-start;
    border: 1px solid black;

    input[type="text"] {
      margin-right: 2%;
    }
  }

  span {
    margin-right: 1%;
  }

  label {
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
    cursor: default;
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
