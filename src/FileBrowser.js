import { withRouter } from "react-router-dom";
import FileNavigator from "./FileNavigator";
import React, { useState } from "react";
import BreadCrumbs from "./BreadCrumbs";
import FileViewer from "./FileViewer";
import "./FileBrowser.css";

function FileBrowser({ match, history }) {

    // current directory structure
    const currentDirectory = match.params.dir || ""; // match.params.dir ? decodeURIComponent(match.params.dir) : "";
    // current selected file
    const [selectedFile, setSelectedFile] = useState("");
    // last child directory

    // push new path to history
    const setCurrentDirectory = (path, childDirectory = "") => {
        path = path[0] !== "/" ? `/${path}` : path;
        setSelectedFile(childDirectory);
        history.push(path);
    };

    return(
        <div className="file-browser">
            <BreadCrumbs
                currentDirectory={currentDirectory}
                setCurrentDirectory={setCurrentDirectory}
                setSelectedFile={setSelectedFile}
            />
            <FileNavigator
                currentDirectory={currentDirectory}
                setCurrentDirectory={setCurrentDirectory}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
            />
            <FileViewer
                currentDirectory={currentDirectory}
                selectedFile={selectedFile}
            />
        </div>
    )
}

export default withRouter(FileBrowser);
