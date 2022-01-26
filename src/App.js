import './app.sass';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Table from './components/Table';
import Chart from './components/Chart';

function App() {
    return (
        <div className="container">
            <h1>User activity calculation</h1>
            <Chart/>
            <Table/>
        </div>
    );
}

export default App;
