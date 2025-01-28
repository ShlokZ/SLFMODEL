import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { uploadImage } from '../api/api';

const CameraScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Resize image before uploading
  const resizeImage = async (uri) => {
    const resizedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return resizedImage.uri;
  };

  // Handle image selection from camera
  const pickImageFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Camera access is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const resizedUri = await resizeImage(result.assets[0].uri);
      setImageUri(resizedUri);
    }
  };

  // Handle image selection from gallery
  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Gallery access is required to pick an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const resizedUri = await resizeImage(result.assets[0].uri);
      setImageUri(resizedUri);
    }
  };

  // Handle image upload and analysis
  const handleUpload = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please select or capture an image first!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await uploadImage(imageUri);
      setIsLoading(false);

      // Clear image and navigate to results
      setImageUri(null);
      navigation.navigate('ResultsScreen', {
        detections: response.detections,
        processedImageUrl: response.imageUrl,
      });
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to upload and analyze the image. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Streetlight Detection App</Text>
      <Text style={styles.subHeader}>Capture or select an image to detect streetlights!</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImageFromCamera}>
          <Text style={styles.buttonText}>Take a Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
          <Text style={styles.buttonText}>Select from Gallery</Text>
        </TouchableOpacity>
      </View>

      {imageUri ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      ) : (
        !isLoading && <Text style={styles.placeholderText}>No image selected</Text>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="#2ECC71" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity
          style={[styles.uploadButton, !imageUri && { backgroundColor: '#A5D6A7' }]}
          onPress={handleUpload}
          disabled={!imageUri}
        >
          <Text style={styles.uploadButtonText}>Upload & Analyze</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#3498DB',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
  placeholderText: {
    fontSize: 16,
    color: '#BDC3C7',
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#2ECC71',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default CameraScreen;
