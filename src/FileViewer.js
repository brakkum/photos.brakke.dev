import React, { useState, useEffect, useRef } from "react";
import "./FileViewer.css";

function FileViewer({ dir, file }) {

    const [isLoaded, setIsLoaded] = useState(false);
    const copyRef = useRef(null);
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        setTimeout(() => {
            setLinkCopied(false);
        }, 2000);
    }, [file]);

    const copyLinkToClipboard = () => {
        copyRef.current.select();
        console.log(copyRef.current.value)
        document.execCommand('copy');
        setLinkCopied(true);
        setTimeout(() => {
            setLinkCopied(false);
        }, 2000);
    };

    const fileExt = file.split(".").pop().toLowerCase();
    const imageTypes = ["jpg", "jpeg", "tiff"];
    const videoTypes = ["mov", "mp4"];
    const isPhoto = imageTypes.includes(fileExt);
    const isVideo = videoTypes.includes(fileExt);

    return (
        <div className="file-view">
            <input
                key={file}
                ref={copyRef}
                className="file-copy-link"
                defaultValue={`${window.location.host}/files/${dir}/${file}`}
            />
            {file !== "" &&
                <div
                    className={"loading-div " + (isLoaded ? "loaded" : "")}
                >
                    Loading...
                </div>
            }
            {file !== "" &&
                <div
                    className={"link-copied " + (linkCopied ? "copied" : "")}
                >
                    Link Copied
                </div>
            }
            {file !== "" && document.queryCommandSupported('copy') &&
                <div
                    onClick={copyLinkToClipboard}
                    className={"get-link button " + (isLoaded ? "loaded" : "")}
                >
                        Link
                </div>
            }
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
                        </video>
                    :
                    <h4>&lt;&lt; Pick Something!</h4>
                }
            </div>
        </div>
    )
};

export default FileViewer;
