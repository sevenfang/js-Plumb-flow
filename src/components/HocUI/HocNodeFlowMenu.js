import React, { Component } from "react";
import "../../static/css/HocNodeFlowMenu.css";
import ReverseRender from "@/common/ReverseRender";

/**
 * 用于包装在绘图区域拖拽生成的节点,方便后期扩展功能或者UI
 * 页面上面渲染的每个节点都需要从此高阶组件过，
 * 那么就在这里对正、反渲染的逻辑进行判断，给节点做拦截，
 * 新增一些方法、属性、样式上去
 *
 * @param WrappedComponent
 * @returns {{new(): {render(): *}}}
 * @constructor
 */
function HocNodeFlowMenu (className) {
    return function (WrappedComponent) {
        return class HocNodeFlowMenu extends Component {
            constructor(props){
                super(props);
                this.state = {
                    visiable: false,
                 tipsOffsetWidth: 0,
                 tipsOffsetHeight: 0,
                }
                this.handleMouseMove = this.handleMouseMove.bind(this);
                this.handleMouseLeave = this.handleMouseLeave.bind(this);
                // this.reverseRenderMouseLeave = this.reverseRenderMouseLeave.bind(this);
                // this.reverseRenderMouseMove = this.reverseRenderMouseMove.bind(this);
            }
 
         componentDidMount() {
          this.setState(() => ({
           tipsOffsetWidth: this.refs.offsetWidth,
           tipsOffsetHeight: this.refs.offsetHeight,
          }))
         }

            /**
             * 判断渲染正、反渲染逻辑
             */
            renderItem() {
                const { info, extraInfo, workFlowName, mode } = this.props;
             const { tipsOffsetWidth, tipsOffsetHeight } = this.state;
                info.workFlowName = workFlowName; // 让节点信息中包含当前节点的标识name
                if(mode && mode === "exhibition") {
                    return (
                        <div
                         ref={ ref => (this.refs = ref) }
                         onMouseMove={this.handleMouseMove}
                         onMouseLeave={this.handleMouseLeave}
                         style={{
                          // border:'1px solid green',
                          height:'20px',
                          // width:'200px',
                          minWidth:'160px',
                       
                          position: "absolute",
                          left: info.x - ( tipsOffsetWidth / 2 ) + ( info.width / 2 ),
                          top: info.y - tipsOffsetHeight + 110,
                          zIndex:9999
                         
                        }}>
                            {
                                this.state.visiable
                                    ?
                                        <ReverseRender info={ info } extraInfo={ extraInfo }/>
                                    :
                                        null
                            }
                        </div>
                    )
                }
            }
 
            handleMouseMove(e) {
                this.setState(() => ({
                 visiable:true,
                }))
            }
            handleMouseLeave(e) {
                this.setState(() => ({
                 visiable: false,
                }))
            }
            render(){
                const { info, extraInfo, styleObj, eventObj, mode } = this.props;
                let exhibitionEvent = {};
                if( mode && mode === "exhibition" ) {
                    exhibitionEvent = {
                        onMouseMove: this.handleMouseMove,
                        onMouseLeave: this.handleMouseLeave
                    }
                }
                /**
                 * 在这边需要特别注意下，节点层级的div不可以有父级，否则拖拽的过程中坐标会报错，
                 * 所以这里在正反渲染、展示渲染要判断分开，并且返回不同的dom层级结构
                 */
               if (mode && mode === "exhibition") {
                   return (
                       <div>
                           <div
                               key={info.id}
                               id={info.id}
                               className={`${className} node-flow-item ${ info.id === extraInfo.currentElementId ? "currentNodeFlow" : ""}`}
                               style={styleObj}
                               onClick={() => {
                                   eventObj.onClick(info)
                               }}
                               onMouseUp={(e) => {
                                   eventObj.onMouseUp(e, info)
                               }}
                               onContextMenu={(e) => {
                                   eventObj.onContextmenu(e)
                               }}
                               {...exhibitionEvent}
                           >
                               <WrappedComponent {...this.props} />
                           </div>
                           <div>
                               {
                                   this.renderItem()
                               }
                           </div>
                       </div>
                   )
               } else {
                     return (
                         <div
                             key={info.id}
                             id={info.id}
                             className={`${className} node-flow-item`}
                             style={styleObj}
                             onClick={() => {
                                 eventObj.onClick(info)
                             }}
                             onMouseUp={(e) => {
                                 eventObj.onMouseUp(e, info)
                             }}
                             onContextMenu={(e) => {
                                 eventObj.onContextmenu(e)
                             }}
                         >
                             <WrappedComponent {...this.props} />
                         </div>
                     )
               }
            }
        }
    }
}
export default HocNodeFlowMenu;