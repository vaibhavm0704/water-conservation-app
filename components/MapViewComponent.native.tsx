import React from 'react';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { StyleSheet } from 'react-native';

export default function MapViewComponent() {
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={styles.map}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker
        coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
        title="Your Estate"
        description="Drag to adjust"
        draggable
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});
