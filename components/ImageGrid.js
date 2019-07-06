import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View
} from "react-native";

export default class ImageGrid extends Component {
  render() {
    const styles = StyleSheet.create({
      grid: {
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap"
      },
      developmentModeText: {
        marginBottom: 20,
        color: "rgba(0,0,0,0.4)",
        fontSize: 14,
        lineHeight: 19,
        textAlign: "center"
      }
    });

    return (
      <View style={styles.grid}>
        {this.props.imagesReadFromFirebase.map((image, index) => (
          <View>
            <Image
              source={{ uri: image.imageUrl }}
              style={{ width: 100, height: 100 }}
            />
            <View style={{ width: 90, height: 60, overflow: "hidden" }}>
              <Text style={styles.developmentModeText}>{image.image}</Text>
            </View>
          </View>
        ))}

        {/* 
        <Image
          source={{ uri: this.props.imageUrl }}
          style={{ width: 250, height: 250 }}
        />

      */}
      </View>
    );
  }
}
