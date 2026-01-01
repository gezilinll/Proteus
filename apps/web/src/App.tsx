import { useState } from 'react';
import { Editor } from '@proteus/core';
import {
  EditorLayout,
  TopBar,
  ToolPanel,
  CanvasArea,
} from './components';

function App() {
  const [editor] = useState(() => new Editor());

  return (
    <EditorLayout
      topBar={<TopBar editor={editor} />}
      leftPanel={<ToolPanel editor={editor} />}
      canvas={<CanvasArea editor={editor} />}
    />
  );
}

export default App;
