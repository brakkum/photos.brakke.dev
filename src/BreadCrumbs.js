import { withRouter } from "react-router-dom";
import "./BreadCrumbs.css";
import React from "react";

const BreadCrumbs = ({ path, history, setSelection }) => {

    let dirs = path.split("/");

    return (
        <div className="bread-crumbs">
            <div className="bread-crumbs-container">
                {dirs.map((dir, i) => {
                    let elements = [];
                    let link = dirs.filter((dir, j) => {
                        return j <= i;
                    }).join("/");
                    if (i === 0 ) {
                        elements.push(<div
                            key={`${i}-start-bc`}
                            className="bread-crumb"
                            onClick={() => {
                                history.push(`/`);
                                setSelection("");
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
                            history.push(`/${link}`);
                            setSelection("");
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

export default withRouter(BreadCrumbs);
