 # roks-rjsc

 A small React component library exposing a few UI helpers and modal/loading utilities.

 ## Installation

 Install from npm (after publishing):

 ```bash
 npm install roks-rjsc
 ```

 During development you can also install directly from GitHub:

 ```bash
 npm install github:rokku-x/roks-rjsc
 ```

 ## Usage

 Import named exports from the package root. Examples below assume React 18.

 Basic component:

 ```tsx
 import React from 'react';
 import { Button } from 'roks-rjsc';

 export default function App() {
	 return <Button onClick={() => alert('clicked')}>Click me</Button>;
 }
 ```

 Loading provider and hook:

 ```tsx
 import React from 'react';
 import { LoadingProvider, useLoading } from 'roks-rjsc';

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
 import { BaseModalProvider, useStaticModal, useDynamicModal } from 'roks-rjsc';

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
 - `Button` - basic button component
 - `LoadingProvider`, `useLoading`, `Loading`, `AnimationType` - loading utilities
 - `BaseModalProvider`, `useBaseModal`, `useStaticModal`, `useDynamicModal`, `RenderMode` - modal system

 ## License

 MIT