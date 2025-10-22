import FaceTracker from './components/FaceTracker';

function App() {
  return (
    <div className="App">
      <h1>My Portfolio</h1>
      
      {/* Basic usage */}
      <FaceTracker />
      
      {/* With custom styling */}
      <FaceTracker 
        className="my-custom-class"
        basePath="/faces/"
      />
    </div>
  );
}