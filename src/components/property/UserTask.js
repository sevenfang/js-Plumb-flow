import React, {Component, Fragment} from "react";
import HocFormComponent from "../HocUI/HocFormComponent";
import HocFormPagination from "../HocUI/component/HocFormPagination";
import { Input, Radio, Select, Tag, Modal,Button,Tabs} from 'antd';
import AceEditor from 'react-ace';
import _ from "lodash";
import { RegularExpressConfigs }  from "../../../src";
import {fromJS} from "immutable";
import Util from "../../common/Util";
import PropertyUsersGroupSelectModal from "./component/PropertyUsersGroupSelectModal";
import {proConfig} from "@/common/config";


const Option = Select.Option;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const children = [];
for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}


@HocFormComponent()
@HocFormPagination()
class UserTask extends Component{
    constructor(props){
        super(props);
        this.state = {
            candidateUsersValue:[],
            userTaskRuleExpresstion:[],//保存所有用户任务节点规则表达式的内容
            RuleLanguageValue:'activiti',
            EditValue:'',//编辑器输入的内容
            rule:false,//规则模态框弹出隐藏
            userTaskArrayMedia:[],
            visibleUsersArray:[],
            visibleUsers: false,
            visibleGroups: false,
            userTaskClicked:[],
            userTaskArray:[],
            value: 1,
            sequentialType:null,//多会签的类型
            sequentialData:{},//多会签对应的节点信息
        };
        this.handleChangeUser = this.handleChangeUser.bind(this);
        this.handleChangeGroup = this.handleChangeGroup.bind(this);
        this.inputChangeRender = this.inputChangeRender.bind(this);
        this.handleBlurUser = this.handleBlurUser.bind(this);
        this.handleBlurGroups = this.handleBlurGroups.bind(this);
        this.usersSelectFocus = this.usersSelectFocus.bind(this);
        this.groupsSelectFocus = this.groupsSelectFocus.bind(this);
        this.assigneeSelectFocus = this.assigneeSelectFocus.bind(this);
        this.handleCancelUsers = this.handleCancelUsers.bind(this);
        this.handleOKUsers = this.handleOKUsers.bind(this);
        this.handleCallBack = this.handleCallBack.bind(this);
        this.handleCancelGroups = this.handleCancelGroups.bind(this);
        this.handleOKGroups = this.handleOKGroups.bind(this);
        this.candiUserAndCandiGoroupCommonPart=this.candiUserAndCandiGoroupCommonPart.bind(this);
        this.onChangeTab=this.onChangeTab.bind(this);
        this.handleOkAssignee=this.handleOkAssignee.bind(this);
        this.handleCancelAssignee =this.handleCancelAssignee.bind(this);
        this.rulesModalCancel =this.rulesModalCancel.bind(this);
        this.rulesModalOk =this.rulesModalOk.bind(this);
        this.regularCongifModal =this.regularCongifModal.bind(this);
        this.RuleLanguageSelection =this.RuleLanguageSelection.bind(this);
        this.onChangeEditValue =this.onChangeEditValue.bind(this);
        this.handleCancelAssigneeGroup =this.handleCancelAssigneeGroup.bind(this);
        this.handleOkAssigneeGroup =this.handleOkAssigneeGroup.bind(this);
        this.changeTabUpdataChar =this.changeTabUpdataChar.bind(this);
    }
 
    componentDidMount(){
    
    }
    componentWillReceiveProps(nextProps){
        for(let i=0;i<nextProps.data4.toJS().nodeData.length;i++){
           if(nextProps.data4.toJS().nodeData[i].id===nextProps.propertyData.toJS().id){
              this.setState({
                sequentialType:nextProps.data4.toJS().nodeData[i].isSequential,
                sequentialData:nextProps.data4.toJS().nodeData[i],
              })
           }
        }
    }
    /**
     * 输入事件回调+更新redux
     */
    inputChangeRender(renderValue, keyName) {
        const { propertyData, handleSetProperty } = this.props;
        let propertyDataToJs = propertyData.toJS();
        propertyDataToJs[keyName] = renderValue;
        /**
         * 这里propertyData属性数据源也需要动态更新
         */
        handleSetProperty(fromJS(propertyDataToJs));
    }
    /**
     * 失焦事件回调+更新redux
     */
    inputBlurRender( keyName ) {
        const { propertyData, data4, handleSetDataSource, handleSetReRender } = this.props;
        let dataSourceToJs = data4.toJS();
        let propertyDataToJs = propertyData.toJS();
        let nodeDataItem = dataSourceToJs.nodeData.find((item) => {
            return item.id === propertyDataToJs.id;
        });
        nodeDataItem[keyName] = propertyDataToJs[keyName];
        /**
         * 操作完毕后设置下数据源，方便修改整体虚拟dom逻辑
         */
        handleSetDataSource(fromJS(dataSourceToJs));
        /**
         * 更新全局reRender变量，触发data4源数据重新循环渲染
         * 因为节点的点击事件需要重新循环数据源去拿到最新的info
         */
        handleSetReRender({
            hash: Util.randHash()
        });
    }

