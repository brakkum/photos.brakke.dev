import { withRouter } from "react-router-dom";
import "./FileNavigator.css";
import React from "react";

class FileNavigator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            directories: [],
            parentDir: "",
            files: [],
            selection: "",
            loaded: false
        };
    }

    fetchDirectoryContents = dir => {
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
                        parentDir: json.parent_dir || "",
                        loaded: true
                    });
                } else if (json.parent_dir) {
                    this.props.history.push(`/${json.parent_dir}`);
                    this.setState({ loaded: true });
                } else {
                    this.props.history.push("/");
                }
            });
    };

    updateDirectory = dir => {
        // make absolute path if not already
        dir = dir[0] === "/" ? dir : `/${dir}`;
        this.props.history.push(dir);
        this.props.setSelection("");
        this.setState({ selection: "" });
    };

    setSelection = file => {
        this.props.setSelection(file);
        this.setState({ selection: file });
        this.props.history.push(`#${file}`);
    };

    componentDidUpdate = prevProps => {
        if (this.props.dir !== prevProps.dir) {
            this.setState({ loaded: false });
            this.fetchDirectoryContents(this.props.dir);
        }
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        return (
            this.props.dir !== nextProps.dir ||
            this.state.directories.length !== nextState.directories.length ||
            this.state.files.length !== nextState.files.length ||
            this.state.selection !== nextState.selection ||
            this.state.loaded !== nextState.loaded
        );
    };

    componentDidMount = () => {
        let hash = window.location.hash;
        hash = hash.replace("#", "");
        this.setSelection(hash);
        this.setState({ loaded: false });
        this.fetchDirectoryContents(this.props.dir);
    };

    render() {
        let directories = this.state.directories;
        let parentDir = this.state.parentDir;
        let loaded = this.state.loaded;
        let files = this.state.files;
        let dir = this.props.dir;
        return (
            <>
                <div
                    className={"back-container item " + (dir !== "" ? "back-button hoverable" : "")}
                    onClick={dir !== "" ? () => this.updateDirectory(`${parentDir}`) : null}
                >
                    {dir !== "" ? <span>Back</span> : "/"}
                </div>
                <nav className="file-nav">
                    {loaded && (directories.length > 0 || files.length > 0) ?
                        <>
                            {directories.length > 0 && <div className="items-label">
                                    Directories
                                </div>
                            }
                            {directories.map((directory, i) => {
                                let link = dir ? `/${dir}/${directory}` : `/${directory}`;
                                return <div
                                    className="item directory hoverable"
                                    key={i}
                                    to={link}
                                    onClick={() => this.updateDirectory(link)}
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
                                    className={"item file hoverable " + (this.state.selection === file ? "selected" : "")}
                                    key={i}
                                    onClick={() => this.state.selection !== file ? this.setSelection(file) : null}
                                >
                                    <span>
                                        {file}
                                    </span>
                                </div>
                            })}
                        </>
                        :
                        loaded ?
                            <h2 style={{margin: "20px auto", textAlign: "center"}}>Looks like this directory is empty!</h2>
                        :
                            <h2 style={{margin: "20px auto", textAlign: "center"}}>Loading...</h2>
                    }
                </nav>
            </>
        )
    }
};

export default withRouter(FileNavigator);
