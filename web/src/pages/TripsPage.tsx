import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { daysUntilStart, tripLengthDays } from "../analytics/tripMetrics";
import { tripsApi, type Trip } from "../api/trips";
import { TripList } from "../components/TripList";

/** The signed-in user's trips. */
export function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    tripsApi
      .list()
      .then(setTrips)
      .catch((e: Error) => setError(e.message));
  }, []);

  const removeTrip = async (trip: Trip) => {
    try {
      setError(null);
      await tripsApi.remove(trip.id);
      setTrips((current) => current.filter((t) => t.id !== trip.id));
      // Confirms the deletion succeeded, and whether the removed trip was upcoming or past.
      const daysUntil = daysUntilStart(trip);
      window.pendo?.track("trip_removed", {
        tripId: trip.id,
        travelers: trip.travelers,
        tripLengthDays: tripLengthDays(trip),
        daysUntilStart: daysUntil,
        isUpcoming: daysUntil !== null && daysUntil > 0,
        remainingTripCount: trips.filter((t) => t.id !== trip.id).length,
      });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <section aria-labelledby="trips-heading">
      <div className="section-header">
        <h2 id="trips-heading">Your trips</h2>
        <Link className="button" to="/trips/new">
          Plan a trip
        </Link>
      </div>
      <TripList trips={trips} onRemove={removeTrip} />
      {error && <p className="error">{error}</p>}
    </section>
  );
}
