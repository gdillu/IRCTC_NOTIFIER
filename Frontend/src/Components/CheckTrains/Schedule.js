import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ResponsiveAppBar from "../Layout/Header";
import styles from "./Schedule.module.css";
import { useEffect, useState } from "react";
import AddPassengers from "./AddPassengers";
import { useLocation } from "react-router-dom";

const Schedule = () => {
  const [showAddPassengers, setShowAddPassengers] = useState(false);
  const location = useLocation();
  const trainData = location.state?.trainData;

  // State for storing booking info
  const [bookingInfo, setBookingInfo] = useState({
    train_number: "",
    trainName: "",
    fromStation: "",
    toStation: "",
    journey_date: "",
    class: "",
    quota: "",
    mobile_number: "",
    UPI: "",
    userID  : "",
    password: "",
  });

  useEffect(() => {
    if (trainData) {
      setBookingInfo((prevInfo) => ({
        ...prevInfo,
        train_number: trainData.train_no,
        trainName: trainData.train_name,
        fromStation: trainData.fromStation,
        toStation: trainData.toStation,
        from: trainData.fromCode,
        to: trainData.toCode,
        scheduleTime: trainData.scheduled_time,
        journey_date:trainData.journey_date
      }));
    }
  }, [trainData]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Booking Info:", bookingInfo);
  };

  // Update booking info object on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return (
      bookingInfo.train_number &&
      bookingInfo.trainName &&
      bookingInfo.fromStation &&
      bookingInfo.toStation &&
      bookingInfo.journey_date &&
      bookingInfo.class &&
      bookingInfo.quota &&
      bookingInfo.mobile_number &&
      bookingInfo.UPI &&
      bookingInfo.userID &&
      bookingInfo.password
    );
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container fluid className={styles.formContainer}>
        <h2 className={styles.heading}>Schedule Booking</h2>
        {!showAddPassengers && (
          <Form>
            <Form.Label className={styles.labelHeading}>
              Train details
            </Form.Label>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridTrainNumber">
                <Form.Label>Train Number</Form.Label>
                <Form.Control
                  readOnly
                  name="train_number"
                  placeholder="Train Number"
                  value={bookingInfo.train_number}
                  onChange={handleChange}
                  className={styles.noInteraction}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridTrainName">
                <Form.Label>Train Name</Form.Label>
                <Form.Control
                  name="trainName"
                  placeholder="Train Name"
                  value={bookingInfo.trainName}
                  onChange={handleChange}
                  className={styles.noInteraction}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridFromStation">
                <Form.Label>From Station</Form.Label>
                <Form.Control
                  name="fromStation"
                  placeholder="From Station"
                  value={bookingInfo.fromStation}
                  onChange={handleChange}
                  className={styles.noInteraction}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridToStation">
                <Form.Label>To Station</Form.Label>
                <Form.Control
                  name="toStation"
                  placeholder="To Station"
                  value={bookingInfo.toStation}
                  onChange={handleChange}
                  className={styles.noInteraction}
                />
              </Form.Group>
            </Row>

            <Form.Label className={styles.labelHeading}>
              User details
            </Form.Label>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridJourneyDate">
                <Form.Label>Journey Date</Form.Label>
                <Form.Control
                  readOnly
                  name="journey_date"
                  type="date"
                  value={bookingInfo.journey_date}
                  onChange={handleChange}
                  className={styles.noInteraction}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridClass">
                <Form.Label>Class</Form.Label>
                <Form.Select
                  name="class"
                  aria-label="Select Class"
                  value={bookingInfo.class}
                  onChange={handleChange}
                  required
                >
                  <option>Select class</option>
                  <option value="SL">Sleeper</option>
                  <option value="2A">Second AC</option>
                  <option value="3A">Third AC</option>
                  <option value="1A">First AC</option>
                  <option value="2S">Second sitting</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridQuota">
                <Form.Label>Quota</Form.Label>
                <Form.Select
                  name="quota"
                  aria-label="Select Quota"
                  value={bookingInfo.quota}
                  onChange={handleChange}
                  required
                >
                  <option>Select quota</option>
                  <option value="GN">General</option>
                  <option value="LD">Ladies</option>
                  <option value="SS">Senior Citizen</option>
                </Form.Select>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} className="mb-3" controlId="formGridMobile">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  name="mobile_number"
                  type="number"
                  value={bookingInfo.mobile_number}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group as={Col} className="mb-3" controlId="formGridUPI">
                <Form.Label>UPI Id</Form.Label>
                <Form.Control
                  name="UPI"
                  value={bookingInfo.UPI}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridUserId">
                <Form.Label>User ID (IRCTC)</Form.Label>
                <Form.Control
                  name="userID"
                  value={bookingInfo.userID}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password (IRCTC)</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  value={bookingInfo.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Row>

            <Button
              variant="primary"
              type="submit"
              onClick={() => setShowAddPassengers(true)}
              disabled={!isFormValid()}
            >
              Add Passengers
            </Button>
          </Form>
        )}
        {showAddPassengers && (
          <AddPassengers
            bookingInfo={bookingInfo}
            goBackHandler={() => setShowAddPassengers(!showAddPassengers)}
          />
        )}
      </Container>
    </>
  );
};

export default Schedule;
