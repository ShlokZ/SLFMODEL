import axios from 'axios';

// The FastAPI endpoint
const API_URL = 'http://192.168.29.151:8000/detect/';

// Function to upload an image using FormData
const uploadImage = async (imageUri) => {
  const formData = new FormData();

  // Create a file object to send with the request
  const file = {
    uri: imageUri,               // Image file URI (from the image picker)
    type: 'image/jpeg',          // File type (JPEG, PNG, etc.)
    name: 'image.jpg',           // File name (can be dynamic or static)
  };

  // Append the image file to FormData
  formData.append('file', file);

  try {
    // Send POST request to the FastAPI server with the image file
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Handle the successful response from the server
    console.log('Image uploaded successfully:', response.data);
    const { detections, image_url } = response.data;

    return {
      detections,   // Array of detection results
      imageUrl: `http://192.168.29.151:8000${image_url}`, // Full URL to the processed image
    };
  } catch (error) {
    console.error('Error uploading image:', error);

    // Handle errors
    if (error.response) {
      // The server responded with an error
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error('Request error:', error.request);
    } else {
      // Some other error occurred
      console.error('Error message:', error.message);
    }
  }
};

// Export the uploadImage function to use it in other parts of your app
export { uploadImage };
