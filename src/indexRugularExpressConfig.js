import React, { Component } from 'react';
import {Select} from 'antd';
import AceEditor from 'react-ace';
import "brace/mode/java";
import "brace/theme/twilight";
import {SortableTreeWithoutDndContext as SortableTree} from 'react-sortable-tree';
import BMSTheme from "react-sortable-tree-theme-bms";
import axios from "axios";
import {message} from "antd/lib/index";
import './static/css/sortableTree.css';
import { proConfig } from "@/common/config.js";
import withDragDropContext from './components/DraggableNodeFlow/withDragDropContext';

const Option = Select.Option;
class RegularExpressConfig extends Component {
  constructor(props) {
    super(props);
    this.state={
      RuleLanguageValue:'activiti',//选择的语言类型
      cursorStart:0,//aceEditor光标的开始位置
      cursorPosition:0,//点击aceEditor时，获取光标的位置
      aceEditorValue:'',//编辑器的值
      apiValueArr:[],//点击树状结构的页节点，获取对应的api数值的数据
      dataIndex: null,//点击树状菜单获取相应的索引
      operatorHoverIndex:-1,
      operatorClickIndex:-1,
      hoverApiValueIndexSec:-1,
      apiValueIndexSec:0,
      hoverApiValueIndex:0,
      apiValueIndex:0,
  
   //    data:{
   //  "operators": [
   //   {
   //    "name": "逻辑运算符",
   //    "options": [
   //     {
   //      "symbol": "==",
   //      "title": "等于"
   //     },
   //     {
   //      "symbol": "||",
   //      "title": "或"
   //     },
   //     {
   //      "symbol": "&&",
   //      "title": "且"
   //     },
   //     {
   //      "symbol": "<=",
   //      "title": "小于等于"
   //     },
   //     {
   //      "symbol": "!",
   //      "title": "非"
   //     },
   //     {
   //      "symbol": "<",
   //      "title": "小于"
   //     },
   //     {
   //      "symbol": "!=",
   //      "title": "不等于"
   //     },
   //     {
   //      "symbol": ">",
   //      "title": "大于"
   //     },
   //     {
   //      "symbol": ">=",
   //      "title": "大于等于"
   //     }
   //    ]
   //   },
   //   {
   //    "name": "算术运算符",
   //    "options": [
   //     {
   //      "symbol": "%",
   //      "title": "求余"
   //     },
   //     {
   //      "symbol": "(",
   //      "title": "左括号"
   //     },
   //     {
   //      "symbol": ")",
   //      "title": "右括号"
   //     },
   //     {
   //      "symbol": "*",
   //      "title": "乘"
   //     },
   //     {
   //      "symbol": "+",
   //      "title": "加"
   //     },
   //     {
   //      "symbol": "-",
   //      "title": "减"
   //     },
   //     {
   //      "symbol": "/",
   //      "title": "除"
   //     }
   //    ]
   //   }
   //  ],
   //   "processApi": {
   //   "apiValueTitle": "API数值",
   //    dataArr: [
   //    {
   //     apiValues: null,
   //     children: [
   //      {
   //       apiValues: null,
   //       children: [],
   //       code: "nrOfCompleteInstances",
   //       id: "6004",
   //       parentId: "6003",
   //       title: "已完成任务用户数"
   //      }
   //     ],
   //     code: "",
   //     id: "6003",
   //     name: "reportEngineMenu",
   //     parentId: "",
   //     title: "多用户会签参数列表"
   //    },
   //    {
   //     apiValues: null,
   //     children: [
   //       {
   //         apiValues: [
   //           {
   //             title: "同意",
   //             value: "0"
   //           },
   //          {
   //            title: "不同意",
   //            value: "1"
   //          }
   //         ],
   //        children: [],
   //        code: "agreeOrReject",
   //        id: "6001",
   //        name: "reportEngineMenu",
   //        parentId: "6002",
   //        title: "是否同意？"
   //       }
   //     ],
   //     code: "",
   //     id: "6002",
   //     parentId: "",
   //     name: "reportEngineMenu",
   //     title: "用户提交参数列表"
   //    }
   //   ],
   //    "processApiTitle": "流程 API"
   //  }
   // },
   data:null,
    };
    this.selectedApiValue=this.selectedApiValue.bind(this);
    this.hoverApiValue=this.hoverApiValue.bind(this);
    this.leaveApiValue=this.leaveApiValue.bind(this);
    this.selectedApiValueSecond=this.selectedApiValueSecond.bind(this);
    this.hoverApiValueSecond=this.hoverApiValueSecond.bind(this);
    this.leaveApiValueSecond=this.leaveApiValueSecond.bind(this);
    this.operatorClick=this.operatorClick.bind(this);
    this.operatorHover=this.operatorHover.bind(this);
    this.operatorLeave=this.operatorLeave.bind(this);
    this.handleTreeOnChange=this.handleTreeOnChange.bind(this);
    this.alertNodeInfo=this.alertNodeInfo.bind(this);
    this.insertStr=this.insertStr.bind(this);
    this.aceEditorClick=this.aceEditorClick.bind(this);
    this.onChangeEditValue=this.onChangeEditValue.bind(this);
    this.doubleSelectedApiValueSecond=this.doubleSelectedApiValueSecond.bind(this);
   this.RuleLanguageSelection =this.RuleLanguageSelection.bind(this);
    if(this.props.headerToken) {
     axios.interceptors.request.use(config => {
       config.headers[this.props.headerToken.name] = this.props.headerToken.token// 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
       return config
     }, error => {
       Promise.reject(error)
     })
    }
  }
  componentWillMount(){
    axios.get(`${proConfig.ipAddress}${this.props.requestUrl}`,{
      params:this.props.params,
    })
     .then(res=>{
       console.log(res.data.data)
       this.setState({
         data:res.data.data,
       })
     })
     .catch((error)=>{
       message.error(error.message);
     })
  }
  componentDidMount(){
     if(this.props.mode && this.props.mode==='reverse'){
        this.setState({
         RuleLanguageValue:this.props.personlizeParams.rulesLanguage?this.props.personlizeParams.rulesLanguage:'activiti',
         aceEditorValue:this.props.personlizeParams.ruleExpresstion?this.props.personlizeParams.ruleExpresstion:'',
        })
     }
  }
 
