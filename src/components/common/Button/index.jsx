import React from "react";
import { Button as AntdButton } from "antd";


export default function Button(props) {
  return <AntdButton {...props}>{props.children}</AntdButton>;
}
