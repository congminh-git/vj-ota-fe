import FlightItem from './chuyen_bay_item';

function ListFlightTravelOptions({
    listFlightTraveloptions,
    adult,
    child,
    infant,
    setSelectedFlight,
    selectedFlight,
    setFareOptionFlight,
    roundTrip,
    direction,
    setActiveSelectFlight,
}) {
    return (
        <div className="sm:mt-4 mt-2 w-full">
            {listFlightTraveloptions.map((item, index) => {
                return (
                    <div key={index}>
                        <FlightItem
                            flightItemData={item}
                            adult={adult}
                            child={child}
                            infant={infant}
                            setSelectedFlight={setSelectedFlight}
                            selectedFlight={selectedFlight}
                            setFareOptionFlight={setFareOptionFlight}
                            roundTrip={roundTrip}
                            direction={direction}
                            setActiveSelectFlight={setActiveSelectFlight}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default ListFlightTravelOptions;