import { PureComponent, ReactNode, Fragment } from 'react';
import RequestUtils from '@utils/request';
import Router from 'next/router';
import '@assets/home.less';
import { Icon, Carousel, Button,Modal } from 'antd';
import { NormalRes, IUserInfo } from '@public/Interfase';
import { toast } from 'react-toastify';
import CommonFn from '@utils/common';

// PureComponent组件泛型默认<P,S>
interface PropsAttr {
  // 文章列表
  ArticleList: NormalRes,
}
interface StateAttr {
  total: number,
  h5_open: boolean,
  userInfo: IUserInfo,
  ArticleList?: NormalRes,
}

class Home extends PureComponent<PropsAttr, StateAttr> {
  // getInitialProps运行在服务端 - 只会在pages目录下最终export的组件才会执行
  static async getInitialProps(context:any) {
    const RESULT = await RequestUtils.sendPost({
      url: `/Article/List`
    })
    return {ArticleList:RESULT};
  }
  state: StateAttr = {
    total: 100,
    h5_open: false,
    userInfo: {
      account: '',
      createTime: '',
      Permission: '',
    }
  }
  constructor(props: PropsAttr) {
    super(props);
  }
  componentDidMount() {
    this.setState({
      userInfo: CommonFn.getLocalData('FishInfomation'),
      h5_open: document.documentElement.clientWidth <= 750
    });
  }
  // 监听props.ArticleList变化
  static getDerivedStateFromProps(nextProps:PropsAttr, prevState:StateAttr) {
    
    if (nextProps.ArticleList && nextProps.ArticleList !== prevState.ArticleList) {
      return {
        ArticleList: nextProps.ArticleList
      };
    }
    return null; 
  }
  private linkToDetail(id: string): void {
    Router.push(`/ArticleDetail?id=${id}`);
  }
  private renderCategorys(categorys: any[]): ReactNode | null {
    if (Array.isArray(categorys) && categorys.length > 0) {
      return categorys.join('+');
    }
    return null;
  }
  private DeleteArticle = (_id:string):void=>{
    const {confirm} = Modal;
    confirm({
      title: 'Tip',
      content: '确定要删除该文章吗？',
      onOk: async ()=> {
        const DeleteRes = await RequestUtils.sendPost({
          url: `/Article/Delete`,
          body:{
            _id,
            account:this.state.userInfo.account
          }
        })
          if(DeleteRes.code===0){
            toast(() => <div>😎删除成功！</div>);
            return;
          }
          localStorage.removeItem('FishInfomation');
          window.location.reload();
      },
      onCancel() {
      },
    });
 
  }
  private renderEditButton(_id: string): ReactNode {
    try {
      if (this.state.userInfo && this.state.userInfo.Permission === '11') {
        return (<Fragment>
          <Button
            type="danger"
            size="small"
            style={{ fontSize: 12 }}
            onClick={() => this.DeleteArticle(_id)}
            className="delete-btn">
            Delete
          </Button>
          <Button
            type="primary"
            size="small"
            style={{ fontSize: 12 }}
            onClick={() => { window.location.href = `/CreateArticle?id=${_id}` }}
            className="edit-btn">
            Edit
          </Button>
        </Fragment>
        );
      }
    } catch (err) { }
    return null;
  }
  private renderArticleList(): ReactNode {
    if(!this.state.ArticleList)return null;
    const { list } = this.state.ArticleList;
    if (Array.isArray(list) && list.length > 0) {
      return list.map((item, index) => {
        return (<ul key={index}>
          <li>
            <img src="/static/avatar.png" alt="" />
            <span>TouchFish</span>
            {this.renderEditButton(item._id)}
          </li>
          <li onClick={() => this.linkToDetail(item._id)}>
            <span>{item.title}</span>
          </li>
          <li dangerouslySetInnerHTML={{ __html: item.summaryInfo }}></li>

          <li className={this.state.h5_open ? 'wap-open' : ''}>
            <div>
              <span>
                <img src="/static/date-icon.png" alt="" />
                {item.CreateDate}
              </span>
              <span>
                <img src="/static/category-icon.png" alt="" />
                {this.renderCategorys(item.categorys)}
              </span>
            </div>
            <span onClick={() => this.linkToDetail(item._id)} >
              阅读全文 <Icon type="right" /><Icon type="right" />
            </span>
          </li>
        </ul>);
      })
    }
    return null;
  }
  private renderSwiper(): ReactNode {
    const swiperImgs: any[] = ['jpg', 'png', 'jpg', 'jpeg']
    return (
      <div className="hobby">
        <p>
          <img src="/static/swiper-img/b-icon.png" alt="" />
          &nbsp;Basketball
        </p>
        <img src="/static/swiper-img/05.jpg" alt="" />
        <p className="about-row">篮球是这个世界上最可靠的东西，不会抱怨、不会质疑，你扔下它，它会立马弹回来.</p>
        <p>
          <img src="/static/swiper-img/b-icon.png" alt="" />
          &nbsp;Other
        </p>

        <Carousel autoplay >
          {
            swiperImgs.map((item, index) => {
              return (<div key={index} className="swiper-container">
                <img src={`/static/swiper-img/0${index + 1}.${item}`} alt="" />
              </div>)
            })
          }
        </Carousel>
        <ul className="link-list">

        <li onClick={() => {
                                window.open(`https://github.com/SmallFish-1997?tab=repositories`);
                            }}><Icon type="github" style={{ fontSize: 20 }} /></li>
                            <li className="copy-qq-account"
                                data-clipboard-text="TouchFish QQ：1580607864"
                            >
                                <Icon type="qq" style={{ fontSize: 20 }} />
                            </li>
                            <li onClick={() => {
                                window.open(`https://music.163.com/#/user/home?id=544572226`);
                            }}>
                                <Icon type="customer-service" style={{ fontSize: 20 }} />
                            </li>
                            <li className="email-address"
                                data-clipboard-text="TouchFish QQ：1580607864"
                            >
                                <i className="email"></i>
                            </li>
                            <li onClick={() => {
                                window.open(`https://juejin.im/user/5b122516f265da6e0b6ff258`);
                            }}>
                                <img src="/static/juejin.svg" alt=""/>
                            </li>

        </ul>
        {/* <p className="views">网站访问量(Views)：<span className="primary-color">{this.props.webViews}</span></p> */}
      </div>
    )
  }
  public render(): ReactNode {
    return (<section className="home-container public-container">
      <div className={`article-list ${this.state.h5_open ? 'wap-open' : ''}`}>
        {this.renderArticleList()}
      </div>
      <div className={`about-me ${this.state.h5_open ? 'hide-dom' : ''}`}>

        {this.renderSwiper()}
      </div>
    </section>);
  }
}



export default Home;
