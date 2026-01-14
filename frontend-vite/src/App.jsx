// App.js

import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="app__header">
        <div className="app__logo">
          <div className="app__logo-icon">⚡</div>
          <span className="app__logo-text">Pipeline Builder</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="app__main">
        <PipelineToolbar />
        <PipelineUI />
      </main>

      {/* Footer with Submit */}
      <SubmitButton />
    </div>
  );
}

export default App;
