import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  PermissionsAndroid, 
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import {RNCamera as Camera}  from 'react-native-camera';
import CameraRoll from "@react-native-community/cameraroll";

let PicturePath = '';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraType: 'back',
      mirrorMode: false,
      photos: []
    };
  }


  checkAndroidPermission = async () => {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      await PermissionsAndroid.request(permission);
      Promise.resolve();
    } catch (error) {
      Promise.reject(error);
    }
  };

  fetchPhotos(count = 10, after) {  
    // Use the CameraRoll API on iOS and Android
    CameraRoll.getPhotos({
      first: 20,
    })
    .then(r => {
      this.setState({ photos: r.edges });
    })
    .catch((err) => {
       //Error Loading Images
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={cam => {
            this.camera = cam;
          }}
          style={styles.preview}
          // aspect={Camera.constants.Aspect.fill}
          // captureTarget={Camera.constants.CaptureTarget.disk}
          type={this.state.cameraType}
          mirrorImage={this.state.mirrorMode}
        >
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>
            [CAPTURE]
          </Text>

         
          
          <Text
            style={styles.capture}
            onPress={this.changeCameraType.bind(this)}
          >
            [SWITCH CAMERA]
          </Text>
        </Camera>
      </View>
    );
  }

  changeCameraType() {
    if (this.state.cameraType === 'back') {
      this.setState({
        cameraType: 'front',
        mirrorMode: true
      });
    } else {
      this.setState({
        cameraType: 'back',
        mirrorMode: false
      });
    }
  }

  storePicture() {
    if (PicturePath) {
      // Create the form data object
      var data = new FormData();
      data.append('picture', {
        uri: PicturePath,
        name: 'selfie.jpg',
        type: 'image/jpg'
      });

      // Create the config object for the POST
      // You typically have an OAuth2 token that you use for authentication
      const config = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data;',
          Authorization: 'Bearer ' + 'SECRET_OAUTH2_TOKEN_IF_AUTH'
        },
        body: data
      };

      fetch('https://postman-echo.com/post', config)
        .then(responseData => {
          // Log the response form the server
          // Here we get what we sent to Postman back
          console.log(responseData);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  takePicture = async () => {
    if (Platform.OS === 'android'){
      await this.checkAndroidPermission();
    }
    this.camera.takePictureAsync().then(data=> {
      CameraRoll.saveToCameraRoll(data.uri, 'photo') 
          .then(alert('Done', 'Photo added to camera roll!')) 
          .catch(err => console.log('err:', err))
    })
    
  };
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

export default App;
