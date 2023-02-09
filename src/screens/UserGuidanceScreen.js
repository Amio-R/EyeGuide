import React, { useContext, useEffect, useState, useRef } from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Box, Button, Center, Text, View, Image, FlatList} from 'native-base';
import { getGPSData } from '../helper-functions/gpsFetching';
import ListItems from '../components/molecules/ListItems';
import {NEXT_LABEL} from '../assets/locale/en';
import {ScrollView} from 'react-native';
import GetLocation from 'react-native-get-location';
// import KalmanFilter from 'kalmanjs';
import Geolocation from 'react-native-geolocation-service';
import Tts from 'react-native-tts';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {
    marginTop: 10,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  title: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '500',
    color: '#353d3f',
    marginBottom: '0%',
  },
  logoImage: {
    marginTop: '20%',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  dividerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
  dividerText: {
    textAlign: 'center',
    color: '#808585',
    paddingHorizontal: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#808585',
  },
  input: {
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: '#808585',
    color: '#000000',
  },
  boxCard: {
    backgroundColor: '#DEDEDE',
    paddingHorizontal: 18,
    borderRadius: 15,
    paddingVertical: 30,
  },
});

const maxBoundary = 0.000196;
let pathIndex = 0;
let ttsIndex = 0;
// let count = 0;

const UserGuidanceScreen = ({route, navigation}) => {
  
    const [indexTracker, setIndexTracker] = useState([]);
    const [pointTracker, setPointTracker] = useState([]);
    const [coordinates, setCoordinates] = useState([]);
    const [stepName, setStepName] = useState('');
    const watchId = useRef(null);
    
    useEffect(() => {
      getLocationUpdates();
      setStepName('start');
    }, []);

    const getLocationUpdates = async () => {
      console.log('watch Id: ' + watchId.current);
      if (watchId.current === null) {
        watchId.current = Geolocation.watchPosition(
          position => {
            // if (count % 10 == 0) {
            //   checkTTS();
            // }
            closestPoint(position.coords.latitude, position.coords.longitude)
            setCoordinates(coordinates => [...coordinates, [position.coords.latitude, position.coords.longitude]]);
            // count++;
          },
          error => {
            setCoordinates(null);
            console.log(error);
          },
          {
            enableHighAccuracy: true,
            distanceFilter: 0,
            interval: 1000,
            fastestInterval: 200,
            showLocationDialog: true,
          },
        );
        // setWatchId(watchIdRef);
        console.log('watch Id: ' + watchId.current);
      }
    };
    
    const stop = () => {
      if (watchId.current !== null) {
        console.log('watch is not null');
        Geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    }
  
    const distance = (x1, y1, x2, y2) => {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    const checkTTS = () => {
      let guid = route.params.path[pathIndex];

      while(ttsIndex < route.params.tts.length && route.params.tts[ttsIndex][0] == guid) {
        Tts.speak(route.params.tts[ttsIndex][1]);
        ttsIndex++;
      }
      // pathIndex++;
    };
  
    const closestPoint = (lat, long) => {
  
      //finds node closest to currently obtained GPS location
      let minVal = 100;
      let minNode = null;
      let nodeDistance = 0
      route.params.nodeList.forEach(node => {
        nodeDistance = distance(node['lat'], node['long'], lat, long);
        if (nodeDistance < minVal) {
          minVal = nodeDistance;
          minNode = node;
        }
      });
  
      //if the closest node is the next node in the path
      if (minNode["guid"] === route.params.path[pathIndex + 1] && minVal < maxBoundary) {

        //update current index
        pathIndex++;
        checkTTS();

        setIndexTracker(indexTracker => [...indexTracker, pathIndex]);
        setIndexTracker(indexTracker => [
          ...indexTracker,
          'update coordinates: ' + lat + ', ' + long
        ]);

        if(pathIndex === route.params.path.length) {
          stop();
          setStepName('Done');
        }
      }

      setPointTracker(pointTracker => [...pointTracker, 'POINT3: ' + pathIndex]);
    };
  
    return (
      <View style={styles.view}>
        <Image
          style={styles.logoImage}
          source={require('../assets/images/splashscreen_logo.png')}
          size="lg"
          alt="Logo image"
        />
        <Text style={styles.title} fontSize="2xl">
          User Guidance Screen
        </Text>
        {/* <Button
          title="Stop"
          style={styles.button}
          onPress={stop}>
            <Text style={styles.buttonText}>Stop</Text>
        </Button> */}
        {stepName == 'start' ? (
          <View maxHeight="65%">
            <FlatList
              data={coordinates}
              renderItem={({item}) => (
                <>
                  <Text style={styles.dividerText}>
                    {item}
                  </Text>
                </>
              )}
            />
          </View>
        ) : stepName == 'Done' ? (
          <Button
            title="Stop"
            style={styles.button}
            onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Go back to Login</Text>
          </Button>
        ) : (
          <></>
        )}
      </View>
    );

};

export default UserGuidanceScreen;

