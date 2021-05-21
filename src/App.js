import "./App.css";
import { useState } from "react";
import ImageUploader from "react-images-upload";
import { assertExpressionStatement } from "@babel/types";
import Axios from "axios";

const UploadComponent = props => (
  <form>
    <label>
      File Upload URL:
      <input
        id="urlInput"
        type="text"
        onChange={props.onUrlChange}
        value={props.url}
      />
    </label>
    <ImageUploader
      key="image-uploader"
      withIcon={true}
      singelImage={true}
      withPreview={true}
      label="Maximum File size should be 5MB"
      buttonText="Choose an image"
      onChange={props.onImage}
      imgExtension={[".jpg", ".png", ".jpeg"]}
      maxFileSize={5242880}
    ></ImageUploader>
  </form>
);

const App = () => {
  const [progress, setProgress] = useState("getUpload");
  const [url, setImageUrl] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("");

  const onUrlChange = e => {
    setImageUrl(e.target.value);
  };

  const onImage = async (failedImages, successImages) => {
    if (!url) {
      console.log("missing Url");
      setErrorMessage("missing a url to upload");
      setProgress("uploadError");
      return;
    }

    setProgress("uploading");

    try {
      console.log("succesImages", successImages);
      const parts = successImages[0].split(";");
      const mime = parts[0].split(":")[1];
      const name = parts[1].split("=")[1];
      const data = parts[2];

      const res = await Axios.post(url, { mime, name, image: data });
      setImageUrl(res.data.imageURL);

      setProgress("uploaded");
    } catch (error) {
      console.log("error in upload", error);
      setErrorMessage("Upload error");
      setProgress("uploadError");
    }
  };

  const content = () => {
    switch (progress) {
      case "getUpload":
        return (
          <UploadComponent
            onUrlChange={onUrlChange}
            onImage={onImage}
            url={url}
          />
        );
      case "uploading":
        return <h2>Uploading...</h2>;
      case "uploaded":
        return <img src={url} alt="uploaded" />;
      case "uploadError":
        return (
          <>
            <div>Error Message = {errorMessage}</div>
            <UploadComponent
              onUrlChange={onUrlChange}
              onImage={onImage}
              url={url}
            />
          </>
        );
    }
  };

  return (
    <div className="App">
      <h1>Image Upload website</h1>
      {content()}
    </div>
  );
};

export default App;
