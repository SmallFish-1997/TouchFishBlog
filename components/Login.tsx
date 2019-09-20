import {SFC} from 'react';

import {Modal,Button,Input} from 'antd';
import {IChange,IClick} from "@public/Interfase";

interface IProps{
    visible:boolean,
    inputOnChange(e:IChange,type:string):void,
    comfirmSubmit(e:IClick,type:string):void,
    onCancel():void,
}
const LoginModal:SFC<IProps> = (props)=>{
    return (
    <Modal
     title="Permission Check"
     visible={props.visible}
     footer={[
        <Button key="btn-01" onClick={props.onCancel}>
          Cancel
        </Button>,
        <Button 
        key="btn-02" 
        type="primary" 
        onClick={(e)=>props.comfirmSubmit(e,'signin')}>
          Sign In
        </Button>,
        <Button key="btn-03" type="primary" onClick={(e)=>props.comfirmSubmit(e,'signup')}>
          Sign Up
        </Button>,
      ]}
    >
        <p>
            Account:
            <Input maxLength={12} placeholder="Please enter your account" onChange={(e)=>props.inputOnChange(e,'account')}/>
        </p>
        <p>
          Password:
            <Input type="password" placeholder="Please enter your password"  onChange={(e)=>props.inputOnChange(e,'password')}/>
        </p>
      </Modal>
    );
}

export default LoginModal;