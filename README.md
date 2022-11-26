# [Visual-system](https://www.visual-system.online)

System Monitoring Application Created with [vanilla JS](https://developer.mozilla.org/ko/docs/Web/JavaScript) + [electron](https://www.electronjs.org) + [D3.js](https://d3js.org)

<p align='center'>
<img src="https://user-images.githubusercontent.com/99335782/203970220-0beef7d5-18ed-4ea6-9a63-29752bdacdf9.png" width="600">
</p>

# 목차
- [어떻게 만들었나](#어떻게-만들었나)
  - [함수형 프로그래밍의 도입](#함수형-프로그래밍의-도입)
  - [옵저버패턴을 적용한 인터벌 관리](#옵저버패턴을-적용한-인터벌-관리)
  - [Vanilla JS로 SPA 만들기](#vanilla-js로-spa-만들기)
  - [D3.js로 svg태그 다루기](#d3js로-svg-태그-다루기)
  - [electron main과 renderer의 통신](#electron에서의-main과-renderer의-소통-방식)
  - [시스템 정보 가져오기](#시스템-정보-가져오기)
  - [개발 환경 셋팅](#개발-환경-셋팅)

- [개발 환경 사용법](#개발-환경-사용법)

- [프로젝트 기간](#프로젝트-기간)

- [회고](#회고)

<br>

## 어떻게 만들었나

### 함수형 프로그래밍의 도입
```js
// ./src/mainProcess/osUtil/getCPUInstance
const idle = _.go(
  cpuIter,
  _.map(bValue('idleSum')),
  _.reduce(subtract),
);

// ./src/mainProcess/osUtil/getMemoryInstance
const vmStatInfoArr = _.go(
  vmStatStr,
  str => str.split('\n'),
  L.filter(str => str !== ''),
  L.map(str => str.split(':')),
  _.map(_.pipe(
    L.getIndex,
    _.map(([str, idx]) => (idx
      ? str.replace('.', '').trim()
      : str)),
  )),
);
```
이터러블 프로토콜에 따른 함수형 프로그래밍의 도입을 인하여 코드에 for 문이 없어지고 명령적이게 되어서 한눈에 어떤 로직인 파악하기가 쉬워졌습니다.

<br>

>### 함수형 프로그래밍를 하면서 느낀점 부가 설명
>
>#### 함수형 프로그래밍의 장점
>- 지연성 평가와 커링을 이용하여서 함수의 평가 시점을 원하는 데로 컨트롤이 가능하고, 파이프 함수를 이용하여 함수 합성으로 새로운 함수를 만들 수가 있어서 함수의 재사용성이 더 좋아지는 장점이 있습니다.
>- for 문이 없으므로 실수할 확률이 적어지고 코드 유지 보수도 쉬워진 느낌을 받았습니다.
>
>#### 함수형 프로그래밍을 하면서 힘들었던점 및 아쉬운점
>- 함수를 잘게 쪼개고 사용하다 보면 다른 사람이 코드를 봤을 때 지나친 추상화로 인하여 코드를 이해하는 못하는 경우가 생길 것 같은 느낌이 들었습니다.
>
>- 에러 처리 및 모나드 타입(자바스크립트에서는 명시되어 있지는 않지만)에 대한 활용 등 좀 더 깊게 파고들어서 활용할 만한 케이스는 이번 프로젝트에서는 느끼질 못하여서 함수형 프로그래밍에 발만 담근 느낌이라 아쉬웠습니다

<br>

### 옵저버패턴을 적용한 인터벌 관리

#### 이벤트 구독 및 알림
```js
/** 코드 내용 일부 발췌 **/
// 이벤트 구독하기
const onCPUUsageEvent = receiveChannel(channelEnum.CPU.USAGE);
onCPUUsageEvent(intervalUpdateCPU);

// interval 데이터 수집 시작
const getCPUInstance = makeSingleTonFactory(CPUInfo);
const cpuInfo = getCPUInstance();
cpuInfo.startInterval(INTERVAL_TIME_500);

// 알림 주기
startInterval(time) {
  this.interval = setInterval(() => {
    this.data.push(os.cpus());
    this.notify('interval', this);
  }, time);
}
```

main Process에서 인터벌마다 실시간으로 데이터를 수집하기 때문에 수집할 때마다 구독자에게 알림을 주는 형식을 취하여서 관련된 데이터에 대한 인터벌을 한곳에서 관리하였습니다.  
그리고 혹시나 인터벌이 여러 개 걸릴 수 있는 상황을 방지하고자 싱글톤 패턴을 적용하여 관련된 인스턴스가 하나만 존재하도록 하였습니다.

<br>

#### 이벤트 관리
```js
// 이벤트를 등록하면 클리어함수를 리턴하도록 하였습니다.
export const customAddEventListener = (eventName, f, parent = window) => {
  const handler = () => f();

  parent.addEventListener(eventName, handler);

  return () => parent.removeEventListener(eventName, handler);
};

// unmount함수를 만들어서 이벤트 관리
unmount(customAddEventListener('resize', reSizing));

unmount(onProcessEvent(processList.render.bind(processList)));
```
renderer Process에서 main Process에 이벤트 구독을 하여서 데이터를 얻는 방법을 취하여서 페이지가 변경될 시 기존의 이벤트를 끊어 줘야 했습니다.  
이 로직들을 손쉽게 하기 위하여 unmount 함수를 만들어서 어떤 로직이 이벤트가 걸리는 건지 파악하기도 쉽고 따로 관리해 줄 필요 없이 알아서 해당 페이지가 없어질 시 클리어 함수들이 실행되게 하였습니다.

<br>

### Vanilla JS로 SPA 만들기
```js
// ./lib/simpleDom.js
const template = (tag, value) => `<${tag}>${value}</${tag}>`;

const el = html => {
  const wrapper = document.createElement('div');
  wrapper.insertAdjacentHTML('afterbegin', html);

  return wrapper.children[0];
};

const $ = { template, el, ... };

// ./src/rendererProcess/pages/cpuPage.js
const container = _.go(
  $.template('article', ''),
  $.el,
  $.addClass('flex-container'),
  $.addClass('cpuPage'),
);

unmount(renderDom(container));

const coreTemplate = _.go(
  L.range(cpuInfo.length),
  _.map(index => `
    <div class="cpu-core-wrapper">
      <p>CPU CORE ${index + 1} usage <span class="cpu-text"></span></p>
      <div class="cpu-core item"></div>
    </div>
  `),
  _.join('\n'),
);

$.afterBeginInnerHTML(container, coreTemplate);
```
함수형 프로그래밍을 위한 유틸 함수를 사용하여서 간단한 dom 제어 함수들을 만들어서 사용하였습니다.  
html 템플릿을 만들고 현재 innerHtml 보다 빠르다고 하는 insertAdjacentHTML를 이용하여 HTML를 넣어주어서 돔을 만들었습니다.

<br>

### D3.js로 SVG 태그 다루기
```js
svgElement.selectAll('g')
  .data(data)
  .join(
    enter => enter...,
    update => update...,
    exit => exit...,
  );
```
D3 객체를 활용하여 데이터를 바인딩하고, join 메서드를 사용하면 추가되는 데이터, 업데이트되는 데이터, 사라지는 데이터를 각각 한 번에 컨트롤이 가능하였습니다.  
이를 활용하여 원하는 대로 커스텀을 용이하게 하였습니다.

<br>

### electron에서의 main과 renderer의 소통 방식
```js
// ./src/preload.js
contextBridge.exposeInMainWorld('api', {
  cpu: () => ipcRenderer.invoke('cpu'),
});

contextBridge.exposeInMainWorld('connect', {
  on: curry((channel, fn) => {
    const subscription = (event, ...args) => fn(...args);

    ipcRenderer.on(channel, subscription);

    return () => ipcRenderer.removeListener(channel, subscription);
  }),
});
```
보안 이슈에 의해 현재 일렉트론(version: 21.2.2)에서는 main(node.js)과 renderer(chromium)의 소통 방식이 오직 preload를 통한 ipc 통신만 가능한 형태를 취하고 있습니다.  
그래서 이 규칙에 따라 간단한 함수들은 invoke 형식을 건네주었고, 이벤트 구독 방식은 on 함수를 만들어서 preload로 제공하고, renderer에서 이벤트 구독과 취소를 용이하게 할 수 있도록 하였습니다.

<br>

### 시스템 정보 가져오기
* `node.js`에서 제공되는 `os 모듈`에서 기본 시스템 정보 및 메모리, cpu에 대한 정보를 가져올 수가 있었습니다.
* 메모리에 대한 디테일한 사용량 및 프로세스 및 디스크에 대한 정보는 node.js에서 제공되는 모듈로는 정보를 얻을 수가 없어서 `child-process` 모듈을 통해, 터미널에 유닉스 터미널 명령어를 실행시켜 얻은 `stdout` 값으로 가공하여 데이터를 얻었습니다.

<br>

### 개발 환경 셋팅
* `electron` 공식 문서에서 권장하는 `electron-forge`를 이용하여서 개발 환경을 세팅하였습니다.  
`electron-forge`를 이용하면 mainProcess와 renderer에 손쉽게 다른 webpack 세팅 값을 적용할 수가 있고, webpack dev server 여는 동시에 main Process를 연결시키고 프로그램을 실행시켜 주기 때문에 개발하기가 편리하였습니다.
* webpack의 loader와 plugin은 필요한 것 만 최소한으로 넣어서 간단하게 세팅하여 사용하였습니다.(renderer 프로세스의 css loader, scss loader)

<br>

## 개발 환경 사용법
```
// webpack dev server를 이용한 개발서버 실행
$ npm start

// App 패키징
$ npm run make
```

<br>

## 프로젝트 기간

기간: 2022. 11. 07 ~ 11. 25

* 1주차: 아이디어 선정 하여 기획 및 POC

* 2주차: 기획 단계에 계획된 칸반에 따라 기능개발

* 3주차: 기능 개발 마무리 및 배포하기

<br>

## 회고
혼자서 프로젝트를 진행하면서 무언가를 만드는 과정은 처음이었습니다.  
오로지 혼자서 작업을 해나가다 보니, 팀원들도 고려해야 되는 팀 프로젝트와는 달리 자신만의 규칙으로 작업을 할 수가 있으니, 혼자 이것저것 시도해 보면서 재미있게 작업을 하였었습니다.  
프레임 워크 없이 혼자서 처음부터 무언가를 만들어보고, 평소에 잘 사용하지 않았던 class도 써보고, 만들고 싶은 함수도 마음대로 만들어서 작업을 하였습니다. 이러한 과정에서 저의 코드가 발전하고 있음을 느꼈고, 앞으로도 잘 발전 해나갈 수 있다는 자신감을 얻었습니다.  
그리고 앞으로 다양한 디자인 패턴들을 공부하며 또 적용시킬 수 있는 게 뭐가 있을지 알아보고 싶고, 다양한 함수형 프로그래밍 라이브러리(lodash, FxJS, ...)들을 참고하여, 유용한 함수들이 또 어떤 게 있을지 공부해 보고 싶습니다.  
이상입니다. 감사합니다.
