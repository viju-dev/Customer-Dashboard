import React from 'react';
import CustomerTable from './components/CustomerTable';

const App = () => {
  return (
    <div style={{ padding: '20px',backgroundColor:'cadetblue'}}>
      {/* #1f2328 */}
      <h1 style={{ textAlign: 'center' ,color:'white'}}>Customer Dashboard</h1>
      {/* Render the CustomerTable Component */}
      <CustomerTable />
    </div>
  );
};

export default App;
