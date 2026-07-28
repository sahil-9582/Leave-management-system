// EmptyState jab dikhao jab list empty ho
// Props: icon, message, subMessage (optional), buttonText (optional), onButtonClick (optional)
function EmptyState(props) {
  return (
    <div className="text-center py-5">
      <div style={{ fontSize: "4rem" }}>{props.icon || "📭"}</div>
      <h5 className="text-muted mt-3 mb-1">
        {props.message || "No data found"}
      </h5>
      {props.subMessage && (
        <p className="text-muted small">{props.subMessage}</p>
      )}
      {props.buttonText && (
        <button
          className="btn btn-primary mt-3"
          onClick={props.onButtonClick}
        >
          {props.buttonText}
        </button>
      )}
    </div>
  );
}

export { EmptyState };
export default EmptyState;