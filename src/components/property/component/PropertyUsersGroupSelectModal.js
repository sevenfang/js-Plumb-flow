import React, {Component, Fragment} from "react";
import { Modal, Table, Input, Row, Col, Button ,Checkbox,Radio,Form} from "antd";
import axios from "axios";
import {proConfig} from "@/common/config";
const FormItem = Form.Item;

export default class PropertyUsersGroupSelectModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRows:[],
            selectedRowsOrAssignee:[],//当选择的是多会签的时候，流程发起人和下面的选项时可以同时选的，所以把他们的数据放到此变量里面，一并传给store
            isCheckboxSelected:false,
            isSelectedSponor:[{key:'initiator',id:'#{initiator}',name:'流程发起人'}],//是否选择 了流程发起人
            // isSelectedProsessSponor:false,//是否选择了流程发起人
            data: [],
            loading: true,
            searchValue: "", // 搜索框输入值
            selectedRowKeys: [], // 用于保存点击表格的数据为key的字段，自动叠加
        };
        this.onSelectChange = this.onSelectChange.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.searchData = this.searchData.bind(this);
        this.prosessSponor = this.prosessSponor.bind(this);
        this.getSelectedOptions = this.getSelectedOptions.bind(this);
    }
    componentWillMount() {
        const { type } = this.props;
        let requestUrl = type === "users"||type === "assignee" ? Component.prototype.jsPlumbConfig.candidateUsersPageList : Component.prototype.jsPlumbConfig.candidateGroupsPageList;
        axios.get( requestUrl, {
            params: {
                pageIndex: 1,
                pageSize: 10,
                descending: false,
                filter: { name: ""}
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(res=>{
                console.log('res`````', res);
                let dataArray = [];
                if( type === "users" ||type === "assignee" ) {
                    res.data.data.forEach( (item) => {
                        dataArray.push({
                            key: item.id,
                            id: item.id,
                            name: item.name,
                            selected:true,
                        })
                    });
                } else if ( type === "groups" || type === "assigneeGroup" ) {
                    res.data.data.forEach( (item) => {
                        dataArray.push({
                            key: item.iid,
                            id: item.iid,
                            name: item.roleName,
                            selected:false,
                        })
                    });
                }
                this.setState( () => ({
                    data: dataArray,
                    loading: false
                }))
            })
    }
    componentDidMount(){
       this.getSelectedOptionsCommon(this.props);
    }
    componentWillReceiveProps(nextProps){
  
    }
    /*
    * 反渲染时，table选项的反渲染
    * */
    getSelectedOptions(selectedRows){
       let  selectedKeys = [];
       let  nameText = [];
       let assignee = false;
       for(let i=0;i<selectedRows.length;i++){
         selectedKeys.push(selectedRows[i].key)
         nameText.push(selectedRows[i].name)
         if(selectedRows[i].key==='initiator'){
           assignee=true;
         }else{
           assignee=false;
         }
       }
       return [selectedKeys,nameText,assignee];
    }
    /*
    * 反渲染时，table选项的反渲染,函数componentDidMount和componentWillReceiveProps都要调用
    * */
   getSelectedOptionsCommon(nextProps){
     if(this.props.mode==='reverse'){
       let selectedKeys = [];
       let text = [];
       let assignee = false;
       if(this.props.isSequentialType===null){
         if(this.props.type==='users'){
           selectedKeys=this.getSelectedOptions(nextProps.sequentialData.candidateUsersArray)[0]
           // text=this.getSelectedOptions(nextProps.sequentialData.candidateUsersArray)[1]
         }else if(this.props.type==='groups'){
           selectedKeys=this.getSelectedOptions(nextProps.sequentialData.candidateGroupsArray)[0]
           // text=this.getSelectedOptions(nextProps.sequentialData.candidateGroupsArray)[1]
         }else if(this.props.type==='assignee'){
           selectedKeys=this.getSelectedOptions(nextProps.sequentialData.assigneeArrayOther[0].value)[0]
           // text=this.getSelectedOptions(nextProps.sequentialData.assigneeArrayOther[0].value)[1]
           assignee=this.getSelectedOptions(nextProps.sequentialData.assigneeArrayOther[0].value)[2]
         }
       }else if(this.props.isSequentialType){
         if(this.props.type==='assignee'){
           selectedKeys=this.getSelectedOptions(nextProps.sequentialData.assigneeArrayOther[1].value)[0]
           // text=this.getSelectedOptions(nextProps.sequentialData.assigneeArrayOther[1].value)[1]
           assignee=this.getSelectedOptions(nextProps.sequentialData.assigneeArrayOther[1].value)[2]
         }else if(this.props.type==='assigneeGroup'){
           selectedKeys=this.getSelectedOptions(nextProps.sequentialData.assigneeGroupArrayOther[1].value)[0]
           // text=this.getSelectedOptions(nextProps.sequentialData.assigneeGroupArrayOther[1].value)[1]
         }
       }else if(!this.props.isSequentialType){
         if(this.props.type==='assignee'){
           selectedKeys=this.getSelectedOptions(nextProps.sequentialData.assigneeArrayOther[2].value)[0]
           // text=this.getSelectedOptions(nextProps.sequentialData.assigneeArrayOther[2].value)[1]
           assignee=this.getSelectedOptions(nextProps.sequentialData.assigneeArrayOther[2].value)[2]
         }else if(this.props.type==='assigneeGroup'){
           selectedKeys=this.getSelectedOptions(nextProps.sequentialData.assigneeGroupArrayOther[2].value)[0]
           // text=this.getSelectedOptions(nextProps.sequentialData.assigneeGroupArrayOther[2].value)[1]
         }
       }
      this.setState({
       selectedRowKeys:selectedKeys,
       isCheckboxSelected:assignee,
      })
      // console.log(text)
      // console.log(selectedKeys)
      // console.log(assignee)
     }
     
   }
  
    onSelectChange(selectedRowKeys, selectedRows) {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        // console.log('selectedRows changed: ', selectedRows);
        // console.log(this.state.isCheckboxSelected)
        this.setState({
           selectedRowKeys ,
           selectedRows,
           selectedRowsOrAssignee:this.state.selectedRowsOrAssignee,
        },()=>{
          this.props.handleCallBack(!this.state.isCheckboxSelected?this.state.selectedRows:this.state.selectedRows.concat(this.state.isSelectedSponor), this.props.type ,this.props.isSequentialType )
          // this.props.handleCallBack(this.props.isSequentialType===null?selectedRows:selectedRows.concat(this.state.isSelectedSponor), this.props.type ,this.props.isSequentialType)
         }
         );
        if(this.props.isSequentialType===null){
          this.setState({
            isCheckboxSelected:false,
          });
        }
    }

    /**
     * 搜索input框输入回调事件
     */
    searchChange( e ) {
        let value = e.target.value;
        this.setState( () => ({
            searchValue: value
        }))
    }

    /**
     * 点击查询按钮进行数据查询
     */

    searchData() {
        const { type } = this.props;
        let filterValue = this.state.searchValue;
        let requestUrl = type === "users" ||type === "assignee"? Component.prototype.jsPlumbConfig.candidateUsersPageList : Component.prototype.jsPlumbConfig.candidateGroupsPageList;
        let params = {
            pageIndex: 1,
            pageSize: 10,
            descending: false
        };
        if ( type === "users"||type === "assignee") {
            params.filter = { name: filterValue }
        }
        else {
            params.filter = { roleName: filterValue }
        }
        axios.get( requestUrl, {
            params,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(res=>{
                console.log('res`````', res);
                let dataArray = [];
                if( type === "users"|| type === "assignee" ) {
                    res.data.data.forEach( (item) => {
                        dataArray.push({
                            key: item.id,
                            id: item.id,
                            name: item.name,
                        })
                    });
                } else if ( type === "groups" || type === "assigneeGroup" ) {
                    res.data.data.forEach( (item) => {
                        dataArray.push({
                            key: item.iid,
                            id: item.iid,
                            name: item.roleName,
                        })
                    });
                }
                this.setState( () => ({
                    data: dataArray,
                    loading: false
                }))
            })
    }
    
    //是否选择流程发起人
    prosessSponor(event){
       // console.log(event.target.checked)
       //
       console.log(this.props.isSequentialType)
       // console.log('selectedRowKeys changed: ', selectedRowKeys);
       let value = event.target.checked;
       if(this.props.isSequentialType===null){
         this.setState({
           selectedRowKeys: [],
         })
       }
       this.setState({
         isCheckboxSelected:!this.state.isCheckboxSelected,
         data:this.state.data,
         isSelectedSponor:[{key:value?'initiator':'',id:value?'#{initiator}':'',name:value?'流程发起人':''}],
       },()=>{
         // console.log(this.state.isCheckboxSelected)
         this.props.handleCallBack(
          !event.target.checked?this.state.selectedRows:(this.props.isSequentialType===null?this.state.isSelectedSponor:this.state.selectedRows.concat(this.state.isSelectedSponor)),
          this.props.type ,
          this.props.isSequentialType
         )
         // if(this.props.mode==='reverse'){
         //   this.props.handleCallBack()
         // }else{
         //   this.props.handleCallBack(this.props.isSequentialType===null?[{key:'initiator',id:value?'#{initiator}':'',name:value?'流程发起人':''}]:this.state.selectedRows.concat(this.state.isSelectedSponor), this.props.type ,this.props.isSequentialType )
         // }
         }
        )
       
    }

    render() {
         console.log(this.props.isSequentialType)
        // console.log(this.props.sequentialData)
        // console.log(this.state.selectedRowKeys)
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            type:this.props.isSequentialType===null&&this.props.type==='assignee'?'radio':'checkbox ',
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              // disabled: this.state.isSelectedProsessSponor, // Column configuration not to be checked
              // name: record.name,
              // checked:record.selected,
         }),
        };
      
        return (
            <div>
                <div style={{ marginBottom: "20px",display:this.props.type ==='users'||this.props.type ==='groups'||this.props.type ==='assigneeGroup'||this.props.type ==='assignee'?'block':'none' }}>
                    <Row>
                        <Col span={ 5 }>
                            <Input
                                placeholder="输入查询内容"
                                onChange={ this.searchChange }
                            />
                        </Col>
                        <Col span={ 1 } offset={ 1 }>
                            <Button type="primary" onClick={ this.searchData }>查询</Button>
                        </Col>
                        <Col span={ 17 }>
                        </Col>
                    </Row>
                </div>
                <div style={{ marginBottom: "20px",display:this.props.type==='assignee'?'block':'none',marginLeft:'20px'}}>
                   <Checkbox onChange={this.prosessSponor} checked={this.state.isCheckboxSelected}>
                     是否选择流程发起人
                   </Checkbox>
                </div>
                <Table
                    rowSelection={ rowSelection }
                    columns={ this.props.columns }
                    dataSource={ this.state.data }
                    loading={ this.state.loading }
                    pagination={ this.props.pagination }
                />
            </div>
        )
    }
}