import { withRouter } from "react-router-dom";
import FileList from "./FileList";
import React from "react";

function PhotoBrowser({ match }) {

    let dir = match.params.dir ? decodeURIComponent(match.params.dir) : "";

    return(
        <>
            <FileList dir={dir} />
        </>
    )
}

export default withRouter(PhotoBrowser);
