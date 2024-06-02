import { Button, CircularProgress, Fade, Typography } from "@mui/material";

const LoadingButton = (props) => {
  const { loading, ...other } = props;
  return (
    <Button variant="contained" {...other}>
      <Fade
        in={loading}
        style={{ transitionDelay: "100ms", marginRight: 10 }}
        unmountOnExit
      >
        <CircularProgress color="inherit" size={25} />
      </Fade>
      <Typography sx={{ color: "#fff" }}>{props.label}</Typography>
    </Button>
  );
};

export default LoadingButton;
