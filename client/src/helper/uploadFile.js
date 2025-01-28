// const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`
const url = `https://api-ap.cloudinary.com/v1_1/chatcloudapp/auto/upload`;

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chat-app-file");

  const response = await fetch(url, {
    method: "post",
    body: formData,
  });
  const responseData = await response.json();

  return responseData;
};

export default uploadFile;
