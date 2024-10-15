import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

const CreateNews = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [date, setDate] = useState(""); // Initialize date state
  const [editorState, setEditorState] = useState(EditorState.createEmpty()); // Initialize editor state

  // Function to format date as yyyy-mm-dd (HTML date input format)
  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Set current date as default
  useEffect(() => {
    const currentDate = formatDate(new Date());
    setDate(currentDate); // Set the date to current date on component mount
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent())); // Get HTML content from editor

    // Prepare the form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("date", date);
    formData.append("detail", content); 
    if (image) {
      formData.append("image", image); 
    }

    try {
      const response = await fetch("http://localhost:9999/api/news/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create news");
      }

      const result = await response.json();
      console.log("News created:", result);
    } catch (error) {
      console.error("Error creating news:", error);
    }
  };

  // Image upload callback for the editor (if needed)
  const uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ data: { link: reader.result } });
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Image Upload Section */}
          <div className="col-md-3">
            <div className="form-group">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Selected" className="img-thumbnail" />
              ) : (
                <div
                  className="img-thumbnail d-flex justify-content-center align-items-center"
                  style={{
                    height: "200px",
                    width: "100%",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  Add img
                </div>
              )}
              <input
                type="file"
                className="form-control mt-2"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Form Input Fields */}
          <div className="col-md-9">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                className="form-control"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)} // Allow manual changes to date
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="detail">Detail:</label>
              <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                editorStyle={{
                  height: "300px",
                  border: "1px solid #F1F1F1",
                  padding: "10px",
                }}
                onEditorStateChange={setEditorState}
                toolbar={{
                  options: [
                    "inline",
                    "blockType",
                    "fontSize",
                    "fontFamily",
                    "list",
                    "textAlign",
                    "link",
                    "emoji",
                    "image",
                    "remove",
                    "history",
                  ],
                  inline: {
                    inDropdown: false,
                    options: [
                      "bold",
                      "italic",
                      "underline",
                      "strikethrough",
                      "monospace",
                    ],
                  },
                  fontSize: {
                    options: [
                      8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96,
                    ],
                  },
                  fontFamily: {
                    options: [
                      "Arial",
                      "Georgia",
                      "Impact",
                      "Tahoma",
                      "Times New Roman",
                      "Verdana",
                    ],
                  },
                  image: {
                    uploadEnabled: true,
                    uploadCallback: uploadImageCallBack, // Image upload callback function
                    previewImage: true,
                    alt: { present: true, mandatory: false },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-primary btn-lg">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNews;
