import styled from "styled-components";

export const CustomForm = styled.form`
  width: 96%;
  padding: 2%;
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

  .content {
    margin-right: 1%;
  }

  .remove {
    color: red;
    cursor: pointer;
  }
`;
