import React, { Component } from "react";
import { ReverseJSPlumbFlow }  from "../src"
import {proConfig} from "@/common/config";

export default class Test2 extends Component{
    render() {
        return (
            <div>
                <ReverseJSPlumbFlow
                    id={"1102754972292542466"}
                    headerToken={{name: "Authorization", token: proConfig.interfaceToken }}
                />
            </div>
        )
    }
}