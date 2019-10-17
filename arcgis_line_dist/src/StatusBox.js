
function StatusBox(props) {
  return (
    <div style={{ height: "70px", width: "70px" }}>
      <p><span>{props.status} </span></p>
      <p><span>{props.distance}</span></p>
    </div>
  )
};

export default StatusBox;