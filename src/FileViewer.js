import React, { useState, useEffect } from "react";
import "./FileViewer.css";

function FileViewer({ dir, file }) {

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
    }, [file]);

    const fileExt = file.split(".").pop().toLowerCase();
    const imageTypes = ["jpg", "jpeg", "tiff"];
    const videoTypes = ["mov", "mp4"];
    const isPhoto = imageTypes.includes(fileExt);
    const isVideo = videoTypes.includes(fileExt);

    return (
        <div className="file-view">
            {file !== "" && <div className={"loading-div " + (isLoaded ? "loaded" : "")}>Loading...</div>}
            {file !== "" && <div className={"get-link " + (isLoaded ? "loaded" : "")}>Link</div>}
            <div className="view-container">
                {isPhoto ?
                    <img
                        className={"photo " + (isLoaded ? "loaded" : "")}
                        onLoad={() => setIsLoaded(true)}
                        alt={file}
                        src={`/files/${dir}/${file}`}
                    />
                    :
                    isVideo ?
                        <video
                            className={"video " + (isLoaded ? "loaded" : "")}
                            key={file}
                            onLoadedMetadata={() => setIsLoaded(true)}
                            controls
                        >
                            <source src={`/files/${dir}/${file}`} type="video/mp4" />
                            <source src={`/files/${dir}/${file}`} type="video/mov" />
                        </video>
                    :
                    <h4>&lt;&lt; Pick Something!</h4>
                }
            </div>
        </div>
    )
};

export default FileViewer;