  selectedApiValue(event){
     this.setState({
        apiValueIndex:parseInt(event.target.getAttribute('data-index')),
     })
  }
  hoverApiValue(event){
    this.setState({
      hoverApiValueIndex:parseInt(event.target.getAttribute('data-index')),
    })
  }
  leaveApiValue(event){
    this.setState({
      hoverApiValueIndex:-1,
    })
  }
  
  selectedApiValueSecond(event){
    this.setState({
      apiValueIndexSec:parseInt(event.target.getAttribute('data-index')),
    })
  }
 
 doubleSelectedApiValueSecond(event){
   let domEle = document.getElementById('UNIQUE_ID_OF_DIV').children[0];
   domEle.focus();
   this.setState({
     aceEditorValue:this.insertStr(this.state.aceEditorValue,this.state.cursorPosition,event.target.getAttribute('data-value')),
     cursorStart:this.state.cursorPosition+event.target.innerHTML.length,
   },()=>{this.props.onAceChange(this.state.aceEditorValue)})
 }
 
  hoverApiValueSecond(event){
    this.setState({
      hoverApiValueIndexSec:parseInt(event.target.getAttribute('data-index')),
    })
  }
  leaveApiValueSecond(event){
    this.setState({
      hoverApiValueIndexSec:-1,
    })
  }
 
 /*
* 改变aceEditor的值
* */
 onChangeEditValue(event){
  console.log(event)
  this.setState({
   aceEditorValue:event,
   cursorStart:event.length,
  },()=>{
    this.props.onAceChange(this.state.aceEditorValue)
  })
 }
 
 operatorClick(event){
  const domEle = document.getElementById('UNIQUE_ID_OF_DIV').children[0];
  domEle.focus();
  let index = event.target.getAttribute('data-index').split('-');
  let rowIndex = index[0];
  let columnIndex = index[1];
  this.setState({
    operatorClickIndex:parseInt(event.target.getAttribute('data-index')),
    aceEditorValue:this.insertStr(this.state.aceEditorValue,this.state.cursorPosition,this.state.data.operators[rowIndex].options[columnIndex].symbol),
    // cursorStart:this.state.cursorStart+2,
  },()=>{
   this.props.onAceChange(this.state.aceEditorValue);
  })
 }
 
 operatorHover(event){
   this.setState({
     operatorHoverIndex:event.target.getAttribute('data-index'),
   })
 }
 operatorLeave(event){
   this.setState({
     operatorHoverIndex:-1,
   })
 }
 
 
 handleTreeOnChange (treeData, event){
  // console.log(treeData)
  this.state.data.processApi.dataArr=treeData;
  this.setState({
    data:this.state.data,
  });
 };
 
