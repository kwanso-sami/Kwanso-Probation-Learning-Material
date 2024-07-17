import React from "react";
import {useRouteError} from 'react-router-dom'

function ErrorComponent() {
    let error = useRouteError();
    console.error(error);
    return <div>Error: {error}</div>;
  }
export default ErrorComponent;
