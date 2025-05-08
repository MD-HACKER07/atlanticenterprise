// Extremely basic component with no dependencies
function FallbackPage() {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        color: '#1e40af',
        fontSize: '24px',
        marginBottom: '16px'
      }}>
        ATLANTIC ENTERPRISE
      </h1>
      
      <p style={{
        color: '#3b82f6',
        fontSize: '18px',
        marginBottom: '24px'
      }}>
        Building the Future with Innovation and Quality
      </p>
      
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{ marginBottom: '16px' }}>
          This is a basic fallback page with plain HTML and inline styles.
        </p>
        <p>
          If you can see this content, then basic React rendering works.
        </p>
      </div>
    </div>
  );
}

export default FallbackPage; 