    /**
     * User input框输入回调事件
     */
    handleChangeUser(event){
        this.inputChangeRender(event.target.value, "candidateUsers");
    }
    /**
     * User input框失焦回调事件
     */
    handleBlurUser(event) {
        this.inputBlurRender(event.target.value, "candidateUsers");
    }
    /**
     * Group input框输入回调事件
     */
    handleChangeGroup(event){
        this.inputChangeRender(event.target.value, "candidateGroups");
    }
    /**
     * Group input框失焦回调事件
     */
    handleBlurGroups(event) {
        this.inputBlurRender(event.target.value, "candidateGroups");
    }




    /**
     * users select focus
     **/
    usersSelectFocus(event) {
        this.usersRefs.blur();
        // let userTaskClicked = [];
        // let userTaskArray = [];
        //
        // for(let i =0;i<this.props.nodeListJs.length;i++){
        //   if(this.props.nodeListJs[i].props.info.type==='userTask'){
        //    if(this.props.nodeListJs[i].key===this.usersRefs.props.id){
        //      this.props.nodeListJs[i]['isModalVisible']={id:this.usersRefs.props.id,value:true};
        //      userTaskClicked.push(this.props.nodeListJs[i])
        //    }
        //    userTaskArray.push(this.props.nodeListJs[i])
        //   }
        // }
        //
        // if(this.state.userTaskArrayMedia.length===0){
        //    this.setState({
        //      userTaskArrayMedia:userTaskArray,
        //    })
        // }else{
        //  for(let i=0;i<userTaskArray.length;i++){
        //    let judge = false;
        //    for(let j=0;j<this.state.userTaskArrayMedia.length;j++){
        //      if(this.state.userTaskArrayMedia[j].key===userTaskArray[i].key){
        //        judge=true;
        //      }
        //    }
        //    if(!judge){
        //     this.state.userTaskArrayMedia.push(userTaskArray[i])
        //    }
        //  }
        //  this.setState({
        //    userTaskArrayMedia:this.state.userTaskArrayMedia,
        //   userTaskArray: userTaskArray,
        //   userTaskClicked:userTaskClicked,
        //  })
        // }
        this.candiUserAndCandiGoroupCommonPart('CandidateUsers');
        // this.setState( () => ({
        //   visibleUsers:true,
        // }))
    }
    /**
     * groups select focus
     **/
    groupsSelectFocus() {
        this.groupsRefs.blur();
        this.candiUserAndCandiGoroupCommonPart('CandidateGroups');
        // this.setState( () => ({
        //     visibleGroups: true,
        // }))
    }
 

 
    /**
     * assignee select focus
     **/
    assigneeSelectFocus(type) {
      if(type==='a'){
        this.assigneeRefs.blur();
      }else if(type==='b'){
        this.assigneeRefs2.blur();
      }else if(type==='c'){
        this.assigneeRefs3.blur();
      }
      this.candiUserAndCandiGoroupCommonPart('assignee');
    }
 
 /**
  * assigneeGroup select focus
  **/
  assigneeGroupSelectFocus(type) {
    if(type==='a'){
      this.assigneeGroupRefs.blur();
    }else if(type==='b'){
      this.assigneeGroupRefs2.blur();
    }
    this.candiUserAndCandiGoroupCommonPart('assigneeGroup');
  }
    /*
    * 候选用户和候选用户组点击弹框选择项互不干扰
    * */
    candiUserAndCandiGoroupCommonPart(type){
     let userTaskClicked = [];
     let userTaskArray = [];
 
     for(let i =0;i<this.props.nodeListJs.length;i++){
       if(this.props.nodeListJs[i].props.info.type==='userTask'){
         if(this.props.nodeListJs[i].key===this.usersRefs.props.id){
           this.props.nodeListJs[i]['isModalVisible']={id:this.usersRefs.props.id,value:true,type:type===''?'':type};
           this.props.nodeListJs[i]['isSequential']=this.state.value===1?null:(this.state.value===2);
           userTaskClicked.push(this.props.nodeListJs[i])
         }
         userTaskArray.push(this.props.nodeListJs[i])
       }
     }
 
     if(this.state.userTaskArrayMedia.length===0){
       this.setState({
         userTaskArrayMedia:userTaskArray,
         userTaskArray: userTaskArray,
         userTaskClicked:userTaskClicked,
       })
     }else{
       for(let i=0;i<userTaskArray.length;i++){
         let judge = false;
         for(let j=0;j<this.state.userTaskArrayMedia.length;j++){
           if(this.state.userTaskArrayMedia[j].key===userTaskArray[i].key){
             judge=true;
           }
         }
         if(!judge){
           this.state.userTaskArrayMedia.push(userTaskArray[i])
         }
       }
       this.setState({
         userTaskArrayMedia:this.state.userTaskArrayMedia,
         userTaskArray: userTaskArray,
         userTaskClicked:userTaskClicked,
       })
     }
    }
    

