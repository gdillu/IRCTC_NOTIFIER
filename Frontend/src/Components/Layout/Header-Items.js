import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HeaderItems = (props) => {
  const navigate = useNavigate();

  const onClickHandler = () => {
    console.log(props.page);
    
    if (props.page === "Check trains") navigate("/checkTrains");
    else if (props.page === "Login/Sign up") navigate("/login");
  };
  return (
    <Button
      key={props.page}
      sx={{  color: "white"}}
      onClick={onClickHandler}
    >
      {props.page}
    </Button>
  );
};

export default HeaderItems;
