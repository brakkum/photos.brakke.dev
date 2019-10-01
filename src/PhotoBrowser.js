import { withRouter } from "react-router-dom";
import FileList from "./FileList";
import React, { useState } from "react";

function PhotoBrowser({ match }) {

    let dir = match.params.dir || ""; // match.params.dir ? decodeURIComponent(match.params.dir) : "";
    let [selection, setSelection] = useState("");

    console.log(dir, selection)

    return(
        <>
            <FileList dir={dir} selection={selection} setSelection={setSelection} />
        </>
    )
}

export default withRouter(PhotoBrowser);
