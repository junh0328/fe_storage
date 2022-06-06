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

- [suspense](#suspense)

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

## suspense

## references

[리액트 코리아, suspense](https://ko.reactjs.org/docs/concurrent-mode-suspense.html#what-is-suspense-exactly)

## Suspense가 정확히 무엇인가요?

Suspense를 사용하면 컴포넌트가 렌더링되기 전까지 기다릴 수 있습니다. [이 예시](https://codesandbox.io/s/frosty-hermann-bztrp)에서는 두 컴포넌트가 데이터를 불러오는 비동기 API 호출을 기다립니다.

```jsx
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // 비록 아직 불러오기가 완료되지 않았겠지만, 사용자 정보 읽기를 시도합니다
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // 비록 아직 불러오기가 완료되지 않았겠지만, 게시글 읽기를 시도합니다
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

[code sandbox 예시 코드 보기](https://codesandbox.io/s/frosty-hermann-bztrp)

Suspense는 데이터 불러오기 라이브러리가 아닙니다. Suspense는 **’_컴포넌트가 읽어들이고 있는 데이터가 아직 준비되지 않았다’_** 고 React에 알려줄 수 있는, **데이터 불러오기 라이브러리에서 사용할 수 있는 메커니즘**
입니다. 이후에 React는 데이터가 준비되기를 기다렸다가 UI를 갱신할 수 있습니다.

장기적인 관점으로는, **Suspense가 데이터 출처와 상관없이 컴포넌트로부터 비동기 데이터를 읽는 데에 사용되는 주된 방식으로 거듭나길** 바라고 있습니다.\*\*\*\*

## Suspense가 아닌 것

Suspense는 위의 문제에 대한 기존의 접근 방식과는 상당히 다르기 때문에, 처음 접할 때 종종 오해를 만들어냅니다. 가장 흔한 오해들을 명확히 짚어보겠습니다.

- **Suspense는 데이터 불러오기에 대한 구현이 아닙니다.** GraphQL, REST 또는 특정한 데이터 형식, 라이브러리, 전송 또는 프로토콜을 사용한다고 가정하지 않습니다.
- **Suspense는 바로 사용할 수 있는 클라이언트가 아닙니다.** `fetch` 또는 Relay를 Suspense로 “대체”할 수 없습니다. 다만, Suspense로 통합된 라이브러리를 사용할 수는 있습니다(예를 들어, [새로운 Relay API](https://relay.dev/docs/api-reference/relay-environment-provider/)와 같은 것이 있습니다).
- **Suspense는 데이터 불러오기 작업과 뷰 레이어를 결합해주지 않습니다.** UI 상에 로딩 상태를 표시할 수 있도록 조정하는 것을 돕지만, 이는 네트워크 로직을 React 컴포넌트에 종속시키는 것은 아닙니다.

## Suspense로 가능한 것

그렇다면 Suspense는 왜 사용하는 것일까요? 이에 대한 몇 가지 답이 있습니다.

- **데이터 불러오기 라이브러리들이 React와 깊게 결합할 수 있도록 해줍니다.** 데이터 불러오기 라이브러리가 Suspense 지원을 구현한다면, React 컴포넌트에서 이를 사용하는 것이 아주 자연스럽게 느껴질 것입니다.
- **의도적으로 설계된 로딩 상태를 조정할 수 있도록 해줍니다.** Suspense는 데이터가 *어떻게* 불러져야 하는지를 정하지 않고, 앱의 시각적인 로딩 단계를 밀접하게 통제할 수 있도록 해줍니다.
- **경쟁 상태(Race Condition)를 피할 수 있도록 돕습니다.** `await`를 사용하더라도 비동기 코드는 종종 오류가 발생하기 쉽습니다. Suspense를 사용하면 데이터를 *동기적으로* 읽어오는 것처럼 느껴지게 해줍니다. 마치 이미 불러오기가 완료된 것처럼 말입니다.

## 기존의 접근 방식 vs Suspense

Suspense를 소개할 때 대중적인 데이터 불러오기 방식을 언급하지 않을 수도 있을 것입니다. 하지만, 그러면 Suspense가 해결하고자 하는 문제가 무엇인지, 왜 그 문제가 해결할 가치를 가지는지, Suspense가 기존의 해결책과 다른 점이 무엇인지 이해하기 어려울 것입니다.

대신, Suspense를 일련의 접근 방식들에서 논리적인 다음 단계로 바라보겠습니다.

- **렌더링 직후 불러오기 (예를 들어, `useEffect` 내에서 `fetch`):** 컴포넌트 렌더링을 시작합니다. 각각의 컴포넌트는 Effect와 생명 주기 메서드 내에서 데이터 불러오기를 발동시킵니다. 이 접근법은 종종 “워터폴”로 이어집니다.
- **불러오기 이후 렌더링 (예를 들어, Suspense 없이 Relay 사용):** 최대한 일찍 다음 화면을 위한 데이터 불러오기를 시작합니다. 데이터가 준비되었을 때 화면을 렌더링합니다. 데이터가 도착하기 전까지는 아무 것도 할 수 없습니다.
- **불러올 때 렌더링 (예를 들어, Suspense와 함께 Relay 사용):** 최대한 일찍 다음 화면에서 필요한 데이터 불러오기를 시작하고, 다음 화면 렌더링을 *네트워크 응답을 받기 전에 즉시* 시작합니다. 데이터가 흘러들어옴에 따라, React는 모든 데이터가 준비될 때까지 데이터를 필요로 하는 컴포넌트의 렌더링을 다시 시도합니다.

> 주의
>
> 위의 설명은 다소 단순화된 것으로, 실제 해결 방안은 다양한 접근 방식을 혼합하여 사용하게 됩니다. 하지만 장단점을 잘 비교할 수 있도록 각각을 분리하여 생각해보겠습니다.

---

각 접근 방식을 비교하기 위하여, 각각을 사용하여 프로필 페이지를 구현하겠습니다.

## 접근 방식 1: 렌더링 직후 불러오기 (Suspense 미사용)

React 앱에서 데이터를 불러오는 가장 흔한 방식은 Effect를 사용하는 것입니다.

```jsx
// 함수 컴포넌트에서:
useEffect(() => {
  fetchSomething();
}, []);

// 또는, 클래스 컴포넌트에서:
componentDidMount() {
  fetchSomething();
}
```

이러한 접근 방식을 “렌더링 직후 불러오기”라고 부릅니다. 왜냐하면 화면 상에 컴포넌트가 렌더링 완료된 *후에* 비로소 데이터 불러오기를 시작하기 때문입니다. 이는 “워터폴”이라고 부르는 문제로 이어집니다.

아래의 `<ProfilePage>`와 `<ProfileTimeline>` 컴포넌트를 보시기 바랍니다.

```jsx
function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then((u) => setUser(u));
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline />
    </>
  );
}

function ProfileTimeline() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts().then((p) => setPosts(p));
  }, []);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox에서 따라해보기](https://codesandbox.io/s/fast-glade-rqnhtt)**

위의 코드를 실행하고 콘솔 로그를 살펴보면, 아래와 같은 일련의 결과를 확인할 수 있습니다.

1. 사용자 정보 불러오기 시작
2. 기다리기…
3. 사용자 정보 불러오기 완료
4. 게시글 불러오기
5. 기다리기…
6. 게시글 불러오기 완료

사용자 정보 불러오기가 3초 소요된다면, 3초가 지난 뒤에야 비로소 게시글 불러오기를 *시작*할 수 있는 것입니다! 이것이 바로 “워터폴”로, 병렬화될 수 있었으나 의도하지 않게 *순차적으로* 실행되는 현상입니다.

워터폴은 렌더링 직후 데이터를 불러오는 코드에서 흔히 발생합니다. 이를 고치는 것은 가능하지만, 앱이 거대해짐에 따라 많은 사람들은 이 문제를 방지할 수 있는 해결책을 원할 것입니다.

---

## 접근 방식 2: 불러오기 이후 렌더링 (Suspense 미사용)

라이브러리는 데이터를 불러오는 데에 있어 보다 중앙화된 방식을 제공하는 것으로 워터폴을 방지할 수 있습니다. 예를 들어 Relay의 경우, 컴포넌트가 필요로 하는 데이터에 대한 정보를 정적으로 분석할 수 있는 *부분들*로 옮겨서 이 문제를 해결합니다. 이 부분들은 이후에 하나의 단일 쿼리로 통합됩니다.

이 페이지에서는 Relay에 대한 배경 지식이 없다고 가정하므로, Relay를 예시로 들지 않겠습니다. 대신, 데이터 불러오기 메서드를 하나로 합쳐서, 비슷한 앞서 설명한 것과 유사한 코드를 직접 작성해보겠습니다.

```jsx
function fetchProfileData() {
  return Promise.all([fetchUser(), fetchPosts()]).then(([user, posts]) => {
    return { user, posts };
  });
}
```

아래의 예시에서는 `<ProfilePage>`가 두 요청을 기다리는데, 두 요청은 동시에 시작됩니다.

```jsx
// 최대한 일찍 불러오기를 발동시킵니다
const promise = fetchProfileData();

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    promise.then((data) => {
      setUser(data.user);
      setPosts(data.posts);
    });
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline posts={posts} />
    </>
  );
}

// 자식 컴포넌트들은 더 이상 불러오기를 발동시키지 않습니다
function ProfileTimeline({ posts }) {
  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox에서 따라해보기](https://codesandbox.io/s/hopeful-lake-loddz9)**

이벤트가 발동하는 순서는 이제 아래와 같이 바뀝니다.

1. 사용자 정보를 불러오기 시작
2. 게시글 불러오기 시작
3. 기다리기…
4. 사용자 정보 불러오기 완료
5. 게시글 불러오기 완료

기존에 존재했던 네트워크 “워터폴” 현상은 고쳤지만, 의도하지 않은 또다른 문제를 만들었습니다. `fetchProfileData` 내에서 `Promise.all()`을 사용하는 과정에서 *모든* 데이터가 반환되기를 기다려야 합니다. 따라서 게시글들을 모두 불러오기 전까지는 프로필 정보를 렌더링할 수 없습니다. 둘 다 기다려야 합니다.

물론, 이 예시에서는 이를 고칠 수 있습니다. `Promise.all()` 호출을 없애고, 두 프라미스를 따로 기다리면 됩니다. 하지만, 이러한 접근 방식은 데이터와 컴포넌트 트리의 복잡도가 커짐에 따라 점점 더 어려워집니다. 데이터 트리 내의 임의 부분이 사라지거나 오래될 수 있는 상황에서는 신뢰할 수 있는 컴포넌트를 작성하기 어렵습니다. 따라서 새로운 화면을 위한 데이터를 모두 불러오고 *그 다음에* 렌더링하는 것이 종종 보다 현실적인 선택지입니다.

---

## 접근 방식 3: 불러올 때 렌더링 (Suspense 사용)

직전의 접근 방식에서는 아래와 같이, `setState`를 호출하기 전에 데이터를 불러왔습니다.

1. 불러오기 시작
2. 불러오기 완료
3. 렌더링 시작

Suspense를 사용하면, 불러오기를 먼저 시작하면서도 아래와 같이 마지막 두 단계의 순서를 바꿔줄 수 있습니다.

1. 불러오기 시작
2. **렌더링 시작**
3. **불러오기 완료**

**Suspense를 사용하면, 렌더링을 시작하기 전에 응답이 오기를 기다리지 않아도 됩니다.** 사실 네트워크 요청을 발동시키고서, 아래와 같이 *상당히 바로* 렌더링을 발동시킵니다.

```jsx
// 이것은 프라미스가 아닙니다. Suspense 통합에서 만들어낸 특별한 객체입니다.
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // 아직 로딩이 완료되지 않았더라도, 사용자 정보 읽기를 시도합니다
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // 아직 로딩이 완료되지 않았더라도, 게시글 읽기를 시도합니다
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox에서 따라해보기](https://codesandbox.io/s/frosty-hermann-bztrp)**

화면 상에 `<ProfilePage>`를 렌더링할 때에 아래와 같은 일들이 벌어집니다.

1. 이미 `fetchProfileData()` 내에서 요청을 발동시켰습니다. 이 함수는 프라미스가 아니라 특별한 “자원”을 돌려줍니다. 보다 현실적인 예시에서는, Relay와 같은 데이터 라이브러리에서 제공하는 Suspense 통합을 제공할 겁니다.
2. React는 `<ProfilePage>`의 렌더링을 시도합니다. 자식 컴포넌트로 `<ProfileDetails>`와 `<ProfileTimeline>`을 반환합니다.
3. React는 `<ProfileDetails>`의 렌더링을 시도합니다. `resource.user.read()`를 호출합니다. 아직 불러온 데이터가 아무 것도 없으므로, 이 컴포넌트는 “정지합니다”. React는 이 컴포넌트를 넘기고, 트리 상의 다른 컴포넌트의 렌더링을 시도합니다.
4. React는 `<ProfileTimeline>`의 렌더링을 시도합니다. `resource.posts.read()`를 호출합니다. 또 한번, 아직 데이터가 없으므로, 이 컴포넌트 또한 “정지합니다”. React는 이 컴포넌트도 넘기고, 트리 상의 다른 컴포넌트의 렌더링을 시도합니다.
5. 렌더링을 시도할 컴포넌트가 남아있지 않습니다. `<ProfileDetails>`가 정지된 상태이므로, React는 트리 상에서 `<ProfielDetails>` 위에 존재하는 것 중 가장 가까운 `<Suspense>` Fallback을 찾습니다. 그것은 `<h1>Loading profile...</h1>`입니다. 일단, 지금으로서는 할 일이 다 끝났습니다.

여기에서 `resource` 객체는 아직은 존재하지 않지만, 결국엔 로딩이 이루어질 데이터를 나타냅니다. `read()`를 호출할 경우, 데이터를 얻거나, 또는 컴포넌트가 “정지합니다”.

**데이터가 계속 흘러들어옴에 따라, React는 렌더링을 다시 시도하며, 그 때마다 React가 “더 깊은 곳까지” 처리할 수 있게 될 겁니다.** `resource.user`를 불러오고 나면, `<ProfileDetails>` 컴포넌트는 성공적으로 렌더링이 이루어지고 `<h1>Loading profile...</h1>` Fallback은 더 이상 필요가 없어집니다. 결국 모든 데이터가 준비될 것이고, 화면 상에는 Fallback이 사라질 것입니다.

이것은 아주 흥미로운 의미를 지닙니다. 설령 한번의 요청으로 모든 데이터 요구 사항을 충족시킬 수 있는 GraphQL 클라이언트를 사용할지라도, *응답이 계속 흘러들어오도록 하면 컨텐츠를 더 일찍 표시할 수 있게 해줍니다.* (불러오기 *이후*가 아니라) *불러올 때에* 렌더링을 수행하기 때문에, `user`가 `posts`보다 응답에 먼저 들어있을 경우, 응답이 완료되기도 전에 바깥의 `<Suspense>` 경계를 해제할 수 있습니다. 우리가 이 부분을 처음에 놓치고 지나갔겠지만, 불러오기 이후에 렌더링을 하는 해결 방식에서도 워터폴은 나타납니다. 바로 불러오기와 렌더링 사이에 말입니다. Suspense을 사용하면 애초부터 이러한 워터폴을 경험하지 않을 수 있고, Relay와 같은 라이브러리들은 이러한 이점을 활용하고 있습니다.

컴포넌트에서 “로딩 여부를 확인하는” `if (...)` 검사가 제거된 것을 유의하시기 바랍니다. 이렇게 하면 보일러플레이트 코드를 제거할 뿐만 아니라, 간단한 절차만으로 신속한 디자인 변화를 만들 수 있게 해줍니다. 예를 들어, 프로필 정보와 게시글이 항상 함께 “나타나도록” 해야 한다면, 그 둘 사이의 `<Suspense>` 경계를 제거해주면 됩니다. 또는 각 컴포넌트에게 *고유한* `<Suspense>` 경계를 부여하여 각각을 독립시켜줄 수도 있습니다. Suspense는 로딩 상태의 기본 단위를 변경할 수 있고, 코드를 크게 변경하지 않고도 로딩 상태의 배치를 조정할 수 있도록 해줍니다.

---

## 오류 처리하기

프라미스를 사용하여 코드를 작성할 때, 오류를 처리하기 위하여 `catch()`를 사용했을 겁니다. Suspense를 사용할 때는 프라미스가 렌더링을 시작하길 *기다리지* 않는데, 이러한 오류 처리가 어떻게 이루어질까요?

Suspense를 사용하면, 불러오기에서 발생한 오류를 처리하는 것이 렌더링 오류를 처리하는 것과 동일한 방식으로 이루어집니다. 어디에서든 [오류 경계](https://ko.reactjs.org/docs/error-boundaries.html)를 렌더링하여 그 아래에 존재하는 컴포넌트의 오류를 “잡아낼” 수 있습니다.

우선, 프로젝트 전체에 걸쳐 사용할 오류 경계 컴포넌트를 아래와 같이 정의합니다.

```jsx
// 오류 경계는 현재 클래스 형태이어야 합니다.
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

이제 오류 경계를 아래와 같이 트리 상의 오류를 잡아낼 곳 어디에든 배치하면 됩니다.

```jsx
function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <ErrorBoundary fallback={<h2>Could not fetch posts.</h2>}>
        <Suspense fallback={<h1>Loading posts...</h1>}>
          <ProfileTimeline />
        </Suspense>
      </ErrorBoundary>
    </Suspense>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/sparkling-rgb-r5vfhs)**

이 오류 경계는 렌더링 오류, *그리고* 데이터 불러오기를 위한 Suspense에서 발생한 오류를 둘 다 잡아낼 겁니다. 오류 경계는 쓰고 싶은 만큼 사용할 수 있지만, 오류 경계의 배치는 [계획적으로](https://aweary.dev/fault-tolerance-react/) 이루어지는 것이 제일 좋습니다.

---

## 확인한 결론

suspense 와 react-boundary를 통해서 라우팅 에러 또는 데이터 패칭 관련 에러를 효율적으로 핸들링할 수 있지만, class 컴포넌트로 강제된다
