# fe_storage

실무에서 공부한 자바스크립트 및 리액트 지식에 대해 기록하고 공유합니다.

타입스크립트로 넘어가기 전, 기본적인 자바스크립트와 리액트의 기본 라이프 사이클 메서드를 학습합니다.

## 목차

- [Class Component Functional Component](#Class-Component-Functional-Component)

  - state 참조하기
  - props 참조하기

- [propTypes defaultProps](#propTypes-defaultProps)

  - propTypes
  - defaultProps

- [flag](#flag)

- [인피니티 스크롤](#인피니티-스크롤)

## Class Component Functional Component

리액트는 현재 함수형 컴포넌트가 주를 이루고 있지만, 리액트의 근본은 클래스 컴포넌트입니다.

실무를 가게 되면 '나는 함수형 컴포넌트만 쓸거야'라고 생각했지만, 클래스형일 때 더욱 빛나는 또는 레거시로 남겨진 클래스형 컴포넌트 들이 존재합니다.

그렇기 때문에 state, props를 다루는 기본적인 내용을 우선적으로 공부하고 실무로 들어갈 필요가 있습니다

### state 참조하기

`case1: functional component`

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

`case1: functional component`

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

**flag(플래그)**는 크로스 브라우징(다양한 웹브라우저에서 깨지지 않게 보이는 웹페이지 제작 기술)을 지원하기 위해 존재합니다.

## 인피니티 스크롤
