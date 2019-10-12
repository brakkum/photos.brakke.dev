import React, { useState, useEffect } from "react";
import copy from "copy-to-clipboard";
import "./FileViewer.css";

function FileViewer({ currentDirectory, selectedFile }) {

    const [isLoaded, setIsLoaded] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        setTimeout(() => {
            setLinkCopied(false);
        }, 1000);
    }, [selectedFile]);

    const copyLinkToClipboard = () => {
        copy(`${window.location.host}/files/${currentDirectory}/${selectedFile}`);
        setLinkCopied(true);
        setTimeout(() => {
            setLinkCopied(false);
        }, 1000);
    };

    const fileExt = selectedFile.split(".").pop().toLowerCase();
    const imageTypes = ["jpg", "jpeg", "tiff", "png"];
    const videoTypes = ["mov", "mp4"];
    const isPhoto = imageTypes.includes(fileExt);
    const isVideo = videoTypes.includes(fileExt);

    return (
        <div className="file-view">
            {selectedFile !== "" && (isPhoto || isVideo) &&
                <>
                    <div
                        className={"loading-div " + (isLoaded ? "loaded" : "")}
                    >
                        Loading...
                    </div>
                    <div
                        className={"link-copied " + (linkCopied ? "copied" : "")}
                    >
                        Link Copied
                    </div>
                    {document.queryCommandSupported('copy') &&
                        <button
                            onClick={copyLinkToClipboard}
                            className={"get-link button " +
                                (linkCopied ? " is-danger " : " is-light is-outlined ") +
                                (isLoaded ? " loaded " : "")
                            }
                        >
                                Link
                        </button>
                    }
                </>
            }
            <div className="view-container">
                {isPhoto ?
                    <img
                        className={"photo " + (isLoaded ? "loaded" : "")}
                        onLoad={() => setIsLoaded(true)}
                        alt={selectedFile}
                        src={`/files/${currentDirectory}/${selectedFile}`}
                    />
                    :
                    isVideo ?
                        <video
                            className={"video " + (isLoaded ? "loaded" : "")}
                            key={selectedFile}
                            onLoadedMetadata={() => setIsLoaded(true)}
                            controls
                            autoPlay={true}
                        >
                            <source src={`/files/${currentDirectory}/${selectedFile}`} type="video/mp4" />
                        </video>
                    :
                    <>
                        <h4 className="is-size-4 has-text-dark">You haven't selected anything!</h4>
                        <h5 className="is-size-5 has-text-dark">(You can use the arrow keys, too)</h5>
                    </>
                }
            </div>
        </div>
    )
};

export default FileViewer;
