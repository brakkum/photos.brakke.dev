import { withRouter } from "react-router-dom";
import React from "react";
import "./FileList.css";

class FileList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            directories: [],
            parentDir: "",
            files: [],
            sendingRequest: false
        };
    }

    _sendingRequest = false;

    fetchDirectoryContents = dir => {
        this._sendingRequest = true;
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
                    this.setState({
                        directories: json.directories.sort(),
                        files: json.files.sort(),
                        parentDir: json.parent_dir || ""
                    });
                } else if (json.parent_dir) {
                    this.props.history.push(`/${json.parent_dir}`);
                } else {
                    this.props.history.push("/");
                }
                this._sendingRequest = false;
            });
    };

    updateDirectory = dir => {
        // make absolute path if not already
        dir = dir[0] === "/" ? dir : `/${dir}`;
        this.props.history.push(dir);
        this.props.setSelection("");
    };

    componentDidUpdate = () => {
        this.fetchDirectoryContents(this.props.dir);
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        return (
            this.props.dir !== nextProps.dir ||
            this.state.directories.length !== nextState.directories.length ||
            this.state.files.length !== nextState.files.length
        );
    };

    componentDidMount = () => {
        this.fetchDirectoryContents(this.props.dir);
    };

    render() {
        let directories = this.state.directories;
        let parentDir = this.state.parentDir;
        let files = this.state.files;
        let dir = this.props.dir;
        return (
            <nav className="file-nav">
                {!this._sendingRequest ?
                    <span>r</span>
                    :
                    <>
                        {dir !== "" && <div onClick={() => this.updateDirectory(`${parentDir}`)}>Back</div>}
                        {directories.map((directory, i) => {
                            let link = dir ? `/${dir}/${directory}` : `/${directory}`;
                            return <div key={i} to={link} onClick={() => this.updateDirectory(link)}>{directory}</div>
                        })}
                        {files.map((file, i) => {
                            return <div key={i} onClick={() => this.props.setSelection(file)}>{file}</div>
                        })}
                    </>
                }
            </nav>
        )
    }
};

export default withRouter(FileList);
