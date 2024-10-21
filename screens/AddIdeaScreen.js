import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { Camera } from "expo-camera/legacy";
import PeopleContext from "../PeopleContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddIdeaScreen({ navigation, route }) {
  const { id } = route.params;  // Get person id from route params
  const { saveIdea } = useContext(PeopleContext);
  
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [ideaName, setIdeaName] = useState("");
  const [aspectRatio, setAspectRatio] = useState(2 / 3);
  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);
  
  // Get Camera Permission
  useEffect(() => {
    (async () => {
      try{
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
        if (
          status !== 'granted'
        ) {
          alert('Permission for media access needed.');
        }
      }
      catch(e){
        console.log("Error requesting camera permission: ",e);
      }
    })();
  }, []);

  // Calculate the image dimensions based on screen width percentage (50-70%)
  useEffect(() => {
    const screenWidth = Dimensions.get("window").width;
    const widthPercentage = 0.6;  // 60% of the screen width
    const calculatedWidth = screenWidth * widthPercentage;
    const calculatedHeight = calculatedWidth * aspectRatio;
    
    setImageWidth(calculatedWidth);
    setImageHeight(calculatedHeight);
  }, []);

  // Take a picture and save it
  const takePicture = async () => {
    if (cameraRef) {
      const sizes = await cameraRef.getAvailablePictureSizesAsync("2:3");

      const options = {
        quality: 1,
        pictureSize: sizes ? sizes[1] : '1200x1800',
        imageType: 'jpg',
        skipProcessing: false,
      };

      const data = await cameraRef.takePictureAsync(options);
      setPhoto(data.uri);
    }
  };

  // Save Idea to Context and Async Storage
  const handleSave = async () => {
    if (!ideaName || !photo) {
      alert("Please provide both a name and an image.");
      return;
    }

    const newIdea = {
      id: Date.now().toString(),
      name: ideaName,
      imageUri: photo,
      personId: id,
    };

    // Save the idea to the context and async storage
    saveIdea(newIdea);
    await AsyncStorage.setItem(`idea-${newIdea.id}`, JSON.stringify(newIdea));

    navigation.navigate("PeopleScreen", { id });
  };

  // Handle Cancel button
  const handleCancel = () => {
    navigation.navigate("PeopleScreen", { id });
  };

  // Check camera permission
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera, please allow access</Text>;
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
        {/* Text Input for Idea Name */}
        <TextInput
          style={styles.input}
          placeholder="Enter idea name"
          value={ideaName}
          onChangeText={setIdeaName}
        />

        {/* Camera View or Image Preview */}
        {!photo ? (
          <Camera style={{ height: imageHeight, width: imageWidth }} ref={setCameraRef} />
        ) : (
          <Image source={{ uri: photo }} style={{ height: imageHeight, width: imageWidth }} />
        )}

        {/* Capture or Retake Button */}
        <TouchableOpacity
          style={styles.captureButton}
          onPress={photo ? () => setPhoto(null) : takePicture}
        >
          <Text style={styles.captureText}>{photo ? "Retake" : "Take Picture"}</Text>
        </TouchableOpacity>

        {/* Save and Cancel Buttons */}
        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={handleCancel} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  captureButton: {
    backgroundColor: "blue",
    padding: 15,
    marginVertical: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  captureText: {
    color: "white",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