    /**
     * users modal cancel回调事件
     */
    handleCancelUsers() {
       this.state.userTaskClicked[0].isModalVisible.value=false;
       this.setState( () => ({
         userTaskClicked:this.state.userTaskClicked,
       }))
    }
   /**
    *  Users modal框点击确定回调
    **/
   handleOKUsers (event) {
    this.state.userTaskClicked[0].isModalVisible.value=false;
    this.setState( () => ({
      userTaskClicked:this.state.userTaskClicked,
    }))
   }

    /**
     * groups modal cancel回调事件
     */
    handleCancelGroups() {
        this.state.userTaskClicked[0].isModalVisible.value=false;
        this.setState( () => ({
            userTaskClicked:this.state.userTaskClicked,
        }))
    }
 
   /**
    *  Users modal框点击确定回调
    **/
   handleOKGroups () {
    this.state.userTaskClicked[0].isModalVisible.value=false;
    this.setState( () => ({
      userTaskClicked:this.state.userTaskClicked,
    }))
   }

   /**
    * Assignee modal cancel回调事件
    */
   handleOkAssignee() {
    this.state.userTaskClicked[0].isModalVisible.value=false;
    this.setState( () => ({
      userTaskClicked:this.state.userTaskClicked,
    }))
   }
  /**
   * AssigneeGroup modal cancel回调事件
   */
  handleOkAssigneeGroup() {
   this.state.userTaskClicked[0].isModalVisible.value=false;
   this.setState( () => ({
     userTaskClicked:this.state.userTaskClicked,
   }))
  }
   /**
    *  Assignee modal框点击确定回调
    **/
   handleCancelAssignee (event) {
    this.state.userTaskClicked[0].isModalVisible.value=false;
    this.setState( () => ({
      userTaskClicked:this.state.userTaskClicked,
    }))
   }
 
   /**
    *  Assignee modal框点击确定回调
    **/
   handleCancelAssigneeGroup (event) {
     this.state.userTaskClicked[0].isModalVisible.value=false;
     this.setState( () => ({
       userTaskClicked:this.state.userTaskClicked,
     }))
   }


    handleCallBack( value, type, index ) {
        console.log('userTask',value,type,index);
        const { data4, propertyData, handleSetProperty, handleSetReRender, handleSetDataSource } = this.props;
        let dataSourceToJs = data4.toJS();
        let propertyDataToJs = propertyData.toJS();
        let nodeDataItem = dataSourceToJs.nodeData.find((item) => {
            return item.id === propertyDataToJs.id;
        });
        let valueArray = [];
        value.forEach( (item) => {
            valueArray.push(
                item.id
            )
        });
        if( type === "users" ) {
            nodeDataItem["candidateUsers"] = valueArray.join(",");
            nodeDataItem["candidateUsersArray"] = value;
            propertyDataToJs["candidateUsersArray"] = value;
        } else if( type === "groups" ) {
            nodeDataItem["candidateGroups"] = valueArray.join(",");
            nodeDataItem["candidateGroupsArray"] = value;
            propertyDataToJs["candidateGroupsArray"] = value;
        } else if( type === "assignee" ) {
            nodeDataItem["assignee"] = valueArray.join(",");
            nodeDataItem["assigneeArray"] = value;
            propertyDataToJs["assigneeArray"] = value;
            if(nodeDataItem.isSequential===null){
              nodeDataItem.assigneeArrayOther.splice(0,1,{type:null,value:value})
            }
            else if(nodeDataItem.isSequential){
              nodeDataItem.assigneeArrayOther.splice(1,1,{type:true,value:value})
            }
            else if(!nodeDataItem.isSequential){
              nodeDataItem.assigneeArrayOther.splice(2,1,{type:false,value:value})
            }
        }else if(type==='ruleLanguage'){
          nodeDataItem["completionCondition"] = value[1];
          nodeDataItem["completionConditionType"] = value[0];
          if(nodeDataItem.isSequential){
            nodeDataItem.completionConditionArray.splice(0,1,{type:true,value:value})
          }
          else if(!nodeDataItem.isSequential){
            nodeDataItem.completionConditionArray.splice(1,1,{type:false,value:value})
          }
        } else if( type === "assigneeGroup" ) {
          nodeDataItem["assigneeGroup"] = valueArray.join(",");
          nodeDataItem["assigneeGroupArray"] = value;
          propertyDataToJs["assigneeGroupArray"] = value;
          // nodeDataItem["assigneeGroupArray"] = value;
          // propertyDataToJs["candidateAssigneeArrayGroup"] = value;
          if(nodeDataItem.isSequential){
            nodeDataItem.assigneeGroupArrayOther.splice(1,1,{type:true,value:value})
          }
          else if(!nodeDataItem.isSequential){
            nodeDataItem.assigneeGroupArrayOther.splice(2,1,{type:false,value:value})
          }
        }
        /**
         * 这里propertyData属性数据源也需要动态更新
         */
        handleSetProperty(fromJS(propertyDataToJs));
        handleSetDataSource(fromJS(dataSourceToJs));
        /**
         * 更新全局reRender变量，触发data4源数据重新循环渲染
         * 因为节点的点击事件需要重新循环数据源去拿到最新的info
         */
     
        handleSetReRender({
            hash: Util.randHash()
        });
    }
  //切换会签标签时，动态更新data4里面节点的属性值
    changeTabUpdataChar(char,type){
     let valueArray = [];
     if(type===1){
       valueArray = [];
       char[0].value.forEach((itemList)=>{
         valueArray.push(itemList.id);
       })
     }else if(type===2){
       valueArray = [];
       char[1].value.forEach((itemList)=>{
         valueArray.push(itemList.id);
       })
     }else if(type===3){
       valueArray = [];
       char[2].value.forEach((itemList)=>{
         valueArray.push(itemList.id);
       })
     }
     return valueArray;
    }
 
