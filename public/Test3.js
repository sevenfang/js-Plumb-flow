import React, { Component } from "react";
import { ForwardJSPlumbFlow, ExhibitionJSPlumbFlow }  from "../src"
import { proConfig } from "@/common/config";
import {Form, Select, Input, Modal, Icon, Row, Col, Button, message , Tooltip } from 'antd'

export default class Test1 extends Component{
    constructor(props) {
     super(props);
     // 组件数据
    //  this.state = {
    //    refresh:'',
    //  }
    //  this.refreshData=this.refreshData.bind(this)
    // }
    // refreshData(e){
    //  console.log('fdsfdsfadsa')
    //   this.setData({
    //    refresh:e,
    //   })
    }
    render() {
        return (
            <div>
             {/*<Modal*/}
              {/*title="流程回退"*/}
              {/*visible={true}*/}
              {/*bodyStyle={{width:'1000px'}}*/}
              {/*okText='确定'*/}
              {/*width={1000}*/}
              {/*cancelText='取消'*/}
             {/*>*/}
              {/*<ExhibitionJSPlumbFlow*/}
               {/*// requestUrl={"http://192.168.3.128:8090/bank/bpmn/getScheduleByProcessInstanceId"}*/}
               {/*// requestUrlHashKey={"processInstanceId"}*/}
               {/*requestUrl={"http://192.168.3.128:8090/bank/bpmn/getScheduleByTaskId"}*/}
               {/*requestUrlHashKey={"taskId"}*/}
               {/*id={"230040"}*/}
               {/*headerToken={{name: "Authorization", token: proConfig.interfaceToken }}*/}
               {/*sign={'claimTasks'}*/}
              {/*/>*/}
             {/*</Modal>*/}
                <ExhibitionJSPlumbFlow
                    // requestUrl={"http://192.168.3.128:8090/bank/task/getStartParams"}
                    // requestUrlHashKey={"taskId"}
                    // requestUrl={"http://192.168.3.217:8090/bank/bpmn/getScheduleByProcessInstanceId"}
                    // requestUrlHashKey={"processInstanceId"}
                    requestUrl={"http://192.168.3.217:8090/bank/bpmn/getScheduleByTaskId"}
                    requestUrlHashKey={"taskId"}
                    id={"35012"}
                    headerToken={{name: "Authorization", token: proConfig.interfaceToken }}
                    // sign={'claimTasks'}
                />
                {/*<ExhibitionJSPlumbFlow*/}
                    {/*requestUrl={"http://192.168.3.217:8090/bank/bpmn/getScheduleByProcessInstanceId"}*/}
                    {/*requestUrlHashKey={"processInstanceId"}*/}
                    {/*id={"230026"}*/}
                    {/*headerToken={{name: "Authorization", token: proConfig.interfaceToken }}*/}
                {/*/>*/}
                {/*<ForwardJSPlumbFlow*/}
                    {/*headerToken={{name: "Authorization", token: proConfig.interfaceToken }}*/}
                {/*/>*/}
            </div>
        )
    }
}