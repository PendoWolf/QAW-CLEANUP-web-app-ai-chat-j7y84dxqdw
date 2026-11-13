import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { daysUntilStart, tripLengthDays } from "../analytics/tripMetrics";
import { tripsApi, type NewTrip } from "../api/trips";
import { TripForm } from "../components/TripForm";

/** Plans a new trip, then goes back to the trip list. */
export function NewTripPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const createTrip = async (trip: NewTrip) => {
    try {
      setError(null);
      const created = await tripsApi.create(trip);
      // Confirms the trip was saved, which the Add trip click alone can't show.
      window.pendo?.track("trip_created", {
        tripId: created.id,
        destination: trip.destination.slice(0, 100),
        startDate: trip.startDate,
        endDate: trip.endDate,
        tripLengthDays: tripLengthDays(trip),
        travelers: trip.travelers,
        daysUntilStart: daysUntilStart(trip),
      });
      navigate("/trips");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <>
      <TripForm heading="Plan a trip" submitLabel="Add trip" onSubmit={createTrip} />
      {error && <p className="error">{error}</p>}
    </>
  );
}
