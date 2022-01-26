import {Alert, Button, Form, Modal} from 'react-bootstrap';
import {addItem, deleteItem, loadItems, resetItems} from '../store';
import {useDispatch, useSelector} from 'react-redux';
import {useState} from 'react';
import moment from 'moment';

export default function Table() {
    const days = 7;
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [registration, setRegistration] = useState('');
    const [activity, setActivity] = useState('');
    const items = useSelector((state) => state.userList)

    const handleClose = () => {
        if (!(registration && activity)) return alert('Please select both dates')
        if (!moment(registration).isValid()) return alert('Invalid registration date')
        if (!moment(activity).isValid()) return alert('Invalid activity date')
        dispatch(addItem({registration, activity}))
        setShow(false);
    }

    const randDate = () => {
        const rnd = Math.floor(Math.random() * (100)) + 1;
        const rnd2 = Math.floor(Math.random() * (100)) + 1;
        let r1, r2;
        if (rnd2 < rnd) {
            r1 = rnd;
            r2 = rnd2
        } else {
            r2 = rnd;
            r1 = rnd2
        }
        setRegistration(moment().add(-r1, 'days').format('YYYY-MM-DD'))
        setActivity(moment().add(-r2, 'days').format('YYYY-MM-DD'))
    }
    const handleShow = () => {
        setRegistration('');
        setActivity('');
        setShow(true);
    }

    useState(() => {
        dispatch(loadItems())
    })

    function retentionCalculate() {
        let returned = 0;
        let newbies = 0;
        for (const item of items) {
            if (item.lifeDays <= days) returned++;
            if (item.registeredDays >= days) newbies++;
        }
        if (newbies)
            return (returned / newbies * 100).toFixed(2);
        else return 0
    }

    return <div>
        <hr/>
        <div className="d-flex align-items-baseline justify-content-between">
            <div>
                <Button variant="primary" onClick={handleShow}>
                    Add user
                </Button>
            </div>
            <Alert>
                Rolling Retention {days} days: <strong>{retentionCalculate()}</strong>
            </Alert>
        </div>
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
                    <Button variant="danger" size="sm" onClick={() => dispatch(deleteItem(item))}>Delete</Button>
                </td>
            </tr>)}
            </tbody>
        </table>
        <Button size="sz" variant="secondary" onClick={() => dispatch(resetItems())}>reset data</Button>

        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Registration date</Form.Label>
                        <Form.Control defaultValue={registration} onChange={({target}) => setRegistration(target.value)} type="calendar"
                                      placeholder="YYYY-MM-DD"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>Last activity date</Form.Label>
                        <Form.Control defaultValue={activity} onChange={({target}) => setActivity(target.value)} type="calendar" placeholder="YYYY-MM-DD"/>
                    </Form.Group>
                    <Button onClick={randDate}>Random</Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
}
