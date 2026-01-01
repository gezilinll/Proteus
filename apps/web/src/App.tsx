import { useState, useCallback } from 'react';
import { Editor } from '@proteus/core';
import {
  EditorLayout,
  TopBar,
  ToolPanel,
  CanvasArea,
} from './components';

function App() {
  const [editor] = useState(() => new Editor());
  const [, forceUpdate] = useState({});

  // 触发 UI 更新
  const refreshUI = useCallback(() => {
    forceUpdate({});
  }, []);

  return (
    <EditorLayout
      topBar={<TopBar editor={editor} />}
      leftPanel={<ToolPanel editor={editor} />}
      canvas={<CanvasArea editor={editor} />}
    />
  );
}

export default App;
