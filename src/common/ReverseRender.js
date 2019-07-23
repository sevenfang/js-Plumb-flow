import React, { Component } from "react";

export default class ReverseRender extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tipsOffsetWidth: 0,
            tipsOffsetHeight: 0,
            currentFlow: null
        }

    }

    componentDidMount() {
        this.setState(() => ({
            tipsOffsetWidth: this.refs.offsetWidth,
            tipsOffsetHeight: this.refs.offsetHeight,
        }))
    }
    mouseMoveEvent(){
    
    }

    render() {
        const { info, extraInfo } = this.props;
        const { tipsOffsetWidth, tipsOffsetHeight } = this.state;
        let currentFlow = null;
        if( extraInfo ) {
            currentFlow = extraInfo.elementInfos.find((item) => {
                return info.id === item.elementId;
            });
        }
        return (
        
            <div
                ref={ ref => (this.refs = ref) }
                className="ant-tooltip  ant-tooltip-placement-top"
                style={{
                   width:'100%',
                   // marginLeft:'30px',
                   height:this.refs.clientHeight>200?'300px':this.refs.clientHeight,
                   overflow:'auto',
                   position: "absolute",
                   bottom:'16px',
                   // border:'1px solid red'
                 //    left: info.x - ( tipsOffsetWidth / 2 ) + ( info.width / 2 ),
                 //    top: info.y - tipsOffsetHeight + 100,
                }}
            >
                <div style={{
                 //  position: "absolute",
                 // bottom:'-20px',
                 // left:0,
                 // border:'1px solid red',
                 // height:'30px',
                 // width:'100%',
                 // background:'green'
                 
                }}> </div>
                <div className="ant-tooltip-content">
                    <div className="ant-tooltip-arrow"></div>
                    <div className="ant-tooltip-inner">
                        <div>
                            {
                                extraInfo && info.id === extraInfo.currentElementId
                                    ?
                                    <div style={{textAlign: "left", color: "#FF615F"}}>
                                        <span>当前审批节点 : {info.name}</span>
                                    </div>
                                    :
                                    <div style={{textAlign: "left",marginBottom:`${currentFlow && currentFlow.executionTime?'10px':''}`}}>
                                        <span>节点名称 : {info.name}</span>
                                    </div>
                            }
                            <div style={{textAlign: "left"}}>
                                <div>
                                    {
                                        currentFlow!==undefined && currentFlow.submitParams && currentFlow.submitParams.map((submitParamsItem,submitParamsIndex) => {
                                            return (
                                                <div key={submitParamsIndex} style={{marginBottom:'10px'}}>
                                                 <div>提交人 : {submitParamsItem.name}</div>
                                                { submitParamsItem.processParameters&&submitParamsItem.processParameters.map((item,index)=>{
                                                  return(
                                                    <div key={index}>
                                                      <span>{ item.name} : {item.value}</span>
                                                    </div>
                                                  )
                                                 })}
                                                 
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        currentFlow && currentFlow.executionTime
                                            ?
                                                (
                                                    <div>
                                                        <span>执行时间 : { currentFlow.executionTime }</span>
                                                    </div>
                                                )
                                            :
                                                null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        )
    }
}