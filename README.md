# Hyperons

[![Build Status](https://travis-ci.org/i-like-robots/hyperons.svg?branch=master)](https://travis-ci.org/i-like-robots/hyperons) [![Coverage Status](https://coveralls.io/repos/github/i-like-robots/hyperons/badge.svg?branch=master)](https://coveralls.io/github/i-like-robots/hyperons) [![npm version](https://badge.fury.io/js/hyperons.svg)](https://badge.fury.io/js/hyperons)

Renders components written in JSX to HTML without a framework, on the server or in the browser.

## Installation

This is a [Node.js][node] module available through the [npm][npm] registry. Before installing, download and install Node.js. Node.js 6 or higher is required.

Installation is done using the [npm install][install] command:

```sh
$ npm install -S hyperons
```

[node]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[install]: https://docs.npmjs.com/getting-started/installing-npm-packages-locally

## Features

* Share code between your React single-page apps and plain HTML pages
* Balances speed, code complexity, and correctness of output
* Render your components on the server and in the browser
* Very small code size (1.25kb gzipped)
* Support for CSS stringification, boolean attributes, void elements, and more

## Usage

This module provides two functions; `h` and `render`. If you've worked with [React][react] before then `h` can be considered equivalent to `React.createElement` and `render` equivalent to `ReactDOM.render` (in the browser) or `ReactDOM.renderToString` (on the server).

The major difference between Hyperon's `h` function and React's `createElement` is that instead of returning a framework specific representation of the element (the [virtual DOM][vdom]) it creates and returns a string object (_[what is this?](#string-safety)_).

```js
import { h } from 'hyperons'

h(element, [properties], [...children])
```

Just like `React.createElement` it accepts the following arguments:

* `element` This can be the name of a HTML element or a function which renders another string of HTML (this is useful if you'd like to use [higher-order components][hoc].)
* `properties` An optional object of HTML element attributes. See the [properties documentation](#properties) for more information.
* `...children` An optional number of child elements. See the [children documentation](#children) for more information. The `...` before the argument name makes this a [rest parameter][rest], this means it will collect "the rest" of the arguments.

```js
import { render } from 'hyperons'

render(string)
```

This method converts a string object returned by Hyperon's `h` method into a regular string primitive. If you're not sure what this means, there is an [explanation below](#string-safety).

[react]: https://reactjs.org/
[vdom]: https://evilmartians.com/chronicles/optimizing-react-virtual-dom-explained
[hoc]: https://reactjs.org/docs/higher-order-components.html
[rest]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters

### Vanilla JS

You can use Hyperons as-is without any complex build pipelines or compilation steps, but I'd recommend using [JSX](#jsx) to more clearly describe your markup.

```js
import { h, render } from 'hyperons'

function welcome () {
  return h('div', { className: 'welcome' },
    h('h1', null, 'Hello World!'),
    h('p', null, 'This component was rendered with Hyperons'))
}

render(welcome())
```

### JSX

_Not familiar with JSX? Check out [WTF is JSX][wtf] and [JSX in Depth][in-depth] first._

If you're authoring your components with JSX syntax you will need to transpile your code into plain JavaScript in order to run them. Depending on the toolchain you are using there will be different plugins available to do this, some popular tools to transpile JavaScript are [Babel][babel] (with [the JSX plugin][babel-jsx]) and [Bublé][buble] (with [JSX enabled][buble-jsx]).

Whichever tool you use you will need to specify the JSX _pragma_ for the transpiler to target. The pragma is the name of the variable you assign Hyperons to. For example, in the code below the pragma is `h`:

```jsx
import { h, render } from 'hyperons'

function welcome () {
  return (
    <div className="welcome">
      <h1>Hello World!</h1>
      <p>This component was rendered with Hyperons</p>
    </div>
  )
}

render(welcome())
```

[wtf]: https://jasonformat.com/wtf-is-jsx/
[in-depth]: https://reactjs.org/docs/jsx-in-depth.html
[babel]: https://babeljs.io/
[babel-jsx]: https://babeljs.io/docs/plugins/transform-react-jsx/
[buble]: https://github.com/Rich-Harris/buble
[buble-jsx]: https://buble.surge.sh/guide/#jsx

## Overview

### Properties

Properties are an object containing [HTML attributes][attrs] and values. Attribute names may be written in camelCase or in lowercase. For example, the attribute `tabindex` may be written as `tabIndex`. Any HTML attributes written in camelCase will be converted to lowercase but they will not be hyphenated. Attributes requiring hyphens, such as `aria-*` and `data-*`, should be written with hyphens.

Since `class` and `for` are [reserved words][words] in JavaScript you may use the aliases `className` and `htmlFor` instead.

Boolean attributes, such as `hidden` or `checked`, will only be rendered if assigned a truthy value. Enumerated attributes which accept the values `"true"` or `"false"`, such as `contenteditable`, will be rendered with their assigned value.

Any framework specific properties such as `key` and `ref` will not be rendered.

[attrs]: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
[words]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Keywords

### Styles

The `style` attribute accepts a JavaScript object containing CSS properties and values.

Style properties may be camelCased in order to be consistent with accessing the properties on DOM nodes from JS (e.g. `element.style.marginBottom`). Vendor prefixes other than "ms" should begin with a capital letter. This is why `WebkitHyphens` has an uppercase "W".

Hyperons will automatically append a `px` suffix to numbers, but certain properties will remain unitless (e.g. `z-index` or `order`). If you want to use units other than `px`, you should specify the value as a string with the desired unit. For example:

```jsx
// Input:
const styles = {
  position: 'absolute',
  display: 'flex',
  order: 2,
  width: '50%',
  marginBottom: 20,
  WebkitHyphens: 'auto',
}

<div style={styles}></div>

// Output:
<div style="display:flex;order:2;width:50%;margin-bottom:20px;-webkit-hyphens:auto;></div>
```

### HTML entities

Hyperons will escape all strings, so if you need to display a HTML entity, you will run into double escaping issues. There are various ways to work-around this issue, the easiest of which is to write the unicode character directly in your code (you will need to save your source file with UTF-8 encoding) or you can find the [unicode number][charcode] for the required character:

```jsx
// incorrect, double escapes ambersand: <h1>Mac &amp;amp; Cheese</h1>
<h1>Mac &amp; Cheese</h1>
// correct, outputs: <h1>Mac &amp; Cheese</h1>
<h1>Mac & Cheese</h1>
// correct, outputs: <h1>Mac &amp; Cheese</h1>
<h1>{`Mac ${String.fromCharCode(38)} Cheese`}</h1>
```

[charcode]: https://www.fileformat.info/info/charset/UTF-8/list.htm

### Children

Components may render any number of child elements. Children can be strings, other components, or a combination of both.

Functions provided to the first argument of Hyperons will have any children appended as an extra `children` property. This functionality allows you to re-use and compose components in useful ways.

Please note that child elements will not be rendered for [void elements][void].

```jsx
const Container = ({ children }) => <p>{children}</p>
const html = <Container>{'Hello'}</Container> // will output <p>Hello</p>
```

[void]: https://www.w3.org/TR/html/syntax.html#void-elements

### Inner HTML

Hyperons supports the `dangerouslySetInnerHTML` property to inject unescaped HTML code. This is potentially dangerous and should never be used around any user input, but it can be useful as a last resort.

```jsx
const html = { __html: '<i>Mac &amp; Cheese</i>' }
<div dangerouslySetInnerHTML={html}></div>
```

### String safety

Hyperons escapes all strings passed to it but because JavaScript will process the deepest child elements _first_, the module needs a way to recognise what it has already output so that it doesn't escape it again. To do this the `h` method returns a string object (`new String()`) flagged as safe rather than a string primitive (`''` or `""`) which cannot have extra information added to it.

String objects can be used just like a string primitive, but there is one important difference which can affect decisions made in your code:

```js
typeof new String() // "object"
typeof ''           // "string"
```

There are many ways to change a string object into a string primitive, but the fastest ways are to use the `.toString()` method or the `render` function provided by Hyperons:

```js
import { h, render } from 'hyperons'

typeof h('div') // "object"
typeof '' + h('div') // "string"
typeof String(h('div')) // "string
typeof h('div').toString() // "string" <- the fastest!
typeof render(h('div')) // "string" <- also the fastest!
```

## Project information

### Development

The source code for this module is written in ES6 code and bundled into single files for distribution using [Rollup][rollup]. Tests are written using [Mocha][mocha] as the test runner and [Chai][chai] for assertions. Tests are run in both a Node.js environment and in a browser using [Puppeteer][puppeteer].

[rollup]: https://rollupjs.org/guide/en
[mocha]: https://mochajs.org/
[chai]: http://www.chaijs.com/
[puppeteer]: https://github.com/GoogleChrome/puppeteer

### Name

> In particle physics, a hyperon is any baryon containing one or more strange quarks, but no charm

— [Wikipedia](https://simple.wikipedia.org/wiki/Hyperon)

In keeping with React and the wider ecosystem we wanted to give this project a science-related name but also something that implies being small and light. Thus, Hyperons.

### Prior art

This module was inspired by the [vhtml][vhtml] package and also borrows from a few other JSX to string implementations:

* [Hyperapp Render][hyperapp] (style stringification)
* [React DOM][react-dom] (boolean attributes)

[vhtml]: https://github.com/developit/vhtml
[hyperapp]: https://github.com/hyperapp/render
[react-dom]: https://github.com/facebook/react/tree/master/packages/react-dom

### License

Hyperons is MIT licensed.
