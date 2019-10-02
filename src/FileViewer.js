import React, { useState } from "react";
import "./FileViewer.css";

const FileViewer = ({ dir, file }) => {

    const [isLoaded, setIsLoaded] = useState(false);

    const fileExt = file.split(".").pop().toLowerCase();
    const imageTypes = ["jpg", "jpeg", "tiff"];
    const videoTypes = ["mov", "mp4"];

    return (
        <div className="file-view">
            {file !== "" && <div className={"loading-div " + (isLoaded ? "loaded" : "")}>Loading...</div>}
            <div className="view-container">
                {file !== "" && imageTypes.includes(fileExt) &&
                    <img
                        className={"photo"}
                        onLoad={() => setIsLoaded(true)}
                        src={`/files/${dir}/${file}`}
                    >

                    </img>
                }
            </div>
        </div>
    )
};

export default FileViewer;
