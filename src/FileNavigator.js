import React, { useState, useEffect } from "react";
import "./FileNavigator.css";

const FileNavigator = ({ currentDirectory, selectedFile, setSelectedFile, setCurrentDirectory, lastChildDirectory }) => {

    const [directories, setDirectories] = useState([]);
    const [files, setFiles] = useState([]);
    const [parentDir, setParentDir] = useState("");
    const [directoryIsLoaded, setDirectoryIsLoaded] = useState(false)

    useEffect(() => {
        fetchDirectoryContents(currentDirectory);
    }, [currentDirectory]);

    const fetchDirectoryContents = directory => {
        fetch(`http://${window.location.hostname}:3001/api/get-dir`, {
            method: "post",
            body: JSON.stringify({
                dir: directory
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(json => {
                if (json.success) {
                    setDirectories(json.directories.sort());
                    setFiles(json.files.sort());
                    setParentDir(json.parent_dir || "");
                    setDirectoryIsLoaded(true);
                } else if (json.parent_dir) {
                    setCurrentDirectory(json.parent_dir)
                } else {
                    setCurrentDirectory("/");
                }
            });
    };

    let childDirectory = currentDirectory.split("/").pop();

    return (
        <>
            <div
                className={"back-container item " + (currentDirectory !== "" ? "back-button hoverable" : "")}
                onClick={currentDirectory !== "" ?
                    () => setCurrentDirectory(parentDir, childDirectory)
                    : null
                }
            >
                {currentDirectory !== "" ? <span>Back</span> : "/"}
            </div>
            <nav className="file-nav">
                {directoryIsLoaded && (directories.length > 0 || files.length > 0) ?
                    <>
                        {directories.length > 0 && <div className="items-label">
                                Directories
                            </div>
                        }
                        {directories.map((directory, i) => {
                            let link = currentDirectory ? `/${currentDirectory}/${directory}` : `/${directory}`;
                            return <div
                                className={"item directory hoverable " +
                                    (lastChildDirectory === directory ? "selected" : "")
                                }
                                key={i}
                                onClick={() => setCurrentDirectory(link)}
                            >
                                <span>
                                    {directory}
                                </span>
                            </div>
                        })}
                        {files.length > 0 && <div className="items-label">
                                Files
                            </div>
                        }
                        {files.map((file, i) => {
                            return <div
                                className={"item file hoverable " + (selectedFile === file ? "selected" : "")}
                                key={i}
                                onClick={() => selectedFile !== file ? setSelectedFile(file) : null}
                            >
                                <span>
                                    {file}
                                </span>
                            </div>
                        })}
                    </>
                    :
                    directoryIsLoaded ?
                        <h2 style={{margin: "20px auto", textAlign: "center"}}>Looks like this directory is empty!</h2>
                    :
                        <h2 style={{margin: "20px auto", textAlign: "center"}}>Loading...</h2>
                }
            </nav>
        </>
    )
};

export default FileNavigator;
