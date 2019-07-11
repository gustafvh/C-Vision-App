import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { MonoText } from "../components/StyledText";
import ImageGrid from "../components/ImageGrid";
import firebase from "../utils/firebase";
import { firestore } from "../utils/firebase";

export default class ImagesScreen extends React.Component {
  state = {
    imagesReadFromFirebase: []
  };

  componentDidMount() {
    this.readFromFirebase();
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

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.welcomeContainer}>
            <ImageGrid
              imagesReadFromFirebase={this.state.imagesReadFromFirebase}
              imageUrl="https://firebasestorage.googleapis.com/v0/b/c-vision-rn-app.appspot.com/o/8a67f576-e697-4688-ac8c-79c6116aed44?alt=media&token=288814e5-fa1b-4ab1-94ef-0f5a4275feeb"
            />
          </View>
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>
            All images can currently be found at
          </Text>

          <View
            style={[styles.codeHighlightContainer, styles.navigationFilename]}
          >
            <MonoText style={styles.codeHighlightText}>
              https://firebase.google.com/project/c-vision-rn-app
            </MonoText>
          </View>
        </View>
      </View>
    );
  }
}

ImagesScreen.navigationOptions = {
  title: "Analyzed Images"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
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
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
