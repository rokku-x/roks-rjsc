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

 Loading provider and hook:

 ```tsx
 import React from 'react';
 import { LoadingProvider, useLoading } from '@rokku-x/roks-rjsc/loading';

 function Example() {
	 const { startLoading, stopLoading, asyncUseLoading } = useLoading();

	 const handle = async () => {
		 startLoading();
		 await new Promise(r => setTimeout(r, 1000));
		 stopLoading();
	 }

	 return <button onClick={handle}>Load</button>
 }

 export default function AppWrapper() {
	 return (
		 <LoadingProvider>
			 <Example />
		 </LoadingProvider>
	 )
 }
 ```

 Modal helpers (BaseModalProvider + hooks):

 ```tsx
 import React from 'react';
 import { BaseModalProvider, useStaticModal, useDynamicModal } from '@rokku-x/roks-rjsc/modal';

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
		<BaseModalProvider>
			<StaticExample />
			<DynamicExample />
		</BaseModalProvider>
	 )
 }
 ```

API (top-level exports)
 - `LoadingProvider`, `useLoading`, `Loading`, `AnimationType` - loading utilities (available via `@rokku-x/roks-rjsc/loading`)
 - `BaseModalProvider`, `useBaseModal`, `useStaticModal`, `useDynamicModal`, `RenderMode` - modal system (available via `@rokku-x/roks-rjsc/modal`)

Subpath imports
- `@rokku-x/roks-rjsc/modal`: exports `BaseModalProvider`, `useBaseModal`, `useStaticModal`, `useDynamicModal`, `RenderMode`
- `@rokku-x/roks-rjsc/loading`: exports `LoadingProvider`, `useLoading`, `Loading`, `AnimationType`

## Props & API Reference

### LoadingProvider props

| Prop | Type | Description |
|---|---|---|
| `id` | `string?` | Optional id for the provider wrapper |
| `children` | `ReactNode  null` | Provider children |
| `loadingComponent` | `React.ComponentType  React.ReactElement?` | Custom loading element |
| `animationType` | `AnimationType?` | One of `Spin  FadeInOut  None` |
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
| `isLoading` | `boolean` | Global loading state |
| `isLocalLoading` | `boolean` | Local hook instance loading state |
| `loadingEventTarget` | `EventEmitter` | Event emitter for `change  start  stop` events |
| `overrideLoading` | `(state: boolean  null) => void` | Force override loading state |
| `startLoading` | `() => void` | Increment/start loading |
| `stopLoading` | `() => void` | Decrement/stop loading |

### Modal Provider props

| Prop | Type | Description |
|---|---|---|
| `children` | `React.ReactNode` | Content |
| `wrapperId` | `string?` | Optional wrapper id |
| `renderMode` | `RenderMode?` | `STACKED  CURRENT_ONLY  CURRENT_HIDDEN_STACK` |
| `wrapperStyle` | `React.CSSProperties?` | Wrapper style |

### BaseModalProvider API (`useBaseModal()`)

| Name | Type / Signature | Description |
|---|---|---|
| `modalCount` | `number` | Number of open modals |
| `renderMode` | `RenderMode?` | Current render mode |
| `currentModalId` | `string?` | ID of current modal |
| `pushModal` | `(el: React.ReactNode, modalId?: string, isDynamic?: boolean) => string` | Push modal and receive id |
| `popModal` | `(idEl: string  React.ReactNode) => boolean` | Pop modal by id or element |
| `updateModalContent` | `(modalId: string, newContent: React.ReactNode) => void` | Replace modal content |
| `getModalWindowRef` | `(modalId: string) => HTMLDivElement  undefined` | Access modal DOM |
| `focusModal` | `(modalId: string) => boolean` | Bring modal to front |
| `getModalOrderIndex` | `(modalId: string) => number` | Get stacking order index |

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



 ## License

 MIT