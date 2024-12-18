import { useState } from "react";
import { Alert, Button, Col, Collapse, Container, Form, Row, Table } from "react-bootstrap";
import ResponsiveAppBar from "../Layout/Header";
import styles from "./AddPassengers.module.css";
import { X } from "lucide-react";

const AddPassengers = ({ goBackHandler, bookingInfo }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [food, setFood] = useState("");
  const [entries, setEntries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const url = "https://irctc-notifier-backend.onrender.com"
  const accessToken = localStorage.getItem("token")
  const handleAdd = (event) => {
    event.preventDefault();
    if (name && age && sex) {
      const newEntry = { name, age, sex, food };
      console.log(newEntry);
      setEntries([...entries, newEntry]);
      // Reset input fields
      setName("");
      setAge("");
      setSex("");
      setFood("");
    }
  };

  const handleDelete = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  async function scheduleHandler(event) {
    event.preventDefault();
    const {
      fromStation,
      toStation,
      scheduleTime,
      journey_date,
      trainName,
      ...restOfBookingInfo
    } = bookingInfo;

    const postData = {
      scheduletime: bookingInfo.scheduleTime,
      // scheduletime: "2024-11-05T14:12:00+05:30",
      bookingparams: {
        ...restOfBookingInfo,
        passengers: entries,
        journey_date: journey_date.replace(/-/g, ""),
      },
    };
    console.log(postData);

    try {
      const response = await fetch(
        `${url}/api/trains/notify`,
        {
          method: "POST",
          body: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
        }
      );
      const resData = await response.json();
      if (!response.ok) {
        setErrorMessage(resData.msg);
        setShowError(true);  // Show the error message div
        console.log("In rest" +showError);
      } else {
        setErrorMessage("");
        setShowError(false); // Hide the error message div on success
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      setShowError(true); // Show the error message div on API failure
    }
  }

  const handleDismissError = () => {
    setShowError(false); // Close the error alert
    setErrorMessage(""); // Clear the error message to avoid stale state

    console.log(showError);
  };

  return (
    <Container className={styles.formContainer}>
      <h2 className={styles.heading}>Add Passengers Details</h2>
      <Form onSubmit={handleAdd} className={styles.form}>
        <Row>
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridAge">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridSex">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            >
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          {/* <Form.Group as={Col} controlId="formGridFood">

          <Form.Label>Food</Form.Label>
            <Form.Select
              aria-label="Food"
              value={food}
              onChange={(e) => setFood(e.target.value)}
            >
              <option value="">Select</option>
              <option value="V">Vegetarian</option>
              <option value="N">Mangalore</option>
            </Form.Select>

             <Form.Label>Food</Form.Label>
            <Form.Control
              placeholder="Food"
              value={food}
              onChange={(e) => setFood(e.target.value)}
            /> 
          </Form.Group> */}

          <Form.Group as={Col} controlId="formGridAddButton">
            <Form.Label>&nbsp;</Form.Label>
            <Button variant="dark" onClick={handleAdd} className="w-100">
              Add Passenger
            </Button>
          </Form.Group>
        </Row>
      </Form>

      {entries.length > 0 && (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              {/* <th>Food</th> */}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.name}</td>
                <td>{entry.age}</td>
                <td>{entry.sex}</td>
                {/* <td>{entry.food}</td> */}
                <td className={styles.tableCell}>
                  <Button
                    variant="danger"
                    className={styles.tightButton}
                    onClick={() => handleDelete(index)}
                  >
                    <X size={15} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Collapsible error message */}
      <Collapse in={showError}>
        <div style={{ marginTop: "20px" }}>
          <Alert
            variant="danger"
            onClose={handleDismissError} 
            dismissible
          >
            {errorMessage}
          </Alert>
        </div>
      </Collapse>

      <Form onSubmit={handleAdd} className={styles.form}>
        <Row>
          <Form.Group as={Col} controlId="formGridAddButton">
            <Form.Label>&nbsp;</Form.Label>
            <Button
              variant="secondary"
              onClick={goBackHandler}
              className="w-100"
            >
              Back
            </Button>
          </Form.Group>

          <Form.Group as={Col} controlId="formGridAddButton">
            <Form.Label>&nbsp;</Form.Label>
            <Button
              variant="primary"
              className="w-100"
              onClick={scheduleHandler}
            >
              Schedule
            </Button>
          </Form.Group>
        </Row>
      </Form>
    </Container>
  );
};

export default AddPassengers;
