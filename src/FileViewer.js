import React from "react";
import "./FileViewer.css";

const FileViewer = ({ dir, file }) => {

    return (
        <div className="file-view">
            {file}
        </div>
    )
};

export default FileViewer;
