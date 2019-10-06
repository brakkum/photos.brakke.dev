import React, { useState, useEffect, useRef } from "react";
import "./FileViewer.css";

function FileViewer({ currentDirectory, selectedFile }) {

    const [isLoaded, setIsLoaded] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const copyRef = useRef(null);

    useEffect(() => {
        setIsLoaded(false);
        setTimeout(() => {
            setLinkCopied(false);
        }, 1000);
    }, [selectedFile]);

    const copyLinkToClipboard = () => {
        copyRef.current.select();
        document.execCommand('copy');
        setLinkCopied(true);
        setTimeout(() => {
            setLinkCopied(false);
        }, 1000);
    };

    const fileExt = selectedFile.split(".").pop().toLowerCase();
    const imageTypes = ["jpg", "jpeg", "tiff"];
    const videoTypes = ["mov", "mp4"];
    const isPhoto = imageTypes.includes(fileExt);
    const isVideo = videoTypes.includes(fileExt);

    return (
        <div className="file-view">
            <input
                key={selectedFile}
                ref={copyRef}
                className="file-copy-link"
                defaultValue={`${window.location.host}/files/${currentDirectory}/${selectedFile}`}
            />
            {selectedFile !== "" &&
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
                                (linkCopied ? " is-danger " : " is-link is-outlined ") +
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
                        >
                            <source src={`/files/${currentDirectory}/${selectedFile}`} type="video/mp4" />
                        </video>
                    :
                    <h4>&lt;&lt; Pick Something!</h4>
                }
            </div>
        </div>
    )
};

export default FileViewer;
