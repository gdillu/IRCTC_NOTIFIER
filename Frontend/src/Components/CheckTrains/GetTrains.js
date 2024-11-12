// MyForm.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Table,
  Spinner
} from "react-bootstrap";
import SearchableDropdown from "../DropdownField"; // Import the dropdown component
import styles from "./GetTrains.module.css"; // Import the CSS module
import stationList from "../../static/Data/station_list.json"; // Import the JSON file
import ResponsiveAppBar from "../Layout/Header";
import { useNavigate } from "react-router-dom";

const MyForm = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [sourceOptions, setSourceOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [trainData, setTrainData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [minDate, setMinDate] = useState("");
  const url = "http://localhost:5000"
  const accessToken = localStorage?.getItem("token")

  useEffect(() => {
    const stations = stationList.map((station) => ({
      value: station.station_code,
      label: `${station.station}-${station.station_code}`,
    }));
    setSourceOptions(stations);
    setDestinationOptions(stations);
    const today = new Date();

  // Convert to Indian Standard Time (IST) by adding 5 hours and 30 minutes
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const istToday = new Date(today.getTime() + istOffset);

  // Format to YYYY-MM-DD for the date input field
  const formattedDate = istToday.toISOString().split("T")[0];
  setMinDate(formattedDate);
     // Assuming destination uses the same list
  }, []);

  const formatDate = (isoDateString) => {
    const dateObj = new Date(isoDateString);
    return dateObj.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    // console.log(event);
    setIsLoading(true);
    const postData = {
      from: source,
      to: destination,
      date: date.split("-").reverse().join("-"),
    };
    try {
      const response = await fetch(
        `${url}/api/trains/getTrains`,
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
      if (resData.redirect) {
        window.location.href = resData.redirect; // Redirect the user to the new path
      }
      if (Array.isArray(resData.data)) {
        const filteredTrains = resData.data.map((train) => ({
          train_no: train.train_base.train_no,
          train_name: train.train_base.train_name,
          fromStation: train.train_base.from_stn_name,
          fromCode: train.train_base.from_stn_code,
          toStation: train.train_base.to_stn_name,
          toCode: train.train_base.to_stn_code,
          chartingStation: train.train_base.chartingStation,
          scheduled_time: train.train_base.scheduled_time,
          statement : train.train_base.statement,
          journey_date: date,
        }));
        setTrainData(filteredTrains);
      } else {
        setTrainData([{ message: resData.data }]);
      }
      // setTimeout(() => {
      // }, 5000);
      // setTrainData([
      //   {
      //     train_no: "12617",
      //     train_name: "MANGLADWEEP EXP",
      //     from_stn_name: "Vadakara (Badagara)",
      //     to_stn_name: "Mangalore Jn",
      //     chartingStation: "CLT",
      //   },
      //   {
      //     train_no: "11013",
      //     train_name: "COIMBATORE EXPRESS",
      //     from_stn_name: "Coimbatore Jn",
      //     to_stn_name: "Mumbai CST",
      //     chartingStation: "PUNE",
      //   },
      //   {
      //     train_no: "12345",
      //     train_name: "POORVA EXPRESS",
      //     from_stn_name: "Howrah Jn",
      //     to_stn_name: "New Delhi",
      //     chartingStation: "DHN",
      //   },
      //   {
      //     train_no: "12951",
      //     train_name: "MUMBAI RAJDHANI",
      //     from_stn_name: "Mumbai Central",
      //     to_stn_name: "New Delhi",
      //     chartingStation: "BRC",
      //   },
      //   {
      //     train_no: "16526",
      //     train_name: "KSR BENGALURU EXP",
      //     from_stn_name: "KSR Bengaluru",
      //     to_stn_name: "New Delhi",
      //     chartingStation: "SBC",
      //   },
      // ]);
    } catch (error) {
      console.error("Error fetching train data:", error);
    } finally {
      setIsLoading(false); // Set loading to false once request is complete
    }
  }

  const onScheduleClickHandler = (train) => {
    navigate("/schedule", { state: { trainData: train } });
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container fluid className={styles.formContainer}>
        <Form onSubmit={handleSubmit}>
          <Row className="align-items-center">
          <Col xs={12} sm={3} className="mb-3">
  <SearchableDropdown
    label="From"
    value={source}
    onChange={setSource}
    options={sourceOptions}
    // Placeholder for 'Source'
  />
</Col>
<Col xs={12} sm={3} className="mb-3">
  <SearchableDropdown
    label="To"
    value={destination}
    onChange={setDestination}
    options={destinationOptions} // Use actual destination options here
  />
</Col>

            <Col xs={12} sm={3} className="mb-3">
            <Form.Group controlId="formDate">
  <Form.Control
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    required
    min={minDate} // This sets the minimum date to today
  />
</Form.Group>
            </Col>
            <Col xs={12} sm={3} className="mb-3">
              <Button
                type="submit"
                variant="primary"
                style={{ width: "100%" }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Submit"
                )}
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Display table after submission */}
        {trainData.length > 0 && (
          <div className={styles.scrollableTableContainer}>
            <Table striped bordered hover className={styles.translucentTable}>
              <thead>
                <tr>
                  <th>Train No</th>
                  <th>Train Name</th>
                  <th>From Station</th>
                  <th>To Station</th>
                  <th>Charting Station</th>
                  <th>Scheduled Time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {trainData ? (
                trainData[0]?.message ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      {trainData[0].message}
                    </td>
                  </tr>
                ) : (
                  trainData.map((train, index) => (
                    <tr key={index}>
                      <td>{train.train_no}</td>
                      <td>{train.train_name}</td>
                      <td>{train.fromStation}</td>
                      <td>{train.toStation}</td>
                      <td>
                        {sourceOptions.find(
                          (option) => option.value === train.chartingStation
                        )?.label || train.chartingStation}
                      </td>
                      <td colSpan={train.scheduled_time ? 1 : 2}>
  {train.scheduled_time ? formatDate(train.scheduled_time) : <span>{train?.statement}</span>}
</td>

            {train.scheduled_time &&
            <td>
              <div className={styles.buttonContainer}>
                <Button
                  variant="dark"
                  onClick={() => onScheduleClickHandler(train)}
                >
                  Schedule booking
                </Button>
              </div>
            </td>}
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Search for trains
                  </td>
                </tr>
              )}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </>
  );
};

export default MyForm;
