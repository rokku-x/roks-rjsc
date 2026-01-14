# roks-rjsc

A small React component library exposing a few UI helpers and modal/loading utilities.

## Installation

Install from npm (after publishing):

```bash
npm install @rokku-x/roks-rjsc
```

During development you can also install directly from GitHub:

```bash
npm install github:rokku-x/roks-rjsc
```

## Usage

Import named exports from the package root. Examples below assume React 18.

Core components:

```tsx
import React from 'react';
import { /* core exports */ } from '@rokku-x/roks-rjsc';

export default function App() {
	return <div>Your app root</div>;
}
```

### Quick Start

Mount renderers once near your app root and use the hooks anywhere:

```tsx
import React, { useState } from 'react';
import BaseModalRenderer from '@rokku-x/roks-rjsc/components/BaseModalRenderer';
import { LoadingRenderer, useLoading } from '@rokku-x/roks-rjsc/loading';
import { useStaticModal } from '@rokku-x/roks-rjsc/modal';

function Demo() {
	const { asyncUseLoading } = useLoading();
	const [showStatic, closeStatic] = useStaticModal('qs');

	const handleAsync = async () => {
		await asyncUseLoading(new Promise(res => setTimeout(res, 2000)));
	};

	return (
		<div>
			<button onClick={handleAsync}>Async Use Loading (2s)</button>
			<button onClick={() => showStatic(<div>Static modal content</div>)}>Open Static Modal</button>
		</div>
	);
}

export default function App() {
	return (
		<>
			<Demo />
			<BaseModalRenderer />
			<LoadingRenderer />
		</>
	);
}
```

Loading renderer and hook (Zustand):

```tsx
import React from 'react';
import { LoadingRenderer, useLoading } from '@rokku-x/roks-rjsc/loading';

function Example() {
	const { startLoading, stopLoading, asyncUseLoading, overrideLoading } = useLoading();

	const handle = async () => {
		startLoading();
		await new Promise(r => setTimeout(r, 1000));
		stopLoading();
	}

	return <button onClick={handle}>Load</button>
}

export default function App() {
	return (
		<>
			<Example />
			{/* Render once near app root */}
			<LoadingRenderer />
		</>
	)
}
```

Modal helpers (Zustand + BaseModalRenderer):

```tsx
import React from 'react';
import { useStaticModal, useDynamicModal } from '@rokku-x/roks-rjsc/modal';
import BaseModalRenderer from '@rokku-x/roks-rjsc/components/BaseModalRenderer';

function StaticExample() {
	const [show, close, id] = useStaticModal();

	return (
		<>
			<button onClick={() => show(<div>Static content</div>)}>Open static modal</button>
		</>
	)
}

function DynamicExample() {
	const [render, show, close, focus] = useDynamicModal();

	return (
		<>
			<button onClick={() => show()}>Open dynamic modal</button>
			{render(<div>Rendered into dynamic modal</div>)}
		</>
	)
}

export default function App() {
	return (
		<>
			<StaticExample />
			<DynamicExample />
			{/* Render once near app root */}
			<BaseModalRenderer />
		</>
	)
}
```

API (top-level exports)
- `LoadingRenderer`, `useLoading`, `Loading`, `AnimationType`, `loadingEventTarget` - loading utilities (available via `@rokku-x/roks-rjsc/loading`)
- `BaseModalRenderer`, `useBaseModal`, `useStaticModal`, `useDynamicModal`, `RenderMode` - modal system (available via `@rokku-x/roks-rjsc/modal`)

Subpath imports
- `@rokku-x/roks-rjsc/modal`: exports `BaseModalRenderer`, `useBaseModal`, `useStaticModal`, `useDynamicModal`, `RenderMode`
- `@rokku-x/roks-rjsc/loading`: exports `LoadingRenderer`, `useLoading`, `Loading`, `AnimationType`, `loadingEventTarget`

## Props & API Reference

### LoadingRenderer props

