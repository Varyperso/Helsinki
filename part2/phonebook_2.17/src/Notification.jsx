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
  let msg;
  if (message === null) {
    return null;
  }
  if (message.includes("error")) msg = errorStyle;
  else msg = addStyle;

  return (
    <div style={msg} className="error">
      {message}
    </div>
  );
};
export default Notification;
