import houses from "./houses.json";
import House from "../components/House";

const Index = () => {
	return (
		<div>
			<h2>Places to stay</h2>
			<div className="houses">
				{houses.map((house, index) => {
					return <House key={index} {...house} />
				})}
			</div>
		</div>
	)
}

export default Index;