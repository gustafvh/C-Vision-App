import React from "react";
import {
  ActivityIndicator,
  Button,
  Platform,
  Clipboard,
  FlatList,
  Image,
  Share,
  StyleSheet,
  Text,
  ScrollView,
  View
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { MonoText } from "../components/StyledText";
import uuid from "uuid";
import Environment from "../config/environment";
import firebase from "../utils/firebase";
import lightning from "../assets/images/lightning-logo.png";

//Some functions are inspired by mlapeter at https://github.com/mlapeter/google-cloud-vision

console.disableYellowBox = true;

export default class StartScreen extends React.Component {
  state = {
    imageUrl: null,
    imagesCollection: [],
    uploading: false,
    googleResponse: null,
    step: 1
  };

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.helpContainer}>
            {this.state.googleResponse && (
              <View>
                {this.state.imageUrl !== null && (
                  <View style={{ alignItems: "center", marginBottom: 10 }}>
                    <Image
                      source={{ uri: this.state.imageUrl }}
                      style={{ width: 300, height: 300 }}
                    />
                  </View>
                )}
                <View style={{ height: 450 }}>
                  <Text style={styles.h1}>Result</Text>
                  <Text style={styles.paragraphText}>The image contains:</Text>
                  <Text style={styles.paragraphText}> </Text>
                  <FlatList
                    data={
                      this.state.googleResponse.responses[0].labelAnnotations
                    }
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={({ item }) => (
                      <View>
                        <Text style={styles.paragraphText}>
                          <Text style={{ fontWeight: "800" }}>
                            {item.description}
                          </Text>{" "}
                          - {Math.round(item.score * 100)}% certainty.
                        </Text>
                      </View>
                    )}
                  />
                </View>

                <Text style={styles.paragraphText}> </Text>

                <Text style={styles.paragraphText}>
                  Full Response Data from Google:
                </Text>

                <Text style={styles.paragraphText}> </Text>

                <Text
                  onPress={this._copyToClipboard}
                  onLongPress={this._share}
                  style={{ paddingVertical: 10, paddingHorizontal: 10 }}
                >
                  {JSON.stringify(this.state.googleResponse.responses)}
                </Text>
              </View>
            )}
            {this._maybeRenderImage()}
            {this._maybeRenderUploadingOverlay()}
          </View>

          {!this.state.imageUrl && (
            <View style={styles.welcomeContainer}>
              <Image
                source={lightning}
                style={{
                  width: 180,
                  height: 220,
                  resizeMode: "contain"
                }}
              />

              <View style={styles.getStartedContainer}>
                <Text style={styles.h3}>Welcome to.</Text>
                <Text style={styles.h1}>C-Vision.</Text>
                <Text style={styles.paragraphText}>An image labeling app.</Text>
                <Text style={styles.paragraphText}>
                  Upload an image to analyse.
                </Text>
                <Text style={styles.paragraphText}> </Text>
              </View>

              <Text style={styles.paragraphText}> Choose image from: </Text>

              <Button onPress={this._pickImage} title="Camera roll" />

              <Button onPress={this._takePhoto} title="Take a photo" />
            </View>
          )}
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>
            <Text style={styles.tabBarInfoTextHighlighted}>Upload</Text> -
            Analyze - Compare
          </Text>
        </View>
      </View>
    );
  }

  organize = array => {
    return array.map(function(item, i) {
      return (
        <View key={i}>
          <Text>{item}</Text>
        </View>
      );
    });
  };

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center"
            }
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let { imageUrl, googleResponse } = this.state;
    if (!imageUrl) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 20,
          borderRadius: 3,
          elevation: 2
        }}
      >
        <Image source={{ uri: imageUrl }} style={{ width: 300, height: 300 }} />

        <Text />
        <Button
          style={{ marginBottom: 10 }}
          onPress={() => this.submitToGoogle()}
          title="Analyze this image"
        />
        <Text style={styles.paragraphText}>
          This will use Image Recogniztion to guess what this image contains
        </Text>

        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}
        />
      </View>
    );
  };

  _keyExtractor = (item, index) => item.id;

  _renderItem = item => {
    <Text>response: {JSON.stringify(item)}</Text>;
  };

  _share = () => {
    Share.share({
      message: JSON.stringify(this.state.googleResponse.responses),
      title: "Check it out",
      url: this.state.imageUrl
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.imageUrl);
    alert("Copied to clipboard");
  };

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async pickerResult => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ imageUrl: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({ uploading: false });
    }
  };

  submitToGoogle = async () => {
    try {
      this.setState({ uploading: true });
      let { imageUrl } = this.state;
      let body = JSON.stringify({
        requests: [
          {
            features: [
              { type: "LABEL_DETECTION", maxResults: 10 },
              { type: "LANDMARK_DETECTION", maxResults: 5 },
              { type: "FACE_DETECTION", maxResults: 5 },
              { type: "LOGO_DETECTION", maxResults: 5 },
              { type: "TEXT_DETECTION", maxResults: 5 },
              { type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
              { type: "SAFE_SEARCH_DETECTION", maxResults: 5 },
              { type: "IMAGE_PROPERTIES", maxResults: 5 },
              { type: "CROP_HINTS", maxResults: 5 },
              { type: "WEB_DETECTION", maxResults: 5 }
            ],
            image: {
              source: {
                imageUri: imageUrl
              }
            }
          }
        ]
      });
      let response = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=" +
          Environment["GOOGLE_CLOUD_VISION_API_KEY"],
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: body
        }
      );
      let responseJson = await response.json();
      //console.log(responseJson);
      this.setState({
        googleResponse: responseJson,
        uploading: false,
        step: 2
      });

      let topImageLabels = [
        responseJson.responses[0].labelAnnotations[0].description,
        responseJson.responses[0].labelAnnotations[1].description,
        responseJson.responses[0].labelAnnotations[2].description,
        responseJson.responses[0].labelAnnotations[3].description
      ];

      firebase
        .database()
        .ref(
          "images/" +
            topImageLabels[0] +
            " (" +
            topImageLabels[1] +
            ", " +
            topImageLabels[2] +
            ", " +
            topImageLabels[3] +
            ")"
        )
        .set({
          imageUrl: imageUrl,
          id: Math.round(Math.random() * 10000),
          confidence: responseJson.responses[0].labelAnnotations[0].score,
          fullResponseData: responseJson
        });
    } catch (error) {
      console.log(error);
    }
  };
}

readFromFirebase = () => {
  const database = firebase.database().ref("images");

  database.on("value", snapshot => {
    let images = snapshot.val();
    let newState = [];
    for (let image in images) {
      newState.push({
        image: image,
        imageUrl: images[image].imageUrl,
        id: images[image].id,
        confidence: images[image].confidence,
        fullResponseData: images[image].fullResponseData
      });
    }

    this.setState({
      imagesReadFromFirebase: newState
    });
  });
};

async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child(uuid.v4());
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  const imageUrl = await snapshot.ref.getDownloadURL();

  return imageUrl;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 10
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  h1: {
    fontSize: 42,
    fontWeight: "700",
    color: "rgba(96,100,109, 1)",
    lineHeight: 46,
    textAlign: "center"
  },
  h3: {
    fontSize: 21,
    color: "rgba(96,100,109, 1)",
    lineHeight: 34,
    textAlign: "center"
  },
  paragraphText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },

  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 0.2)",
    textAlign: "center"
  },
  tabBarInfoTextHighlighted: {
    color: "rgba(51,153,255, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  navigationFilename: {
    marginTop: 5
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  }
});

StartScreen.navigationOptions = {
  title: "Start"
};
