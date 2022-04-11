# fe_storage

실무에서 공부한 자바스크립트 및 리액트 지식에 대해 기록하고 공유합니다.

타입스크립트로 넘어가기 전, 기본적인 자바스크립트와 리액트의 기본 라이프 사이클 메서드를 학습합니다.

## 목차

- [Class Component Function Component](#Class-Component-Function-Component)

  - state 참조하기
  - props 참조하기

- [propTypes defaultProps](#propTypes-defaultProps)

  - propTypes
  - defaultProps

- [flag](#flag)

- [인피니티 스크롤](#인피니티-스크롤)

- [드래그 앤 드롭](#드래그-앤-드롭)

## Class Component Function Component

리액트는 현재 함수 컴포넌트가 주를 이루고 있지만, 리액트의 근본은 클래스 컴포넌트입니다.

실무를 가게 되면 '나는 함수 컴포넌트만 쓸거야'라고 생각했지만, 클래스형일 때 더욱 빛나는 또는 레거시로 남겨진 클래스 컴포넌트 들이 존재합니다.

그렇기 때문에 state, props를 다루는 기본적인 내용을 우선적으로 공부하고 실무로 들어갈 필요가 있습니다.

### state 참조하기

`case1: function component`

```js
import { useState } from "react";
const Artist = () => {
  const [name, setName] = useState("Tim");
  return <>{name === "Tim" && <p>{name}님 안녕하세요!</p>}</>;
};
export default Artist;
```

`case2: class component`

```js
import React, { Component } from "react";
class App extends Component {
  constructor(props) {
    super();
    this.state = {
      name: "Tim",
    };
  }
  render() {
    return (
      <div>
        {this.state.name === "Tim" && <p>{this.state.name}님 안녕하세요!</p>}
      </div>
    );
  }
}
export default App;
```

### props 참조하기

`case1: function component`

```js
/* 부모 컴포넌트 🔥 */
import React, { useState } from "react";
import Artist from "./Artist";
const App = () => {
  const [name, setName] = useState("Tim");
  return <>{name === "Tim" && <Artist name={name} />}</>;
};
export default App;
```

기본적으로 함수형 컴포넌트의 어트리뷰트 노드 자리에 `프로퍼티 명 = {넘겨줄 실제 데이터}` 와 같은 방식으로 전달이 가능하다.

구조 분해 할당을 하지 않을 경우 자식 컴포넌트에서 props 로 넘겨 받고, props.xxx 로 사용하거나 자식 컴포넌트에서 구조 분해 할당을 하는 방식으로 사용이 가능하다.

```js
/* 구조분해 할당 사용하지 않기 🔥*/
import React from "react";
const Artist = (props) => {
  return <p>{props.name} 님 안녕하세요!</p>;
};
--------------------------------------------
/* 구조분해 할당 사용하기 🔥*/
import React from "react";
const Artist = ({ name }) => {
  return <p>{name} 님 안녕하세요!</p>;
};
export default Artist;
```

`case2: class component`

```js
/* 부모 컴포넌트 🔥 */
import React, { Component } from "react";
import Artist from "./Artist";
class App extends Component {
  constructor(props) {
    super();
    this.state = {
      name: "Tim",
    };
  }
  render() {
    return (
      <div>
        {this.state.name === "Tim" && <Artist name={this.state.name} />}
      </div>
    );
  }
}
export default App;
```

class 컴포넌트에서는 함수형 컴포넌트처럼 props 로 불러오지 않더라도 `this 바인딩` 을 통해 호출이 가능하다.

```js
/* 자식 컴포넌트 🔥 */
import React, { Component } from "react";
class Artist extends Component {
  render() {
    return <p>{this.props.name}님 안녕하세요</p>;
  }
}
export default Artist;
```

**React의 관점에서 볼 때 위 두 가지 유형의 컴포넌트는 동일합니다.**

하지만, class 형 컴포넌트에서는 `props` 에 대해서 정확한 파악이 힘들기 때문에, 리액트에서 제공하는 `PropTypes` 를 적극적으로 활용해야 합니다.

```js
/* 자식 컴포넌트 🔥 */
import PropTypes from "prop-types";
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
Welcome.propTypes = {
  name: PropTypes.string,
};
Welcome.defaultProps = {
  name: "junhee",
};
```

## propTypes defaultProps

### propTypes

`propTypes`는 `동적 타이핑`을 지원하는 자바스크립트를 리액트의 language로 사용할 때 넣어주면 좋은 타입추론 문법입니다.

**부모로부터 배열을 전달 받을 때 해당 배열의 타입을 추론하여 사용할 수 있습니다**

`case1 : 배열을 prop types로 지정하기`

```js
/* data 객체가 부모로부터 전달받는 배열 객체일 경우 🔥*/
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
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      src: PropTypes.string,
    })
  ).isRequired,
};
```

`case2 : enum type을 prop types로 지정하기`

- 열거형(enum)으로 처리하여 prop가 특정 값들로 제한되도록 할 수 있습니다
- isRequired로 처리하여 없을 경우 미리 발견할 수 있도록 한다

```js
MovieList.propTypes = {
  category: PropTypes.oneOf(["horror", "science_fiction", "family"]).isRequired,
};
```

```js
/* 부모 컴포넌트 🔥 */
<MovieList category="family" />
```

```js
/* 자식 컴포넌트 🔥 */
<div className={category === "horror" || category === "family" ? "red" : ""}>
  ...
</div>
```

다음과 같이 특정 카테고리`(horror || familt)`를 받을 때 해당 조건을 바탕으로 조건부 렌더링을 하기에 유용합니다.

### defaultProps

`defaultProps`는 부모로부터 전달받는 props 들의 초기값을 정해줄 수 있습니다.

```js
/* 자식 컴포넌트 🔥 */
import PropTypes from "prop-types";
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
Welcome.propTypes = {
  name: PropTypes.string,
};
Welcome.defaultProps = {
  name: "junhee",
};
```

자식 컴포넌트로 전달되는 props가 없는 경우 렌더링 실패 없이 보여줄 수 있습니다.

## flag

**flag**(=플래그) 는 크로스 브라우징(다양한 웹브라우저에서 깨지지 않게 보이는 웹페이지 제작 기술)을 지원하기 위해 존재합니다.

## 인피니티 스크롤

## 드래그 앤 드롭

<img src="./resource/drag and drop.gif" alt="드래그앤 드롭">

**드래그 앤 드롭** 은 유저의 경험(= UX)를 높일 수 있는 라이브러리 중 하나입니다.

예를 들어 비 개발자가 배열의 순서를 코드가 아닌 렌더링된 화면 상에서 조정해야 할 경우, index 와 같은 순서 체계를 모른다면 조정이 쉽지 않을 수 있습니다.

오디오 데이터를 삽입해야 하는데, 인덱스 순서를 조정할 수 없는 채로 push push push 를 반복하게 된다면 중간에 원하는 값(오디오)을 삽입하기 어려울 것입니다.

이를 효과적으로 다루기 위해서 드래그 앤 드랍 라이브러리를 배워두면 매우 유용하게 배열을 제어할 수 있습니다.

```
$ yarn add react-beautiful-dnd
$ yarn add styled-components
```

[react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) 레포지토리 바로가기

<details>
<summary>리액트 코드로 보기</summary>

```js
import React, { useCallback, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { CustomForm, DragContainer, ButtonContainer } from "./app_style";

const App = () => {
  const [items, setItems] = useState([
    { id: `1`, content: `item 1` },
    { id: `2`, content: `item 2` },
    { id: `3`, content: `item 3` },
    { id: `4`, content: `item 4` },
    { id: `5`, content: `item 5` },
  ]);
  const cnt = useRef(6);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const arr = reorder(items, result.source.index, result.destination.index);
    setItems(arr);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onAdd = useCallback(() => {
    let arr = [];

    arr = [...items];

    arr.push({
      id: cnt.current.toString(),
      content: "item " + cnt.current.toString(),
    });

    setItems(arr);
    cnt.current += 1;
  }, [items, cnt]);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log("items: ", items);
    },
    [items]
  );

  const onFilter = useCallback(
    (idx) => {
      let arr = [...items];
      arr.splice(idx, 1);
      setItems(arr);
    },
    [items]
  );

  return (
    <CustomForm onSubmit={onSubmit}>
      <ButtonContainer>
        <button type="button" onClick={onAdd}>
          Add
        </button>
        <button type="button" onClick={onSubmit}>
          Submit
        </button>
      </ButtonContainer>

      <DragContainer>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className="flex"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span className="content" type="text">
                          {item.content}
                        </span>
                        <span
                          onClick={() => onFilter(index)}
                          className="remove"
                        >
                          [X]
                        </span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </DragContainer>
    </CustomForm>
  );
};

export default App;
```

</details>

<details>
<summary>styled-components 스타일링 코드 보기</summary>

```js
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
```

</details>

<br/>

### 주의사항

`1.` 드래그 앤 드롭 코드 내에서 특별한 점은 반드시 인덱싱을 할 수 있는 **id** 값이 문자열이여 한다는 것입니다.

또한 제어를 위한 프로퍼티 이름이 반드시 **id** 일 필요는 없습니다.

```js
const [items, setItems] = useState([
  { id: `1`, content: `item 1` },
  { id: `2`, content: `item 2` },
  { id: `3`, content: `item 3` },
  { id: `4`, content: `item 4` },
  { id: `5`, content: `item 5` },
]);

...

<Draggable key={item.id} draggableId={item.id} index={index}>
  {(provided, snapshot) => (
    <div
      className="flex"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <span className="content" type="text">
        {item.content}
      </span>
      <span onClick={() => onFilter(index)} className="remove">
        [X]
      </span>
    </div>
  )}
</Draggable>;
```

`Draggable` 컴포넌트의 key 값이 `item.id` 인 이유는 사전에 구성한 배열이 `id` 이기 때문이고 예를 들어 `order`, `idx` 등으로도 추적이 가능합니다.

```js
const [items, setItems] = useState([
  {idx: `1`, content: `item 1` },
  {idx: `2`, content: `item 2` },
  {idx: `3`, content: `item 3` },
  {idx: `4`, content: `item 4` },
  {idx: `5`, content: `item 5` },
]);

...

<Draggable key={item.idx} draggableId={item.idx} index={index}>
  {(provided, snapshot) => (
    <div
      className="flex"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <span className="content" type="text">
        {item.content}
      </span>
      <span onClick={() => onFilter(index)} className="remove">
        [X]
      </span>
    </div>
  )}
</Draggable>;
```

`2.` 드래그앤 드롭을 효과적으로 컨트롤 할 수 있는 구조는 배열구조입니다. 인덱싱을 바탕으로 Array.prototype 메서드를 이용하기 때문에, `딕셔너리` 자료구조와 같이 순서에 얽메이지 않는 자료구조를 사용할 경우 의도와 다르게 동작할 수 있습니다.

`3.` 실질적인 flow는 다음과 같습니다.

- 마우스 이벤트를 바탕으로 구조를 변경할 배열을 캐치합니다
- 원하고자 하는 위치의 위 또는 아래로 드래그 이후 드랍합니다
- `DragDropContext` 의 프로퍼티인 `onDragEnd={onDragEnd}` 를 바탕으로 배열을 재정리합니다
- `onDragEnd` 메서드의 내부는 모두 배열의 프로토타입 메서드(splice, push, ...)를 이용합니다
- onSubmit , useEffect 등으로 변경된 배열의 인덱싱 순서를 관측하고 캐치할 수 있습니다
