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
  - [D3.js로 svg태그 다루기](#d3js로-svg태그-다루기)
  - [electron main과 renderer의 통신](#electron에서의-main과-renderer의-소통-방식)

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
이터러블 프로토콜에 따른 함수형 프로그래밍의 도입을 인하여 코드에 for문이 없어지고 명령적이게 되어서 한눈에 어떤 로직인 파악하기가 쉬워졌습니다.

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
main Process에서 인터벌마다 실시간으로 데이터를 수집하기 때문에 수집할 때 마다 구독자에게 알림을 주는 형식을 취하여서 관련된 데이터에 대한 인터벌을 한곳에서 관리하였습니다.  
그리고 혹시나 인터벌이 여러개 걸릴수 있는 상황을 방지하고자 싱글톤 패턴을 적용하여 관련된 인스턴스가 하나만 존재하도록 하였습니다.
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
renderer Process에서 main Process에 이벤트 구독을 하여서 데이터를 얻는 방법을 취하여서 페이지가 변경 될시 기존의 이벤트를 끊어 줘야 했습니다.  
이 로직들을 손쉽게 하기 위하여 unmount함수를 만들어서 어떤 로직이 이벤트가 걸리는건지 파악하기도 쉽고 따로 관리해줄필요 없이 알아서 해당 페이지가 없어질시 클리어 함수들이 실행되게 하였습니다.  

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
함수형 프로그래밍을 위한 유틸함수를 사용하여서 간단한 dom제어 함수들을 만들어서 사용하였습니다.  
html 템플릿을 만들고 현재 innerHtml 보다 빠르다고 하는 insertAdjacentHTML를 이용하여 HTML를 넣어주어서 돔을 만들었습니다.

<br>

### D3.js로 SVG태그 다루기
```js
svgElement.selectAll('g')
  .data(data)
  .join(
    enter => enter...,
    update => update...,
    exit => exit...,
  );
```
D3객체를 활용하여 데이터를 바인딩하고, join 메소드를 사용하면 추가되는 데이터, 업데이트되는 데이터, 사라지는 데이터를 각각 한번에 컨트롤이 가능하였습니다.  
이를 활용하여 원하는대로 커스텀을 용이하게 하였습니다.

<br>

### electron에서의 main과 renderer의 소통 방식
```js
// ./src/preload.js
contextBridge.exposeInMainWorld('api', {
  cpu: () => ipcRenderer.invoke('cpu'),
};

contextBridge.exposeInMainWorld('connect', {
  on: curry((channel, fn) => {
    const subscription = (event, ...args) => fn(...args);

    ipcRenderer.on(channel, subscription);

    return () => ipcRenderer.removeListener(channel, subscription);
  }),
};
```
보안 이슈에 의해 현재 일렉트론(version: 21.2.2)에서는 main(node.js)과 renderer(chromium)의 소통방식이 오직 preload를 통한 ipc통신만 가능한 형태를 취하고있습니다.  
그래서 이 규칙에 따라 간단한 함수들은 invoke형식을 건내주었고, 이벤트 구독방식은 on 함수를 만들어서 preload로 제공하고, renderer에서 이벤트 구독과 취소를 용이하게 할수있도록 하였습니다.

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

* 1주차
  - 아이디어 선정 하여 기획 및 POC

* 2주차
  - 기획 단계에 계획된 칸반에 따라 기능개발

* 3주차
  - 기능 개발 마무리 및 배포하기

<br>

## 회고
혼자서 프로젝트를 진행하면서 무언가를 만드는 과정은 처음 이였습니다.  
오로지 혼자서 작업을 해나가다보니, 팀원들도 고려해야되는 팀프로젝트와는 달리 자신만의 규칙으로 작업을 할수가 있으니, 혼자 이것 저것 시도해보면서 재미있게 작업을 하였었습니다.  
프레임 워크 없이 혼자서 처음부터 무언가를 만들어보고, 평소에 잘 사용하지않았던 class도 써보고, 만들고 싶은 함수도 마음데로 만들어서 작업을 하였습니다. 이러한 과정에서 저의 코드가 발전하고 있음을 느꼈고, 앞으로도 잘 발전 해나갈수 있다는 자신감을 얻었습니다.  
그리고 앞으로 다양한 디자인 패턴들을 공부하며 또 적용 시킬수 있는게 뭐가 있을지 알아보고 싶고, 다양한 함수형프로그래밍 라이브러리(lodash, FxJS, ...)들을 참고하여, 유용한 함수들이 또 어떤게 있을지 공부해보고 싶습니다.  
이상입니다. 감사합니다.
