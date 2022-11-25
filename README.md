# [Visual-system](https://www.visual-system.online)

System Monitoring Application Created with [vanilla JS](https://developer.mozilla.org/ko/docs/Web/JavaScript) + [electron](https://www.electronjs.org) + [D3.js](https://d3js.org)

<p align='center'>
<img src="https://user-images.githubusercontent.com/99335782/203970220-0beef7d5-18ed-4ea6-9a63-29752bdacdf9.png" width="600">
</p>

# 목차
- [어떻게 만들었나](#어떻게-만들었나)
- [개발 환경 사용법]
- [기술 스텍]
- [프로젝트 기간]
- [회고]

<br>

## 어떻게 만들었나
- [함수형 프로그래밍의 도입](#함수형-프로그래밍의-도입)
- [옵저버패턴을 이용한 인터벌 관리](#옵저버패턴을-이용한-인터벌-관리)
- [Vanila JS로 SPA 만들기](#vanila-js로-spa-만들기)
- [D3.js로 svg태그 다루기](#d3js로-svg태그-다루기)
- [electron main과 renderer의 통신](#electron에서의-main과-renderer의-소통-방식)

### 함수형 프로그래밍의 도입
```js
// CPU 데이터 가공 로직 일부 발췌
const idle = _.go(
  cpuIter,
  _.map(bValue('idleSum')),
  _.reduce(subtract),
);

// 메모리 데이터 가공 로직 일부 발췌
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

### 옵저버패턴을 이용한 인터벌 관리

#### 이벤트 구독 및 알림
```js
/** 코드 내용 일부 발췌 **/
// 이벤트 구독하기
const onCPUUsageEvent = receiveChannel(channelEnum.CPU.USAGE);
onCPUUsageEvent(intervalUpdateCPU);

// 알림 주기
cpuInstance.notify('interval', this);
```
main Process에서 인터벌마다 실시간을 데이터를 수집하기 때문에 수집할때 마다 구독자에게 알림을 주는 형식을 취하여서
관련된 데이터에 대한 인터벌을 한곳에서 관리하였습니다.

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
unmount(onProcessEvent(processList.render.bind(processList)));
```
renderer Process에서 main Process에 이벤트 구독을 하여서 데이터를 얻는 방법을 취하여서
페이지가 변경 될시 기존의 이벤트를 끊어 줘야 했습니다.
이 로직들을 손쉽게 하기 위하여 unmount함수를 만들어서 어떤 로직이 이벤트가 걸리는건지 파악하기도 쉽고 따로 관리해줄필요 없이 알아서 해당 페이지가 없어질시 클리어 함수들이 실행되게 하였습니다.
만들고나서 보니 rust언어의 unsafe구문이 생각나는 로직이였습니다.

<br>

### Vanila JS로 SPA 만들기
```js
// ./lib/simpleDom.js
const template = curry((tag, value = "") => `<${tag}>${value}</${tag}>`);

const el = html => {
  const wrapper = document.createElement('div');
  wrapper.insertAdjacentHTML('afterbegin', html);

  return wrapper.children[0];
};

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
      <p>CPU CORE ${index + 1} usage <span class="cpu_text"></span></p>
      <div class="cpu_core item"></div>
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
D3객체를 활용하여 데이터를 바인딩하고, join 메소드를 사용하면 추가되는 데이터, 업데이트되는 데이터, 사라지는 데이터를 각각 한번에 컨트롤이 가능하였습니다. 이를 활용하여 원하는대로 커스텀을 용이하게 하였습니다.

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
그래서 이 규칙에 따라 간단한 함수들은 invoke형식을 건내주었고, 이벤트 구독방식은 on 함수를 만들어서 perload로 제공하고, renderer에서 이벤트 구독과 취소를 용이하게 할수있도록 하였습니다.