 alertNodeInfo(event){
  // console.log('lalalalall.我是卖报的小画家',event);
  // console.log('lalalalall.我是卖报的小画家',event.node.title);
  if(event.node.children===null){
     this.setState({
       apiValueArr:event.node.apiValues,
     })
  }
  this.setState({
    dataIndex: document.getElementById(`${event.node.id}`).getAttribute('data-index'),
  })
 };
 
 doubleAlertNodeInfo(event){
   document.getElementById('UNIQUE_ID_OF_DIV').children[0].focus();
   if(event.node.children===null){
    this.setState({
      aceEditorValue:this.insertStr(this.state.aceEditorValue,this.state.cursorPosition,event.node.code),
      cursorStart:this.state.cursorPosition+event.node.title.length,
    },()=>{this.props.onAceChange(this.state.aceEditorValue)})
   }
 }
 /*
 * 在字符串指定的位置插入字符串
 *
 * */
 
 insertStr(soure, start, newStr){
   return soure.slice(0, start) + newStr + soure.slice(start);
 }
 
 // insertStr(str,domID){
 //  let tc = domID;
 //  let tclen = tc.value.length;
 //  console.log(tc)
 //  console.log(tclen)
 //  console.log(tc.value)
 //  tc.focus();
 //  if(typeof document.selection != "undefined")
 //  {
 //   document.selection.createRange().text = str;
 //  }
 //  else
 //  {
 //   tc.value = tc.value.substr(0,tc.selectionStart)+str+tc.value.substring(tc.selectionStart,tclen);
 //  }
 //  console.log(tc.value)
 //  return tc.value;
 // }
 /*
 * aceEditor编辑器里面点击事件
 * */
 aceEditorClick(event){
   this.setState({
     cursorPosition:event.lead.column,
   })
 }
 
  //规则语言选择
  RuleLanguageSelection(event){
    this.props.onLanguageSelected(event);
    this.setState({
      RuleLanguageValue:event,
    })
  }
 