   //会签选择
   onChangeTab(event){
     const { data4, propertyData, handleSetProperty, handleSetReRender, handleSetDataSource } = this.props;
     let dataSourceToJs = data4.toJS();
     let propertyDataToJs = propertyData.toJS();
     for(let i=0;i<dataSourceToJs.nodeData.length;i++){
       if(dataSourceToJs.nodeData[i].id===propertyDataToJs.id){
         dataSourceToJs.nodeData[i]['isSequential']=event===1?null:(event===2);
         dataSourceToJs.nodeData[i]['completionConditionType']=event===2?dataSourceToJs.nodeData[i].completionConditionArray[0].value[0]:(event===3?dataSourceToJs.nodeData[i].completionConditionArray[1].value[0]:'');
         dataSourceToJs.nodeData[i]['completionCondition']=event===2?dataSourceToJs.nodeData[i].completionConditionArray[0].value[1]:(event===3?dataSourceToJs.nodeData[i].completionConditionArray[1].value[1]:'');
         dataSourceToJs.nodeData[i]['assignee']=this.changeTabUpdataChar(this.state.sequentialData.assigneeArrayOther,event).join(",");
         dataSourceToJs.nodeData[i]['assigneeGroup']=this.changeTabUpdataChar(this.state.sequentialData.assigneeGroupArrayOther,event).join(",");
       }
     }
     handleSetDataSource(fromJS(dataSourceToJs));
     this.setState({
       sequentialType:event===1?null:(event===2),
       value: event,
       // rule:false,
     });
     
   }
    /**
     * 从redux的propertyData取值，渲染select users组件value
     * 由于字段的特殊性，展现给用户的是name字段，而传递给后台的是id字段
     * @returns {Array}
     */
    renderSelectUsersValue( type ) {
        const { propertyData } = this.props;
        let propertyDataToJs = propertyData.toJS();
        let candidateUsersValue = [];
        if( type === "users" ) {
            if( propertyDataToJs.candidateUsersArray ) {
                propertyDataToJs.candidateUsersArray.forEach( (item) => {
                    candidateUsersValue.push(item.name);
                });
            }
        } else if ( type === "groups" ) {
            if( propertyDataToJs.candidateGroupsArray ) {
                propertyDataToJs.candidateGroupsArray.forEach( (item) => {
                    candidateUsersValue.push(item.name);
                });
            }
        } else if ( type === "assignee" ) {
           if(this.state.sequentialData.assigneeArrayOther) {
               if(this.state.sequentialType===null){
                this.state.sequentialData.assigneeArrayOther[0].value.forEach((itemList)=>{
                   candidateUsersValue.push(itemList.name);
                 })
               }else if(this.state.sequentialType){
                this.state.sequentialData.assigneeArrayOther[1].value.forEach((itemList)=>{
                   candidateUsersValue.push(itemList.name);
                 })
               }else if(!this.state.sequentialType){
                this.state.sequentialData.assigneeArrayOther[2].value.forEach((itemList)=>{
                   candidateUsersValue.push(itemList.name);
                 })
               }
           }
        }else if ( type === "assigneeGroup" ) {
          if(this.state.sequentialData.assigneeArrayOther) {
            if(this.state.sequentialType===null){
              this.state.sequentialData.assigneeGroupArrayOther[0].value.forEach((itemList)=>{
                candidateUsersValue.push(itemList.name);
              })
            }else if(this.state.sequentialType){
              this.state.sequentialData.assigneeGroupArrayOther[1].value.forEach((itemList)=>{
                candidateUsersValue.push(itemList.name);
              })
            }else if(!this.state.sequentialType){
              this.state.sequentialData.assigneeGroupArrayOther[2].value.forEach((itemList)=>{
                candidateUsersValue.push(itemList.name);
              })
            }
          }
        }
     // console.log(candidateUsersValue);
      //   for(let i=0;i<candidateUsersValue.length;i++){
      //     if(candidateUsersValue[i]===''){
      //       candidateUsersValue.splice(i,1);
      //     }
      //   }
      // console.log(candidateUsersValue);
        return candidateUsersValue;
    }
  
    
    //点击select弹出规则配置模态框
    regularCongifModal(){
     const { data4,propertyData} = this.props;
     let data = {};
     for(let i=0;i<data4.toJS().nodeData.length;i++){
        if(data4.toJS().nodeData[i].id===propertyData.toJS().id){
          data=data4.toJS().nodeData[i];
        }
     }
     if(data.isSequential){
       this.setState({
         RuleLanguageValue:data.completionConditionArray[0].value[0],
         EditValue:data.completionConditionArray[0].value[1],
       })
     }else if(!data.isSequential){
       this.setState({
         RuleLanguageValue:data.completionConditionArray[1].value[0],
         EditValue:data.completionConditionArray[1].value[1],
       })
     }
      this.setState({
         rule:true,
      })
    }
    //规则配置模态框确定按钮
    rulesModalOk(){
      // this.handleCallBack([this.state.RuleLanguageValue,this.state.EditValue],'ruleLanguage');
      this.setState({
        rule:false,
      })
    }
   //规则配置模态框取消按钮
   rulesModalCancel(){
     this.setState({
       rule:false,
     })
   }
   
