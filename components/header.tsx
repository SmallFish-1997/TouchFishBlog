import { PureComponent, ReactNode } from 'react';
import { Icon, Drawer, message, Modal } from 'antd';
import LoginModal from '@components/Login';
import { IClick, IChange, IUserInfo } from '@public/Interfase'
import RequestUtil from '@utils/request';
import MD5 from 'crypto-js/md5';
import CommonFn from '@utils/common';
// import Link from 'next/link';
// import Router from 'next/router';
import '@assets/header.less'
// CreateArticle
const titles: string[] = ['Home', 'Categorys', 'Examples'];
// 数组类型的泛型 - 定义this.state接口
interface S {
  list: Array<number>,
  h5_open: boolean,
  visible: boolean, //wap menu状态
  account: string,
  password: string,
  modalVisible: boolean,
  userInfo: IUserInfo
}
interface P {
  pathname: string
}

export default class Header extends PureComponent<P, S> {
  state: S = {
    list: [],
    h5_open: false,
    visible: false,
    account: '',
    password: '',
    modalVisible: false,
    userInfo: {
      account: '',
      createTime: '',
      Permission: '',
    }
  }
  componentDidMount() {
    this.setState({
      userInfo: CommonFn.getLocalData('FishInfomation'),
      h5_open: document.documentElement.clientWidth <= 750
    });
  }
  /**
    * @name 提交登录注册
    * @param e 事件对象
    * @param type 类型
    *  */
  private comfirmSubmit = (e: IClick, type: string): void => {
    if (!this.state.account || !this.state.password) {
      message.info(`Account and Password can't be empty`);
      return;
    }
    RequestUtil.sendPost({
      url: `/login/${type}`,
      body: {
        account: this.state.account,
        password: MD5(this.state.password).toString()
      }
    }).then((res) => {
      if (res.code === 0) {
        message.success(res.msg);
        let infomation: IUserInfo = type === 'signin' ? res.data : {};
        localStorage.setItem('FishInfomation', JSON.stringify(infomation));
        this.setState({
          modalVisible: false,
          userInfo: infomation
        })
        return;
      }
      message.error(`${res.msg}`);
    })
  }
  /**
   * @name 输入框onChange
   * @param e 事件对象
   * @param type 类型
   *  */
  private LoginInputChange = (e: IChange, type: string): void => {
    let val = e.target.value;
    if (type === 'account') {
      this.setState({
        account: val
      })
      return;
    }
    this.setState({
      password: val
    })
  }
  private showWapMenu(): ReactNode {
    return (
      <div className="wap-menu" onClick={() => this.setWapMenuStatus(true)}>
        <Icon type="menu-fold" style={{ fontSize: 18 }} />
      </div>
    );
  }
  private linkPage = (item: string): void => {
    if (item === 'SignIn') {
      this.setState({
        modalVisible: true
      });
      return;
    }
    window.location.href = item === 'Home' ? '/' : `/${item}`;
  }
  private setWapMenuStatus(status: boolean): void {
    this.setState({
      visible: status
    });
  }
  private renderLogin(): ReactNode {

    if (this.state.userInfo && this.state.userInfo.account) {
      return (
        <li key="sign" className="has-account" onClick={this.renderLogoutConfirm}>
          {this.state.userInfo.account}
        </li>
      );
    }
    return (
      <li key="sign" onClick={() => this.linkPage('SignIn')}>
        Login
      </li>
    );
  }
  private renderLogoutConfirm = ()=> {
    const { confirm } = Modal;
    let {pathname} = this.props;
    const _self = this;
    confirm({
      title: 'Tip',
      content: '确定要退出当前账号吗？',
      onOk() {
        localStorage.removeItem('FishInfomation');
        _self.setState({
          userInfo: {
            account: '',
            createTime: '',
            Permission: '',
          }
        })
        if(pathname!=='/'){
          window.location.href = '/';
        }
      },
      onCancel() {
      },
    });
  }
  public render(): ReactNode {
    let activeTab: string = titles.find(n => this.props.pathname.indexOf(n) > -1) || 'Home';
    
    return (<section className="header-container">
      <h3>
        <img src="/static/favicon.ico" alt="" />
        TouchFish
      </h3>
      {
        !this.state.h5_open && (<ul>
          {
            titles.map((item: string, index: number) => {
              return <li key={index} className={activeTab === item ? 'active' : ''} onClick={() => this.linkPage(item)}>
                {item}
              </li>
            })
          }
          {this.renderLogin()}
        </ul>)
      }

      {
        this.state.h5_open && this.showWapMenu()
      }
      <Drawer
        title="导航列表"
        placement="right"
        className="navigation-menu"
        closable={false}
        width={`60%`}
        onClose={() => this.setWapMenuStatus(false)}
        visible={this.state.visible}
      >
        <ul className="navigation-list">
          {
            titles.map((item: string, index: number) => {
              return <li key={index} onClick={() => this.linkPage(item)}>
                {item}
              </li>
            })
          }
          {this.renderLogin()}
        </ul>

      </Drawer>


      <LoginModal
        visible={this.state.modalVisible}
        inputOnChange={this.LoginInputChange}
        comfirmSubmit={this.comfirmSubmit}
        onCancel={() => {
          this.setState({
            modalVisible: false
          })
        }}
      />
    </section>)
  }
}