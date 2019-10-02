import { withRouter } from "react-router-dom";
import FileNavigator from "./FileNavigator";
import React, { useState } from "react";
import BreadCrumbs from "./BreadCrumbs";
import FileViewer from "./FileViewer";
import "./FileBrowser.css";

function FileBrowser({ match }) {

    let dir = match.params.dir || ""; // match.params.dir ? decodeURIComponent(match.params.dir) : "";
    let [selection, setSelection] = useState("");

    console.log(`dir: ${dir}`);
    console.log(`sel: ${selection}`);

    return(
        <div className="file-browser">
            <BreadCrumbs />
            <FileNavigator dir={dir} selection={selection} setSelection={setSelection} />
            <FileViewer dir={dir} file={selection} />
        </div>
    )
}

export default withRouter(FileBrowser);