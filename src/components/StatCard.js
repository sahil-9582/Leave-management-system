// StatCard ek reusable card hai jo ek statistic dikhata hai
// Props: title, value, color (Bootstrap color), icon (emoji)
function StatCard(props) {
  return (
    <div className={`card text-white bg-${props.color} h-100`}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <p className="card-text mb-1 opacity-75" style={{ fontSize: "0.85rem" }}>
            {props.title}
          </p>
          <h2 className="card-title fw-bold mb-0">{props.value}</h2>
        </div>
        <div style={{ fontSize: "2.5rem", opacity: 0.7 }}>
          {props.icon}
        </div>
      </div>
    </div>
  );
}

export { StatCard };
export default StatCard;