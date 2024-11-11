// Logout.js
import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "./../../Store/auth-store"
import ResponsiveAppBar from "../Layout/Header";
import styles from "./Logout.module.css";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleYesClick = () => {
    dispatch(authActions.logout());
    navigate("/");
  };

  const handleNoClick = () => {
    navigate("/");
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container fluid className={styles.formContainer}>
        <Form className={styles.form}>
          <p className={styles.confirmationText}>
            Are you sure you want to logout?
          </p>
          <div className={styles.buttonGroup}>
            <Button variant="danger" onClick={handleYesClick}>
              Yes
            </Button>
            <Button variant="secondary" onClick={handleNoClick}>
              No
            </Button>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default Logout;
