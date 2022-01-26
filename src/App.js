import './app.sass';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {useState} from 'react';
import {loadDb, addUser} from './mock'
import {Modal, Button, Form} from 'react-bootstrap';
import moment from 'moment';

function App() {
    const [items, setItems] = useState([])
    const [show, setShow] = useState(false);
    const [registration, setRegistration] = useState('');
    const [activity, setActivity] = useState('');
    const handleClose = () => {
        if(!(registration && activity)) return alert('Please select both dates')
        if(!moment(registration).isValid()) return alert('Invalid registration date')
        if(!moment(activity).isValid()) return alert('Invalid activity date')
        setItems(addUser({registration, activity}))
        setShow(false);
    }
    const randDate = () =>{
        const rnd = Math.floor(Math.random() * (100)) + 1;
        const rnd2 = Math.floor(Math.random() * (100)) + 1;
        let r1, r2;
        if(rnd2 < rnd) {
            r1 = rnd;
            r2 = rnd2
        }else{
            r2 = rnd;
            r1 = rnd2
        }
        console.log(r1, r2, moment().add(-r1, 'days').format('YYYY-MM-DD'))
        setRegistration(moment().add(-r1, 'days').format('YYYY-MM-DD'))
        setActivity(moment().add(-r2, 'days').format('YYYY-MM-DD'))
    }
    const handleShow = () => {
        setRegistration('');
        setActivity('');
        setShow(true);
    }

    useState(() => {
        setItems(loadDb())
    })

    return (
        <div className="App">
            <Button variant="primary" onClick={handleShow}>
                Add user
            </Button>
            <table>
                <thead>
                <tr>
                    <th>UserId</th>
                    <th>Registration date</th>
                    <th>Last activity date</th>
                </tr>
                </thead>
                <tbody>
                {items.map(item => <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.registration}</td>
                    <td>{item.activity}</td>
                    <td>{item.lifeDays}</td>
                    <td>{item.registeredDays}</td>
                    <td>
                        <b-button variant="danger" size="sm">Delete</b-button>
                    </td>
                </tr>)}
                </tbody>
            </table>
            <Modal show={show} onHide={()=>setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Registration date</Form.Label>
                            <Form.Control defaultValue={registration} onChange={({target}) => setRegistration(target.value)} type="calendar" placeholder="YYYY-MM-DD"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <Form.Label>Registration date</Form.Label>
                            <Form.Control defaultValue={activity} onChange={({target}) => setActivity(target.value)} type="calendar" placeholder="YYYY-MM-DD"/>
                        </Form.Group>
                        <Button onClick={randDate}>Random</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default App;
