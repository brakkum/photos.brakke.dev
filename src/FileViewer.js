import React, { useState, useEffect } from "react";
import "./FileViewer.css";

const FileViewer = ({ dir, file }) => {

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
    }, [file]);

    const fileExt = file.split(".").pop().toLowerCase();
    const imageTypes = ["jpg", "jpeg", "tiff"];
    const videoTypes = ["mov", "mp4"];

    return (
        <div className="file-view">
            {file !== "" && <div className={"loading-div " + (isLoaded ? "loaded" : "")}>Loading...</div>}
            <div className="view-container">
                {file !== "" && imageTypes.includes(fileExt) &&
                    <img
                        className={"photo " + (isLoaded ? "loaded" : "")}
                        onLoad={() => setIsLoaded(true)}
                        src={`/files/${dir}/${file}`}
                    />
                }
            </div>
        </div>
    )
};

export default FileViewer;
