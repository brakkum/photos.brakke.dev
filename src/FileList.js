import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import "./FileList.css";

function FileList({ dir, history }) {

    const [directories, setDirectories] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState("");

    // get new dir listing when dir changes
    useEffect(() => {
        fetch(`http://${window.location.hostname}:3001/api/get-dir`, {
            method: "post",
            body: JSON.stringify({
                dir: dir
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(json => {
                if (json.success) {
                    setDirectories([...json.directories.sort()]);
                    setFiles([...json.files.sort()]);
                } else if (json.parent_dir) {
                    history.push(`/${json.parent_dir}`);
                } else {
                    history.push("/");
                }
            });
    }, [dir, history]);

    return (
        <nav className="file-nav">
            {directories.map(directory => {
                return <a>{directory}</a>
            })}
            {files.map(file => {
                return <a>{file}</a>
            })}
        </nav>
    )
};

export default withRouter(FileList);
