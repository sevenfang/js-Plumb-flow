import React, { Component } from "react";
import { RegularExpressConfigs }  from "../src";
import {proConfig} from "@/common/config";
import {Form, Select, Input, Modal, Icon, Row, Col, Button, message } from 'antd';
import axios from "axios/index";

export default class Test4 extends Component{
  constructor(props){
     super(props)
     this.state={
      visibleModals:false,
     }
     this.modalVisible = this.modalVisible.bind(this);
     this.handleOk = this.handleOk.bind(this);
     this.handleCancel = this.handleCancel.bind(this);
     this.change = this.change.bind(this);
     this.changeLanguage = this.changeLanguage.bind(this);
  }
  modalVisible(){
    this.setState({
      visibleModals: true,
    });
  }
  handleOk(e){
    console.log(e);
    this.setState({
      visibleModals: false,
    });
  };
  
  handleCancel(e){
    console.log(e);
    this.setState({
      visibleModals: false,
    });
  };
 change(){
 
 }
 changeLanguage(){
 
 }
  render() {
    return (
      <div>
        <Button type='primary' onClick={this.modalVisible}>弹框</Button>
        <Modal
         title="条件编辑"
         visible={this.state.visibleModals}
         onOk={this.handleOk}
         onCancel={this.handleCancel}
         // bodyStyle={{height:'700px'}}
         width={1200}
         okText='确定'
         cancelText='取消'
        >
          <RegularExpressConfigs
            onLanguageSelected={this.changeLanguage}
            onAceChange={this.change}
            mode={this.props.mode?this.props.mode:''}
            requestUrl={'/bank/condition/get'}
            params={{type:'workflow_gateway',scene:'cashByOrSell'}}
            headerToken={{name: "Authorization", token: proConfig.interfaceToken }}
          />
        </Modal>
      </div>
    )
  }
}