| Prop | Type | Description |
|---|---|---|
| `id` | `string?` | Optional id for the loading dialog wrapper |
| `children` | `ReactNode \| null` | Children are not typically required |
| `loadingComponent` | `React.ComponentType \| React.ReactElement?` | Custom loading element |
| `animationType` | `AnimationType?` | One of `Spin \| FadeInOut \| None` |
| `animationDuration` | `number?` | Seconds for animation duration |
| `wrapperStyle` | `React.CSSProperties?` | Style for wrapper element |
| `wrapperClassName` | `string?` | Class name for wrapper |
| `wrapperId` | `string?` | ID for wrapper |
| `animationWrapperStyle` | `React.CSSProperties?` | Style for animation wrapper |
| `animationWrapperClassName` | `string?` | Class name for animation wrapper |
| `animationWrapperId` | `string?` | ID for animation wrapper |

### Loading API (`useLoading()`)

| Name | Type / Signature | Description |
|---|---|---|
| `asyncUseLoading` | `<R>(asyncFunction: Promise<R>) => Promise<R>` | Run async function while toggling loading |
| `isLoading` | `boolean` | Global loading state (derived) |
| `isLocalLoading` | `boolean` | Local hook instance loading state |
| `loadingEventTarget` | `EventEmitter` | Event emitter for `change \| start \| stop` events |
| `overrideLoading` | `(state: boolean \| null) => void` | Force override loading state |
| `startLoading` | `() => void` | Increment/start loading |
| `stopLoading` | `() => void` | Decrement/stop loading |

### BaseModalRenderer props

| Prop | Type | Description |
|---|---|---|
| `id` | `string?` | Optional wrapper id |
| `renderMode` | `RenderMode?` | `STACKED \| CURRENT_ONLY \| CURRENT_HIDDEN_STACK` |
| `style` | `React.CSSProperties?` | Dialog style |

### BaseModal store API (`useBaseModal()`)

| Name | Type / Signature | Description |
|---|---|---|
| `currentModalId` | `string?` | ID of current modal |
| `actions.pushModal` | `(modalId?: string, el: React.ReactNode, isDynamic?: boolean) => string` | Push modal and receive id |
| `actions.popModal` | `(modalId: string) => boolean` | Pop modal by id |
| `actions.updateModal` | `(modalId: string, newContent: React.ReactNode) => boolean` | Replace dynamic modal content |
| `actions.getModalWindowRef` | `(modalId: string) => HTMLDivElement \| undefined` | Access modal DOM |
| `actions.focusModal` | `(modalId: string) => boolean` | Bring modal to front |
| `actions.getModalOrderIndex` | `(modalId: string) => number` | Get stacking order index |

### `useStaticModal(id?: string)`

Returns a tuple: `[show(el) => closeFn, closeFn, id, isForeground, updateContent(newContent)]`

| Position | Meaning |
|---|---|
| `show(el)` | Mounts static content and returns a close function |
| `closeFn` | Closes the modal |
| `id` | Modal id string |
| `isForeground` | `boolean` — whether the modal is top-most |
| `updateContent` | `(newContent: React.ReactNode) => void` — Replace content |

### `useDynamicModal(id?: string)`

Returns a tuple: `[render(el) => ReactNode, show(), close(), focus(), id, isForeground]`

| Position | Meaning |
|---|---|
| `render(el)` | Supplies content to the dynamic modal container |
| `show()` | Opens the modal |
| `close()` | Closes the modal |
| `focus()` | Brings the modal to front |
| `id` | Modal id string |
| `isForeground` | `boolean` — whether the modal is top-most |


## Demo & Testing Notes

- The dev app includes quick demo buttons in `src/main.tsx`:
	- Loading: "Start Loading (2s)", "Async Use Loading (3s)", and a single-button component test that enables the `Loading` component for 2 seconds.
	- Modals: buttons to open static and dynamic modals; `BaseModalRenderer` must be rendered once near the root.
- When testing in jsdom (Vitest), dialog methods are mocked in tests via `HTMLDialogElement.prototype.showModal/close`.



## License

MIT