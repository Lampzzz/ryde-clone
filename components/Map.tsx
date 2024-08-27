import { Text, View } from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

const Map = () => {
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      tintColor="black" // ios only
      mapType="mutedStandard" // ios only
      showsPointsOfInterest={false} // ios only
      // initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light" // ios only
    ></MapView>
  );
};

export default Map;
