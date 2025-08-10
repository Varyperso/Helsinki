const addStyle = {
  color: "green",
  background: "lightgrey",
  fontSize: 20,
  borderStyle: "solid",
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
};

const errorStyle = {
  color: "red",
  background: "lightgrey",
  fontSize: 20,
  borderStyle: "solid",
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
};

const Notification = ({ message }) => {
  let msgStyle;

  if (message === null) return null;
  else if (message.includes("error")) msgStyle = errorStyle;
  else msgStyle = addStyle;

  return <div style={msgStyle}>{message}</div>
};

export default Notification;