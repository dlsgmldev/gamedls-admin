import React from "react";

const FileUploader = ({ handleFile }) => {
  const hiddenFileInput = React.useRef(null);

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <div className="btn bg-blue text-white" onClick={handleClick}>
        <i class="fas fa-upload me-2" style={{ fontSize: 13 }}></i>Upload excel
      </div>
    </div>
  );
};

export default FileUploader;
