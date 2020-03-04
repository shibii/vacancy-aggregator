import React from "react";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";
import classNames from "classnames";
import api from "../services/api";

export default props => {
  const { id, header, url, source, ts, hidden, pinned } = props.vacancy;
  let history = useHistory();

  const handleHide = event => {
    event.preventDefault();
    if (hidden) {
      api
        .unhide(id)
        .then(res => props.onChange())
        .catch(err => history.push("/login"));
    } else {
      api
        .hide(id)
        .then(res => props.onChange())
        .catch(err => history.push("/login"));
    }
  };

  const handlePin = event => {
    event.preventDefault();
    if (pinned) {
      api
        .unpin(id)
        .then(res => props.onChange())
        .catch(err => history.push("/login"));
    } else {
      api
        .pin(id)
        .then(res => props.onChange())
        .catch(err => history.push("/login"));
    }
  };

  return (
    <div className="bg-brand-dark-700 p-2">
      <a href={url}>
        <div className="text-center text-brand-primary text-xs tracking-widest">
          <span>{source}</span>
          <span> &middot; </span>
          <Moment format="D/M/YYYY" date={ts} />
        </div>
        <div className="p-2 text-center truncate font-semibold text-brand-light-300 text-xl">
          {header}
        </div>
        <div className="text-center text-brand-primary">
          <span
            className={classNames(
              { "text-brand-tertiary": hidden },
              "hover:text-brand-light-100"
            )}
            onClick={handleHide}
          >
            {hidden ? "unhide" : "hide"}
          </span>
          <span> &middot; </span>
          <span
            className={classNames(
              { "text-brand-tertiary": pinned },
              "hover:text-brand-light-100"
            )}
            onClick={handlePin}
          >
            {pinned ? "unpin" : "pin"}
          </span>
        </div>
      </a>
    </div>
  );
};
