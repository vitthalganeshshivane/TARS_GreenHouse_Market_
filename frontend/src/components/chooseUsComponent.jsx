export default function ChooseUsComponent({ icon, heading, subHeading }) {
  return (
    <div className="bg-secondary">
      <img src={icon} alt={icon} />
      <div>
        <h2>{heading}</h2>
        <span>{subHeading}</span>
      </div>
    </div>
  )
}

