import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const ResultsScreen = ({ route }) => {
  let detections = [];
  let processedImageUrl = '';

  // Safely access route parameters
  try {
    const params = route.params;
    detections = params?.detections || [];
    processedImageUrl = params?.processedImageUrl || '';
  } catch (error) {
    console.error('Error retrieving route parameters:', error);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detection Results</Text>

      {processedImageUrl ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: processedImageUrl }} style={styles.image} />
        </View>
      ) : (
        <Text style={styles.noImageText}>Processed image not available.</Text>
      )}

      {detections.length > 0 ? (
        <FlatList
          data={detections}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultTitle}>
                <Text style={styles.label}>Class:</Text> {item.class}
              </Text>
              <Text style={styles.confidence}>
                <Text style={styles.label}>Confidence:</Text> {item.confidence.toFixed(2)}
              </Text>
              <Text style={styles.coordinates}>
                <Text style={styles.label}>Coordinates:</Text> ({item.x1}, {item.y1}) - ({item.x2}, {item.y2})
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          getItemLayout={(data, index) => ({
            length: 80,
            offset: 80 * index,
            index,
          })}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResults}>No detections found.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  noImageText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2980B9',
    marginBottom: 5,
  },
  confidence: {
    fontSize: 16,
    fontWeight: '500',
    color: '#27AE60',
    marginBottom: 5,
  },
  coordinates: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  label: {
    fontWeight: 'bold',
    color: '#34495E',
  },
  separator: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 10,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResults: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#7F8C8D',
  },
});

export default ResultsScreen;
