
# vue-golden-layout

[![npm](https://img.shields.io/npm/v/vue-golden-layout.svg)](https://www.npmjs.com/package/vue-golden-layout)
[![NPM downloads](https://img.shields.io/npm/dm/vue-golden-layout.svg?style=flat)](https://npmjs.org/package/vue-golden-layout)
[![Known Vulnerabilities](https://snyk.io/test/github/emedware/vue-golden-layout/badge.svg)](https://snyk.io/test/github/emedware/vue-golden-layout)
[![codebeat badge](https://codebeat.co/badges/8fb41a11-58bd-4f6f-948b-5ac12ec59b5b)](https://codebeat.co/projects/github-com-eddow-vue-golden-layout-master)

[![Rate on Openbase](https://badges.openbase.io/js/rating/vue-golden-layout.svg)](https://openbase.io/js/vue-golden-layout?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)

Integration of the golden-layout to Vue

## Installation

```sh
npm i -S vue-golden-layout
```

### Fast example

```html
<golden-layout>
  <gl-row>
    <gl-component title="component1">
      <h1>Component 1</h1>
    </gl-component>
    <gl-stack>
      <gl-component title="component2">
        <h1>Component 2</h1>
      </gl-component>
      <gl-component title="component3">
        <h1>Component 3</h1>
      </gl-component>
    </gl-stack>
  </gl-row>
</golden-layout>
```

Note: each component who is not rendered in a stack will indeed be rendered in a golden-layout singleton stack.

### Bigger example

> Demo available [here](https://rawcdn.githack.com/emedware/vue-golden-layout/master/demo/dist/index.html)

A more complex exemple is in the project when git-cloned.
In order to test, the static sample application can be compiled like this:

```sh
npm install
npm run demo
```

You can now browse `http://localhost:9000`

The example can be found in the sources under the '/demo' folder

## Usage

```javascript
import vgl from 'vue-golden-layout'
Vue.use(vgl);
```

In case of incompatibility with bundlers, `vue-golden-layout` can be bundeled by the sources.
The sources entry point is in `vue-golden-layout/src/index.ts`

```javascript
import vgl from 'vue-golden-layout/src'
Vue.use(vgl);
```

### Don't forget in order to make it work

- Include a golden-layout theme CSS.

```typescript
import 'golden-layout/src/css/goldenlayout-light-theme.css'
```

Available themes are `light`, `dark`, `soda`, `translucent`.

`goldenlayout-base.css` is already integrated to the library.

## Structure

Elements like `<gl-row>`, `<gl-col>` and `<gl-stack>` can be represented in a tree - they respectively stand for a golden-layout row, column and stack.

### Components

Component are described *by extension* - namely, by giving their content using the data from the defining component.

```html
<gl-component>
    <h1>Heydoo</h1>
    Price: {{priceLess}}
</gl-component>
```

## Saving/restoring states

> TL;DR: The state is the model of the golden-layout object

The `golden-layout` has a *property* and an *event* named `state`.

- The event is triggered when the state has changed (even deeply, like a deep watch).
- The property is used [**at mount**](https://github.com/emedware/vue-golden-layout/issues/20#issuecomment-433828678) to initialise the configuration. After that, any change will have no effect.
- The `state` property can be a `Promise`, then the golden-layout will be rendered only when the `Promise` has been resolved.

Notes:

- The property `state` can be given minified or not
- The event `state` gives indeed the minified version of the config, and the expanded version as a second argument.
- It is also the `v-model` of the `golden-layout`
- In order to reload a state, the Vue object structure must corresp to the state it be applied to
  - If there is a miss-match between the Vue object structure and the state, the `golden-layout` object `creation-error` event will be raised

### Sub-object states

Every `<gl-... >` can have a `:state.sync` property (`Dictionary`) that will be saved along his other properties in the golden-layout state.
This is a good place for example for custom containers to store locally what is needed to be persisted.

## Components events and properties

### Events

#### Layout' events

Straight forwards from golden-layout, refer to their doc

```javascript
itemCreated
stackCreated
rowCreated
tabCreated
columnCreated
componentCreated
selectionChanged
windowOpened
windowClosed
itemDestroyed
initialised
activeContentItemChanged
```

#### Contained objects' events

Straight forwards from golden-layout, refer to their doc

```javascript
stateChanged
titleChanged
activeContentItemChanged
beforeItemDestroyed
itemDestroyed
itemCreated
```

#### Components' events

Straight forwards from golden-layout, refer to their doc

```javascript
open
destroy
close
tab
hide
show
resize
```

### Properties

#### Layout' properties

```typescript
@Prop({default: true}) hasHeaders: boolean
@Prop({default: true}) reorderEnabled: boolean
@Prop({default: false}) selectionEnabled: boolean
@Prop({default: true}) popoutWholeStack: boolean
@Prop({default: true}) closePopoutsOnUnload: boolean
@Prop({default: true}) showPopoutIcon: boolean
@Prop({default: true}) showMaximiseIcon: boolean
@Prop({default: true}) showCloseIcon: boolean
@Prop({default: 5}) borderWidth: number
@Prop({default: 10}) minItemHeight: number
@Prop({default: 10}) minItemWidth: number
@Prop({default: 20}) headerHeight: number
@Prop({default: 300}) dragProxyWidth: number
@Prop({default: 200}) dragProxyHeight: number
```

##### `popup-timeout`

(default: 5 = 5 seconds)

When the state change, an event is fired and provides the new state. Unfortunately, when something is poped-out, querying the state will raise an exception if the pop-out' golden-layout is not loaded. Hence, the first call to `GoldenLayout.toConfig()` will for sure raise an exception.

The policy chosen here is to then wait a bit and try again. In order to avoid infinite exception+try-again, a time-out is still specified.

Therefore:

- Changing this value to higher will not postpone the event fireing, it will just allow more time for the pop-out to load before raising an exception
- This can be useful to increase in applications where the main page has some long loading process before displaying the golden-layout

#### Contained objects' properties

- `title: string`: Used for tab title
- `tabId: string`: Used as the `v-model` of a `gl-stack` or `gl-dstack` to determine/set the active tab
- `width: number`
- `height: number`
- `closable: boolean`
- `reorderEnabled: boolean`
- `hidden: boolean`

#### Contained objects' methods

- `show()` and `hide()` respectively show and hide the element
- `focus()` brings the element in front recursively, making sure all tabs are right for them to be visible (also brings the window in front if needed)
- `delete()` delete the vue-object and the gl-object
- `nodePath` is the unique path to this node from the golden-layout root (can change).
 The golden-layout object has a method `getSubChild(path: string)` that returns this vue-object (useful between page reload)

#### Containers

Containers have an additional `color-group: boolean` property defaulted to `false`.
A container for which this property is set to `true` will see all his descendants have a color assigned to their tabs.

This is meant to be used when the same component can be used twice on different objects, to follow in the pop-outs which is the descendant of which.

Note: by default, routes that are `glCustomContainer` have a `color-group` set to `true`

## Specific components

Some components have been programmed as an extension, even if they are not part of golden-layout *proprio sensu*.

### gl-dstack

*Duplicatable stacks* are stacks that should always remain in the main window as their content is modified programatically. These stacks, when poped-out, *remain* in the main screen while their content is poped-out.
Components defined in it that are not `closable` nor `reorder-enabled` will *stay* in the stack in the main window.

### gl-router

The router is a `glContainer` that aims to sublimate the `<router-view />`
It lets users manage their routes in tabs, open them in a split screen or even popped-out in another browser window on another physical display.

The main usage is `<gl-router />`. Any options of `router-view` still has to be implemented.

Note: `gl-router` is a `gl-dstack`.

#### gl-router' slots

A default content to render all routes can be provided as the `route` slot template - with or without scope : if a scope is queried, it will be the route object.
If this content is provided, it should contain a `<main />` tag that will be filled with the loaded route component.

Note: the provided template will be ignored when maximised/popped-out.

All the components in the default slot will be added as tabs in the router.

#### gl-router' properties

##### `titler`

Allows to specify a function that takes a route object in parameter and gives the string that will be used as tab title.
If none is specified, the default is to take `$route.meta.title` - this means that routes have to be defined with a title in their meta-data.

##### `empty-route`

Specify the URL to use when the user closes all the tabs (`"/"` by default)

### gl-route

`gl-route`s are components displaying a route. They are meant to be used in a gl-router but only have to be used in a golden-layout container.

They can take a `name` and/or a `path`, and their `closable` and `reorder-enabled` properties are false by default. They can be forced a `title` but their container' `titler` will be used if not.

Note: all the elements inside them will have a `this.$route` pointing to the given route, not the actual URL.

## glCustomContainers

Users can define components who describe a part of the layout. In order to do this, instead of extending `Vue`, the component has to extend `glCustomContainer`.

```js
var comp = Vue.extend({...});
// becomes
var vgl = require('vue-golden-layout')
var comp = vgl.glCustomContainer.extend({...});
```

```ts
@Component
export class MyComp extends Vue {
  ...
}
// becomes
import { glCustomContainer } from 'vue-golden-layout'

@Component
export class MyComp extends glCustomContainer {
  ...
}
```

The template' root must therefore be a proper golden-layout child (row, col, stack, ...)

These components can be used as route components.

## Low-level functionalities

### Global components

Some golden-layout global component can be given before any instanciation (while declaring classes) by calling this function:

```typescript
import { registerGlobalComponent } from 'vue-golden-layout'
// registerGlobalComponent(name: string, comp: (gl: goldenLayout, container: any, state: any)=> void)
```

`(container: any, state: any)=> void` is the signature of a gloden-layout component and they are created per golden-layout instances

### `isSubWindow`

```typescript
import { isSubWindow } from 'vue-golden-layout'
```

The main application component will be created in any pop-out that is opened. The `<golden-layout>` node will generate an empty HTML content, so nothing in it will be rendered. Though, if needed, this value is `true` when the component is generated in a pop-out which indicate that the component won't even be rendered and should take no action.

### CSS

The elements with the `glComponent` CSS class are the ones directly included in the `<div>` controlled and sized by golden-layout and answers to this class to fit in the layout child container, that can be overridden

```css
.glComponent {
    width: 100%;
    height: 100%;
    overflow: auto;
}
```

### Objects linking

Golden-layout and Vue both have objects representing their internal state. A `glRow` is associated with a `ContentItem`.

Each vue object has a `glObject` property and, vice versa, each golden-layout object has a `vueObject` property linking to each another.

#### Virtual vs actual tree

Vue objects (rows, components, stacks, ...) all have a `$parent` that retrieve their Vue' parent. Also their children might be retrieved with `$children`.

Though, the user might change the order of things and who contain what. To retrieve the golden-layout-wise hierarchy, we can use `glParent` as well as `glChildren` on the vue objects to retrieve vue objects.