    //规则语言选择
   RuleLanguageSelection(event){
      this.setState({
         RuleLanguageValue:event,
      },()=>{this.handleCallBack([this.state.RuleLanguageValue,this.state.EditValue],'ruleLanguage')})
   }
    //规则配置编辑器里面输入的内容
    onChangeEditValue(event){
      console.log(event);
      this.setState({
        EditValue:event,
      },()=>{this.handleCallBack([this.state.RuleLanguageValue,this.state.EditValue],'ruleLanguage')})
    }

    render() {
        console.log(this.state.sequentialData);
        const arrAssignee = [{isSequential:null},{isSequential:true},{isSequential:false}];
        const assigneeGroup = [{isSequential:true},{isSequential:false}];
        return (
            <Fragment>
               {/* <Tabs defaultActiveKey="1" tabBarGutter={6} onChange={this.onChangeTab}>
                  <TabPane tab="非会签" key="1">
                   {assignee}
                   <div className="item-container">
                      <div className="item-title">候选用户:</div>
                      <Select
                        ref={ ref => (this.usersRefs = ref) }
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="请点击选择"
                        value={ this.renderSelectUsersValue("users") }
                        //onChange={ this.usersSelectFocus }
                        onFocus={ this.usersSelectFocus }
                        open={ false }
                        id={this.props.propertyDataToJs.id}
                      />
                    </div>
                    <div className="item-container">
                      <div className="item-title">候选用户组:</div>
                      <Select
                        ref={ ref => (this.groupsRefs = ref) }
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="请点击选择"
                        value={ this.renderSelectUsersValue("groups") }
                        onFocus={ this.groupsSelectFocus }
                        open={ false }
                        id={this.props.propertyDataToJs.id}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab="串行会签" key="2">
                    {assignee}
                    {regularConfig}
                  </TabPane>
                  <TabPane tab="并行会签" key="3">
                    {assignee}
                    {regularConfig}
                  </TabPane>
                </Tabs>*/}
                <div style={{padding:'6px 0',display:'flex',flexDirection:'row',alignItems:'center'}}>
                  <div style={{padding:'0 0 6px 0'}}>会签选择：</div>
                  <Select value={this.state.sequentialType===null?'单会签':(this.state.sequentialType===true?'串行多会签':'并行多会签')} style={{ width: 150 }} onChange={this.onChangeTab}>
                    <Option value={1}>单会签</Option>
                    <Option value={2}>串行多会签</Option>
                    <Option value={3}>并行多会签</Option>
                  </Select>
                </div>
                <div className="item-container"   style={{display:this.state.sequentialType===null?'block':'none'}}>
                    <div className="item-title">候选用户:</div>
                    <Select
                        // disabled={this.state.value!==1?true:''}
                        ref={ ref => (this.usersRefs = ref) }
                        mode="multiple"
                        style={{ width: '100%'}}
                        placeholder="请点击选择"
                        value={ this.renderSelectUsersValue("users") }
                        //onChange={ this.usersSelectFocus }
                        onFocus={ this.usersSelectFocus }
                        open={ false }
                        id={this.props.propertyDataToJs.id}
                    />
                </div>
                <div className="item-container" style={{display:this.state.sequentialType===null?'block':'none'}}>
                    <div className="item-title">候选用户组:</div>
                    <Select
                        // disabled={this.state.value!==1?true:''}
                        ref={ ref => (this.groupsRefs = ref) }
                        mode="multiple"
                        style={{ width: '100%'}}
                        placeholder="请点击选择"
                        value={ this.renderSelectUsersValue("groups") }
                        onFocus={ this.groupsSelectFocus}
                        open={ false }
                        // id={this.props.propertyDataToJs.id}
                    />
                </div>
                <div className="item-container" style={{display:this.state.sequentialType===null?'block':'none'}}>
                  <div className="item-title">指派人:</div>
                  <Select
                    ref={ ref => (this.assigneeRefs = ref) }
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="请点击选择"
                    value={ this.renderSelectUsersValue("assignee")}
                    onFocus={ this.assigneeSelectFocus.bind(this,'a') }
                    open={ false }
                    // id={this.props.propertyDataToJs.id}
                  />
               </div>
    
               <div className="item-container" style={{display:this.state.sequentialType===true?'block':'none'}}>
                 <div className="item-title">指派人:</div>
                 <Select
                   ref={ ref => (this.assigneeRefs2 = ref) }
                   mode="multiple"
                   style={{ width: '100%' }}
                   placeholder="请点击选择"
                   value={ this.renderSelectUsersValue("assignee")}
                   onFocus={ this.assigneeSelectFocus.bind(this,'b') }
                   open={ false }
                   // id={this.props.propertyDataToJs.id}
                 />
               </div>
 
              <div className="item-container" style={{display:this.state.sequentialType===false?'block':'none'}}>
                <div className="item-title">指派人:</div>
                <Select
                  ref={ ref => (this.assigneeRefs3 = ref) }
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请点击选择"
                  value={ this.renderSelectUsersValue("assignee")}
                  onFocus={ this.assigneeSelectFocus.bind(this,'c') }
                  open={ false }
                  // id={this.props.propertyDataToJs.id}
                />
              </div>
 
              <div className="item-container" style={{display:this.state.sequentialType===false?'block':'none'}}>
                <div className="item-title">指派组:</div>
                <Select
                  ref={ ref => (this.assigneeGroupRefs = ref) }
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请点击选择"
                  value={ this.renderSelectUsersValue("assigneeGroup")}
                  onFocus={ this.assigneeGroupSelectFocus.bind(this,'a') }
                  open={ false }
                  // id={this.props.propertyDataToJs.id}
                />
              </div>
 
              <div className="item-container" style={{display:this.state.sequentialType===true?'block':'none'}}>
                <div className="item-title">指派组:</div>
                <Select
                  ref={ ref => (this.assigneeGroupRefs2 = ref) }
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请点击选择"
                  value={ this.renderSelectUsersValue("assigneeGroup")}
                  onFocus={ this.assigneeGroupSelectFocus.bind(this,'b') }
                  open={ false }
                  id={this.props.propertyDataToJs.id}
                />
              </div>
                <div style={{display:this.state.sequentialType===true||this.state.sequentialType===false?'block':'none' }}>
                  <div className="item-title">多会签完成条件表达式:</div>
                  <TextArea
                   // disabled={this.state.value===1?true:''}
                    // ref={ ref => (this.assigneeRefs = ref) }
                    // mode="multiple"
                    style={{ width: '100%'}}
                    placeholder="请点击选择"
                    value={
                       this.state.sequentialType===true?this.state.sequentialData.completionConditionArray[0].value[1]:
                      (this.state.sequentialType===false?this.state.sequentialData.completionConditionArray[1].value[1]:'')
                    }
                    onClick={ this.regularCongifModal }
                    open={ false }
                    // id={this.props.propertyDataToJs.id}
                  />
                </div>
                <Modal
                  destroyOnClose
                  title='规则配置'
                  width="60%"
                  visible={this.state.rule}
                  onOk={this.rulesModalOk}
                  onCancel={this.rulesModalCancel}
                  footer={[
                   <Button type="primary" onClick={ this.rulesModalOk }>
                    确定
                   </Button>
                  ]}
                >
                  <div className="item-container">
                    {/*<div className="item-title">规则语言选择:</div>*/}
                    {/*<Select*/}
                      {/*style={{ marginBottom: "15px" }}*/}
                      {/*defaultValue="activiti"*/}
                      {/*value={*/}
                         {/*this.state.sequentialType===true?this.state.sequentialData.completionConditionArray[0].value[0]:*/}
                        {/*(this.state.sequentialType===false?this.state.sequentialData.completionConditionArray[1].value[0]:'')*/}
                      {/*}*/}
                      {/*onChange={this.RuleLanguageSelection}*/}
                    {/*>*/}
                      {/*<Option value="activiti">activiti</Option>*/}
                      {/*<Option value="drools">drools</Option>*/}
                      {/*<Option value="groovy">groovy</Option>*/}
                      {/*<Option value="javascript">javascript</Option>*/}
                    {/*</Select>*/}
                   {/* <AceEditor
                      width="100%"
                      value={
                       this.state.sequentialType===true?this.state.sequentialData.completionConditionArray[0].value[1]:
                       (this.state.sequentialType===false?this.state.sequentialData.completionConditionArray[1].value[1]:'')
                      }
                      // mode= { selectValue }  EditValue
                      theme="monokai"
                      onChange={ this.onChangeEditValue }
                      name="UNIQUE_ID_OF_DIV" sequentialType:this.state.sequentialType===true?'串行多会签':(this.state.sequentialType===false?'并行多会签':'单会签')
                    />*/}
                    <RegularExpressConfigs
                      onLanguageSelected={this.RuleLanguageSelection}
                      onAceChange={this.onChangeEditValue}
                      mode={this.props.mode?this.props.mode:''}
                      personlizeParams={{
                       rulesLanguage:this.state.sequentialData.completionConditionType,
                       ruleExpresstion:this.state.sequentialType===true?this.state.sequentialData.completionConditionArray[0].value[1]:
                        (this.state.sequentialType===false?this.state.sequentialData.completionConditionArray[1].value[1]:'')
                      }}
                      requestUrl={'/bank/condition/get'}
                      params={{type:'workflow_muti'}}
                      headerToken={{name: "Authorization", token: proConfig.interfaceToken }}
                    />
                  </div>
                 
                </Modal>
               {
                 this.state.userTaskArrayMedia.map((item,index)=>{
                   if(item===undefined||this.state.userTaskClicked.length===0) return false;
                   return(
                     <div key={index+'b'}>
                      <Modal
                        title="Users"
                        width={ "80%" }
                        visible={this.state.userTaskClicked[0].isModalVisible.id===item.key&&this.state.userTaskClicked[0].isModalVisible.type==='CandidateUsers'?this.state.userTaskClicked[0].isModalVisible.value:'' }
                        onOk={ this.handleOKUsers }
                        onCancel={ this.handleCancelUsers }
                        // id={`${item.key}Users`}
                      >
                        <PropertyUsersGroupSelectModal
                         isSequentialType={this.state.sequentialType}
                         sequentialData={this.state.sequentialData}
                         type={ "users" }
                         mode={this.props.mode}
                         columns={
                           [
                             {
                               title: '候选用户',
                               dataIndex: 'name',
                             }
                           ]
                         }
                         pagination={
                           {
                             defaultCurrent: 1,
                             defaultPageSize: 4
                           }
                         }
                         handleCallBack={ this.handleCallBack }
               
                        />
                      </Modal>
                      <Modal
                        title="Groups"
                        width={ "80%" }
                        visible={this.state.userTaskClicked[0].isModalVisible.id===item.key&&this.state.userTaskClicked[0].isModalVisible.type==='CandidateGroups'?this.state.userTaskClicked[0].isModalVisible.value:'' }
                        onOk={ this.handleOKGroups }
                        onCancel={ this.handleCancelGroups }
                        // id={`${item.key}Groups`}
                      >
                        <PropertyUsersGroupSelectModal
                          isSequentialType={this.state.sequentialType}
                          sequentialData={this.state.sequentialData}
                          type={ "groups" }
                          mode={this.props.mode}
                          columns={
                            [
                              {
                                title: '候选用户组',
                                dataIndex: 'name',
                              }
                            ]
                         }
                          pagination={
                            {
                              defaultCurrent: 1,
                              defaultPageSize: 4
                            }
                          }
                          handleCallBack={ this.handleCallBack }
                        />
                     
                      </Modal>
 
                      {/*
                          指派组
                       */}
                      {assigneeGroup.map((assigneeGroupItem,assigneeGroupIndex)=>{
                        return (
                          <Modal
                            key={assigneeGroupIndex}
                            title="指派组"
                            width={ "80%" }
                            visible={this.state.userTaskClicked[0].isModalVisible.id===item.key&&
                              this.state.userTaskClicked[0].isModalVisible.type==='assigneeGroup'&&
                              assigneeGroupItem.isSequential===this.state.sequentialType
                              ?this.state.userTaskClicked[0].isModalVisible.value:'' }
                            onOk={ this.handleOkAssigneeGroup }
                            onCancel={ this.handleCancelAssigneeGroup }
                            // id={`${item.key}assignee`}
                          >
                          <PropertyUsersGroupSelectModal
                             isSequentialType={this.state.sequentialType}
                             sequentialData={this.state.sequentialData}
                             type="assigneeGroup"
                             mode={this.props.mode}
                             columns={
                               [
                                 {
                                   title: '指派组',
                                   dataIndex: 'name',
                                 }
                               ]
                             }
                             pagination={
                               {
                                 defaultCurrent: 1,
                                 defaultPageSize: 4
                               }
                             }
                             handleCallBack={ this.handleCallBack }
                             />
                          </Modal>
                        )
                      })}
 
                      {arrAssignee.map((arrAssigneeItem,arrAssigneeIndex)=>{
                        return (
                          <Modal
                            key={arrAssigneeIndex+'a'}
                            title="指派人"
                            width={ "80%" }
                            visible={this.state.userTaskClicked[0].isModalVisible.id===item.key&&
                            this.state.userTaskClicked[0].isModalVisible.type==='assignee'&&
                            (arrAssigneeItem.isSequential===this.state.sequentialType||arrAssigneeItem.isSequential===`'${this.state.sequentialType}'`)
                             ?this.state.userTaskClicked[0].isModalVisible.value:'' }
                            onOk={ this.handleOkAssignee }
                            onCancel={ this.handleCancelAssignee }
                            // id={`${item.key}assignee`}
                          >
                           <PropertyUsersGroupSelectModal
                             isSequentialType={this.state.sequentialType}
                             sequentialData={this.state.sequentialData}
                             type="assignee"
                             mode={this.props.mode}
                             columns={
                               [
                                 {
                                   title: '指派人',
                                   dataIndex: 'name',
                                 }
                               ]
                             }
                             pagination={
                               {
                                 defaultCurrent: 1,
                                 defaultPageSize: 4
                               }
                             }
                             handleCallBack={ this.handleCallBack }
                           />
                          </Modal>
                        )
                      })}
 
                      {/*<Modal
                       title="assignee"
                       width={ "80%" }
                       visible={this.state.userTaskClicked[0].isModalVisible.id===item.key&&this.state.userTaskClicked[0].isModalVisible.type==='assignee'?this.state.userTaskClicked[0].isModalVisible.value:'' }
                       onOk={ this.handleOkAssignee }
                       onCancel={ this.handleCancelAssignee }
                       id={`${item.key}assignee`}
                      >
                       <PropertyUsersGroupSelectModal
                        isSequentialType={this.state.sequentialType}
                        sequentialData={this.state.sequentialData}
                        type={ "assignee" }
                        columns={
                         [
                          {
                           title: '指派人',
                           dataIndex: 'name',
                          }
                         ]
                        }
                        pagination={
                         {
                          defaultCurrent: 1,
                          defaultPageSize: 4
                         }
                        }
                        handleCallBack={ this.handleCallBack }
                       />
                      </Modal>*/}
                     </div>
                   )
                 })
               }
                {/*<Modal*/}
                    {/*title="Users"*/}
                    {/*width={ "80%" }*/}
                    {/*visible={ this.state.visibleUsers }*/}
                    {/*onOk={ this.handleOKUsers }*/}
                    {/*onCancel={ this.handleCancelUsers }*/}
                {/*>*/}
                    {/*<PropertyUsersGroupSelectModal*/}
                       {/**/}
                        {/*nodeListJs={this.state.userTaskArray}*/}
                        {/*userTaskClicked={this.state.userTaskClicked}*/}
                        {/*type={ "users" }*/}
                        {/*columns={*/}
                            {/*[*/}
                                {/*{*/}
                                    {/*title: 'CandidateUsers',*/}
                                    {/*dataIndex: 'name',*/}
                                {/*}*/}
                            {/*]*/}
                        {/*}*/}
                        {/*pagination={*/}
                            {/*{*/}
                                {/*defaultCurrent: 1,*/}
                                {/*defaultPageSize: 4*/}
                            {/*}*/}
                        {/*}*/}
                        {/*handleCallBack={ this.handleCallBack }*/}
               
                    {/*/>*/}
                {/*</Modal>*/}
                {/*<Modal*/}
                    {/*title="Groups"*/}
                    {/*width={ "80%" }*/}
                    {/*visible={ this.state.visibleGroups }*/}
                    {/*onOk={ this.handleOKGroups }*/}
                    {/*onCancel={ this.handleCancelGroups }*/}
                {/*>*/}
                    {/*<PropertyUsersGroupSelectModal*/}
                        {/*type={ "groups" }*/}
                        {/*columns={*/}
                            {/*[*/}
                                {/*{*/}
                                    {/*title: 'CandidateGroups',*/}
                                    {/*dataIndex: 'name',*/}
                                {/*}*/}
                            {/*]*/}
                        {/*}*/}
                        {/*pagination={*/}
                            {/*{*/}
                                {/*defaultCurrent: 1,*/}
                                {/*defaultPageSize: 4*/}
                            {/*}*/}
                        {/*}*/}
                        {/*handleCallBack={ this.handleCallBack }*/}
                    {/*/>*/}
                {/*</Modal>*/}
            </Fragment>)
    }
}
export default UserTask;