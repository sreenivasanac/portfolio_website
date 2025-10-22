import FaceTracker from './components/FaceTracker';

function Header() {
  return (
    <header style={{ 
      height: '400px', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ width: '300px', height: '300px' }}>
        <FaceTracker 
          basePath="/faces/"
          showDebug={process.env.NODE_ENV === 'development'}
        />
      </div>
    </header>
  );
}