  render() {
    if(this.state.data===null) return false;
    const styleCommon = {
      height:'330px',
      overflow:'auto',
      border:'1px solid #eee',
      borderRadius:'4px',
      background:'#f9f9f9',
      // color:'#fff'
    };
    const styleTitle = {
      height:'40px',
      lineHeight:'40px',
      background:'rgba(0,0,0,0.4)',
      paddingLeft:'10px',
      color:'#fff',
      fontSize:'16px',
      fontWeight:'bold',
      borderRadius:'4px 4px 0 0 '
    };
    return (
      <div>
        <div className="item-title">规则语言选择:</div>
        <Select
          style={{ marginBottom: "15px" }}
          // defaultValue={"activiti"}
          value={this.state.RuleLanguageValue
          //  this.state.sequentialType===true?this.state.sequentialData.completionConditionArray[0].value[0]:
          // (this.state.sequentialType===false?this.state.sequentialData.completionConditionArray[1].value[0]:'')
          }
          onChange={this.RuleLanguageSelection}
        >
          <Option value="activiti">activiti</Option>
          <Option value="drools">drools</Option>
          <Option value="groovy">groovy</Option>
          <Option value="javascript">javascript</Option>
        </Select>
        <AceEditor
          ref='aceEditor'
          editorProps={{ $blockScrolling: true }}
          focus={true}
          fontSize={14}
          cursorStart={this.state.cursorStart}
          width="100%"
          height='200px'
          style={{borderRadius:'4px'}}
          // defaultValue={this.props.mode==='reverse'?this.props.personlizeParams.ruleExpresstion:''}
          value={this.state.aceEditorValue}
          mode= 'java'
          theme="twilight"
          onChange={ this.onChangeEditValue }
          onCursorChange={this.aceEditorClick}
          name="UNIQUE_ID_OF_DIV"
        />
        <div style={{
          display:'flex',
          flexDirection:'row',
          width:'100%',
          justifyContent:'space-between',
          marginTop:'20px',
        }}>
        <div style={{width:'32%',display:this.state.RuleLanguageValue==='activiti'?'block':'none'}}>
          <div
            style={styleTitle}
          >{this.state.data.processApi.apiValueTitle}</div>
            <SortableTree
              canDrag={false}
              id='sortableTree'
              className='sortableTree'
              style={{position: 'relative',height:"330px"}}
              innerStyle={{color: '#333', fontWeight: 'normal', fontSize: '16px'}}
              theme={BMSTheme}
              // maxDepth={5}
              treeData={this.state.data.processApi.dataArr}
              onChange={this.handleTreeOnChange}
              rowHeight={44}
              scaffoldBlockPxWidth={16}
              // onMoveNode={this.handleMoveTreeNode}
              generateNodeProps={rowInfo =>
              ({
                buttons: [
                  <div
                    data-index={rowInfo.node.id}
                    id={rowInfo.node.id}
                    style={{
                      fontSize:'14px',
                      position: 'absolute',
                      minWidth: '200px',
                      height: '36px',
                      paddingRight:'30px',
                      top: '0',
                      left: '-20px',
                      lineHeight: '36px',
                      textIndent: '6px',
                      background: this.state.dataIndex === rowInfo.node.id ? '#FAFAFA' : '',
                      color: this.state.dataIndex === rowInfo.node.id ? '#5FA4FF' : '#999'
                    }}
                    onClick={() => this.alertNodeInfo(rowInfo)}
                    onDoubleClick={() => this.doubleAlertNodeInfo(rowInfo)}
                  >
                    {this.state.dataIndex === rowInfo.node.id ? rowInfo.node.title : ''}
                  </div>
                ],
              })}
            />
          {/*</div>*/}
        </div>
          <div style={{width:'32%',display:this.state.RuleLanguageValue==='activiti'?'block':'none'}}>
            <div
              style={styleTitle}
            >{this.state.data.processApi.processApiTitle}</div>
            <div style={styleCommon}>
            {
              this.state.apiValueArr!==null?
                this.state.apiValueArr.map((apiValueItem,apiValueIndex)=>{
                  return(
                    <div
                      style={{
                        // background:`${this.state.hoverApiValueIndexSec===apiValueIndex?'#9cdbff':''}`,
                        color:`${this.state.hoverApiValueIndexSec===apiValueIndex?'#5FA4FF' : '#999'}`,
                        // fontSize:`${this.state.hoverApiValueIndexSec===apiValueIndex?'15px':''}`,
                        height:'32px',
                        // border:'1px solid red',
                        lineHeight:'32px',
                        margin:'10px 10px 0 10px',
                        cursor:'pointer',
                        paddingLeft:'10px',
                        borderRadius:'3px'
                      }}
                     data-value={apiValueItem.value}
                     data-index={apiValueIndex}
                     key={apiValueIndex}
                     onClick={this.selectedApiValueSecond}
                     onDoubleClick={this.doubleSelectedApiValueSecond}
                     onMouseOver={this.hoverApiValueSecond}
                     onMouseLeave={this.leaveApiValueSecond}
                    >{apiValueItem.title}[{apiValueItem.value}]</div>
                  )
                 }):''
            }
            </div>
          </div>
          <div style={{width:'32%',display:this.state.RuleLanguageValue==='activiti'?'block':'none'}}>
            <div
              style={styleTitle}
            >运算符</div>
            <div style={styleCommon}>
              {this.state.data.operators.map((item,index)=>{
                return(
                  <div key={index} style={{
                     // border:'1px solid red',
                     width:'96%',
                     marginTop:'10px'
                  }}>
                    <div style={{
                      fontSize:'14px',
                      paddingLeft:"10px",
                      height:'32px',
                      lineHeight:'32px'
                    }}>{item.name}</div>
                   <div style={{
                     display:'flex',
                     flexWrap: 'wrap',
                     paddingLeft:"10px",
                     marginBottom:'10px',
                   }}>
                    {
                      item.options.map((operatorItem,operatorIndex)=>{
                        return(
                          <div key={operatorIndex} style={{
                            // float:'left',
                            display:'inline-block',
                            width:'60px',
                            // width:'18%',
                            height:'40px',
                            margin:'5px 6px',
                            background:`${this.state.operatorHoverIndex===`${index}-${operatorIndex}`?'#4c9bff':'#46c1ff'}`,
                            borderRadius:'4px',
                            textAlign:'center',
                            color:'#fff',
                            fontSize:"16px",
                            lineHeight:'40px',
                            cursor:'pointer'
                          }}
                          title={operatorItem.title}
                          data-index={`${index}-${operatorIndex}`}
                          onClick={this.operatorClick}
                          onMouseOver={this.operatorHover}
                          onMouseLeave={this.operatorLeave}
                          >{operatorItem.symbol}</div>
                        )
                      })
                    }
                   </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withDragDropContext(RegularExpressConfig);




