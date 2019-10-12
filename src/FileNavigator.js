import React, { useState, useEffect } from "react";
import "./FileNavigator.css";

const FileNavigator = ({ currentDirectory, selectedFile, setSelectedFile, setCurrentDirectory }) => {

    const [directories, setDirectories] = useState([]);
    const [files, setFiles] = useState([]);
    const [parentDir, setParentDir] = useState("");
    const [directoryIsLoaded, setDirectoryIsLoaded] = useState(false);

    // fetch directory contents whenever currentDirectory changes
    useEffect(() => {
        setDirectoryIsLoaded(false);
        fetchDirectoryContents(currentDirectory);
    }, [currentDirectory]);

    // when directories changes, we're in a new directory
    // if there's a child directory, scroll to it
    useEffect(() => {
        if (selectedFile && directoryIsLoaded) {
            let childIndex = directories.includes(selectedFile) ?
                directories.indexOf(selectedFile) :
                    directories.length + files.indexOf(selectedFile);
            if (childIndex !== -1) {
                fileRefs[childIndex].scrollIntoView({
                    block: "center"
                });
            }
        }
    }, [directoryIsLoaded, selectedFile]);

    // start at top of listing
    useEffect(() => {
        window.scrollTo({ x: 0, y: 0 });
    });

    const handleKeyPresses = event => {
        let isEmptyDirectory = files.length === 0 && directories.length === 0;
        let selectedFileIsDirectory = directories.includes(selectedFile);
        let selectedFileIsFile = files.includes(selectedFile);
        let selectionIndex = selectedFileIsDirectory ? directories.indexOf(selectedFile) :
            selectedFileIsFile ? files.indexOf(selectedFile) : -1;
        switch (event.keyCode) {
            // left arrow
            case 37: {
                setCurrentDirectory(parentDir, childDirectory);
            }
            break;
            // up arrow
            case 38: {
                if (isEmptyDirectory) {
                    return;
                }
                // nothing selected yet
                if (!selectedFileIsFile && !selectedFileIsDirectory) {
                    if (files.length > 0) {
                        setSelectedFile(files[files.length - 1]);
                    } else {
                        setSelectedFile(directories[directories.length - 1]);
                    }
                    return;
                }
                let thisTypeArray = selectedFileIsDirectory ? directories : files;
                let otherTypeArray = selectedFileIsDirectory ? files : directories;
                if (selectionIndex === -1 || selectionIndex === 0) {
                    if (otherTypeArray.length > 0) {
                        setSelectedFile(otherTypeArray[otherTypeArray.length - 1]);
                    } else {
                        setSelectedFile(thisTypeArray[thisTypeArray.length - 1]);
                    }
                } else {
                    setSelectedFile(thisTypeArray[selectionIndex - 1]);
                }
            }
            break;
            // right arrow
            case 39: {
                if (isEmptyDirectory) {
                    return;
                }
                if (selectedFileIsDirectory) {
                    setCurrentDirectory(`${currentDirectory}/${directories[selectionIndex]}`);
                }
            }
            break;
            // down arrow
            case 40: {
                if (isEmptyDirectory) {
                    return;
                }
                // nothing selected yet
                if (!selectedFileIsFile && !selectedFileIsDirectory) {
                    if (directories.length > 0) {
                        setSelectedFile(directories[0]);
                    } else {
                        setSelectedFile(files[0]);
                    }
                    return;
                }
                let thisTypeArray = selectedFileIsDirectory ? directories : files;
                let otherTypeArray = selectedFileIsDirectory ? files : directories;
                if (selectionIndex === thisTypeArray.length - 1) {
                    if (otherTypeArray.length > 0) {
                        setSelectedFile(otherTypeArray[0]);
                    } else {
                        setSelectedFile(thisTypeArray[0]);
                    }
                } else {
                    setSelectedFile(thisTypeArray[selectionIndex + 1]);
                }
            }
            break;
            default:
            break;
        }
    };

    // listen for up and down arrow
    useEffect(() => {
        document.addEventListener("keydown", handleKeyPresses);
        return () => document.removeEventListener("keydown", handleKeyPresses);
    });

    const fetchDirectoryContents = directory => {
        fetch(`/api/get-dir/`, {
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
    let fileRefs = [];

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
                                    (selectedFile === directory ? "selected" : "")
                                }
                                ref={el => fileRefs[i] = el}
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
                                ref={el => fileRefs[directories.length + i] = el}
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
                        <h2 style={{margin: "20px auto", textAlign: "center"}} className="item">Looks like this directory is empty!</h2>
                    :
                        <h2 style={{margin: "20px auto", textAlign: "center"}} className="item">Loading...</h2>
                }
            </nav>
        </>
    )
};

export default FileNavigator;
