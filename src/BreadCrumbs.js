import "./BreadCrumbs.css";
import React from "react";

const BreadCrumbs = ({ currentDirectory, setCurrentDirectory, setSelectedFile }) => {

    let dirs = currentDirectory.split("/");

    return (
        <div className="bread-crumbs">
            <div className="bread-crumbs-container">
                {dirs.map((dir, i) => {
                    let elements = [];
                    // create link for current dir in crumbs
                    let link = dirs.filter((dir, j) => {
                        return j <= i;
                    }).join("/");
                    // Add link to root
                    if (i === 0 ) {
                        elements.push(<div
                            key={`${i}-start-bc`}
                            className="bread-crumb"
                            onClick={() => {
                                setSelectedFile("");
                                setCurrentDirectory("");
                            }}
                        >
                            /
                        </div>);
                        if (dirs[0] !== "") {
                            elements.push(<div key={`${i}-start-dv`} className="bread-crumb-divider has-text-grey-light">
                                &gt;
                            </div>);
                        }
                    }
                    elements.push(<div
                        key={`${i}-bc`}
                        className="bread-crumb"
                        onClick={i !== dirs.length - 1 ? () => {
                            setCurrentDirectory(link);
                            setSelectedFile("");
                        } : null}
                    >
                        {dir}
                    </div>);
                    if (i !== dirs.length - 1) {
                        elements.push(<div key={`${i}-dv`} className="bread-crumb-divider has-text-grey-light">
                            &gt;
                        </div>);
                    }
                    return elements;
                })}
            </div>
        </div>
    )
};

export default BreadCrumbs;
