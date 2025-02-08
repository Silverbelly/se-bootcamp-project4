import axios from 'axios';
// import './App.css';

function App() {

  const getData = async () => {
    try {
      axios.get('http://localhost:3000')
        .then((data) => {
          console.log(data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={getData}>Get Data from Server</button>
      </header>
    </div>
  );
}

export default App;
