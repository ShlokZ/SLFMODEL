import axios from 'axios';

// The FastAPI endpoint
const API_URL = 'https://shlokz-yolopt.hf.space/detect/';

// Function to upload an image using FormData
const uploadImage = async (imageUri) => {
  const formData = new FormData();

  // Create a file object to send with the request
  const file = {
    uri: imageUri,               // Image file URI (from the image picker)
    type: 'image/jpeg',          // File type (adjust based on your image type)
    name: 'image.jpg',           // File name (can be dynamic or static)
  };

  // Append the image file to FormData
  formData.append('file', file);

  try {
    // Send POST request to FastAPI server
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Extract detections and base64 image from response
    const { detections, image_url } = response.data;

    // Return the detections and the base64 image (no need for constructing URLs)
    return {
      detections,  
      imageUrl: image_url, // This is already a base64 data URI like "data:image/jpeg;base64,..."
    };
  } catch (error) {
    console.error('Error uploading image:', error);

    // Error handling
    if (error.response) {
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
  }
};

export { uploadImage };
