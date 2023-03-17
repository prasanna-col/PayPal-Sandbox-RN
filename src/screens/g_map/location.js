import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, AppState } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import { fb } from '../../firebase_config';
import database from '@react-native-firebase/database';
import BackgroundGeolocation from 'react-native-background-geolocation';

const MapScreen = () => {
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log('App has come to the foreground!');
            }

            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            console.log('AppState', appState.current);
            // if (appState.current == "background"){

            // }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        if (appState.current == "background") {
            // need to start when app goes to bg
            BackgroundGeolocation.start();

            // get location in background
            BackgroundGeolocation.onLocation((location) => {
                console.log('New BackgroundGeolocation location:', location);
            });
        }
    }, [])

    const [initialRegion, setInitialRegion] = useState(null);
    const [locationPermission, setLocationPermission] = useState('');
    const [tracking, setTracking] = useState(false)

    useEffect(() => {

        if (Platform.OS == "android") {
            BackgroundGeolocation.requestPermission().then((result) => {
                console.log('BackgroundGeolocation permission:', result);
            });

            BackgroundGeolocation.configure({
                desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
                stationaryRadius: 50,
                distanceFilter: 50,
                notificationTitle: 'Background tracking',
                notificationText: 'enabled',
                debug: true,
                startOnBoot: false,
                stopOnTerminate: true,
                locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
                interval: 10000,
                fastestInterval: 5000,
                activitiesInterval: 10000,
                stopOnStillActivity: false,
                url: 'http://yourserver.com/locations',
                httpHeaders: {
                    'X-FOO': 'bar'
                },
                // customize post properties
                postTemplate: {
                    lat: '@latitude',
                    lon: '@longitude',
                    foo: 'bar' // you can also add your own properties
                }
            });
        }

    }, [])




    useEffect(() => {
        console.log("locationPermission :: ", locationPermission)
    }, [locationPermission])

    const get_current_loc = () => {
        Geolocation.getCurrentPosition(
            position => {
                console.log("Current position", position)
                const { latitude, longitude } = position.coords;
                setInitialRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
            },
            error => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
    }

    const handleLocationUpdates = (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Moving position", position)
        // setLocation({ latitude, longitude });
        try {
            database().ref("/location").set({
                latitude: latitude,
                longitude: longitude
            })
            console.log('Data uploaded successfully');
        } catch (err) {
            console.log("location fb Err:", err)
        }

        setInitialRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
    };

    // useEffect(() => {
    //     const watchId = Geolocation.watchPosition(
    //         handleLocationUpdates,
    //         (error) => console.log(error),
    //         {
    //             enableHighAccuracy: true,
    //             distanceFilter: 10,
    //             interval: 5000,
    //             fastestInterval: 5000,
    //         },
    //     );

    //     return () => {
    //         Geolocation.clearWatch(watchId);
    //     };
    // }, []);


    const handleStartTracking = () => {
        setTracking(true)

        const watchId = Geolocation.watchPosition(
            handleLocationUpdates,
            (error) => console.log(error),
            {
                enableHighAccuracy: true,
                distanceFilter: 10,
                interval: 20000,
                fastestInterval: 8000,
            },
        );
    }

    const handleStopTracking = () => {
        setTracking(false)
        Geolocation.stopObserving();
    };

    const checkLocationPermission = async () => {
        const permission =
            Platform.OS === 'android'
                ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
                : PERMISSIONS.IOS.LOCATION_ALWAYS;

        try {
            const result = await check(permission);
            if (result === RESULTS.GRANTED) {
                setLocationPermission('granted');
                get_current_loc();
            } else if (result === RESULTS.DENIED) {
                setLocationPermission('denied');
                requestLocationPermission();
            } else if (result === RESULTS.BLOCKED) {
                setLocationPermission('blocked');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const requestLocationPermission = async () => {
        const permission =
            Platform.OS === 'android'
                ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
                : PERMISSIONS.IOS.LOCATION_ALWAYS;

        try {
            const result = await request(permission);
            if (result === RESULTS.GRANTED) {
                setLocationPermission('granted');
                get_current_loc();
            } else {
                setLocationPermission('denied');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkLocationPermission()
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ height: "85%", width: "100%" }}>
                {initialRegion ? (
                    <MapView
                        style={styles.map}
                        initialRegion={initialRegion}
                        showsUserLocation
                        followsUserLocation
                    >
                        <Marker coordinate={initialRegion} />
                    </MapView>
                ) : (
                    <Text>Loading...</Text>
                )}
            </View>
            <View style={{ padding: 10 }}>
                <Text>📍{initialRegion?.latitude} | {initialRegion?.longitude}</Text>
                {
                    tracking ?
                        <Text >Tracking...</Text>
                        : null
                }

                <View style={{ width: "100%" }}>

                    {
                        tracking ?
                            <TouchableOpacity
                                onPress={() => {
                                    handleStopTracking()
                                }}
                            >
                                <Text style={{ fontWeight: "bold", color: "red" }}>Stop tracking⤯</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => {
                                    handleStartTracking()
                                }}
                            >
                                <Text style={{ fontWeight: "bold", color: "green" }}>Start track⬀</Text>
                            </TouchableOpacity>
                    }
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        height: "100%"
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

export default MapScreen;