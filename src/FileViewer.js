import React, { useState } from "react";
import "./FileViewer.css";

const FileViewer = ({ dir, file }) => {

    const [isLoaded, setIsLoaded] = useState(false);

    const fileExt = file.split(".").pop().toLowerCase();
    const imageTypes = ["jpg", "jpeg", "tiff"];
    const videoTypes = ["mov", "mp4"];

    return (
        <div className="file-view">
            {file !== "" && <div className={"loading-div " + (isLoaded ? "done-loading" : "")}>Loading...</div>}
            {file !== "" && imageTypes.includes(fileExt) &&
                <img
                    src={`/files/${dir}/${file}`}
                >

                </img>
            }
        </div>
    )
};

export default FileViewer;
