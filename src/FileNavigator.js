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
            selection: ""
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
                        parentDir: json.parent_dir || ""
                    });
                } else if (json.parent_dir) {
                    this.props.history.push(`/${json.parent_dir}`);
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
        console.log(file)
        this.setState({ selection: file });
    };

    componentDidUpdate = prevProps => {
        if (this.props.dir !== prevProps.dir) {
            this.fetchDirectoryContents(this.props.dir);
        }
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        return (
            this.props.dir !== nextProps.dir ||
            this.state.directories.length !== nextState.directories.length ||
            this.state.files.length !== nextState.files.length ||
            this.state.selection !== nextState.selection
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
                {(this.state.directories.length === 0 && this.state.files.length === 0) ?
                    <span>Loading...</span>
                    :
                    <>
                        <div className="item" onClick={dir !== "" ? () => this.updateDirectory(`${parentDir}`) : null}>
                            {dir !== "" ? <span>Back</span> : ""}
                        </div>
                        {directories.map((directory, i) => {
                            let link = dir ? `/${dir}/${directory}` : `/${directory}`;
                            return <div
                                className="item directory"
                                key={i}
                                to={link}
                                onClick={() => this.updateDirectory(link)}
                            >
                                <span>
                                    {directory}
                                </span>
                            </div>
                        })}
                        {files.map((file, i) => {
                            return <div
                                className={"item file " + (this.state.selection === file ? "selected" : "")}
                                key={i}
                                onClick={() => this.state.selection !== file ? this.setSelection(file) : null}
                            >
                                <span>
                                    {file}
                                </span>
                            </div>
                        })}
                    </>
                }
            </nav>
        )
    }
};

export default withRouter(FileNavigator);
