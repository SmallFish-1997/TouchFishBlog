import { PureComponent, ReactNode } from 'react';
import '@assets/AboutMe.less';
import Clipboard from 'clipboard';
import { Row, Col, Icon } from 'antd';
import { toast } from 'react-toastify';
interface P{}
interface S{
    videoList:any[]
}
export default class AboutMe extends PureComponent<P,S> {
    state:S = {
        videoList:[
            {
                src:'/static/ball01.mp4',
                date:'2019年7月27日',
            },
            {
                src:'/static/ball02.mp4',
                date:'2019年6月16日',
            }
        ],
    }
    static async getInitialProps() {
        return { pageTitle:'关于-TouchFish' };
    }
    constructor(props:P){
        super(props);
    }
    componentDidMount(){
        new Clipboard('.copy-qq-account').on('success',function(){
          toast(() => <div>😎复制QQ成功，赶快加我吧！</div>);
        })
        new Clipboard('.email-address').on('success',function(){
          toast(() => <div>😎复制Email成功，赶快私信我吧！</div>);
        })
    }
    render(): ReactNode {
        return (
            <section className="about-me-container public-container">
                <Row>
                    {/* <Col className="title">
                        <strong>
                            关于TouchFish
                        </strong>
                        <ul>
                            <li>Location：广东深圳，一直在区块链小交易所公司从事前端开发工作，如果有朋友需要前端开发TradingView的K线图可以私信我 - ^_^</li>
                            <li>希望自己不断学习，实现不上班的理想，不被公司重复而繁琐的东西束缚，做自己喜欢做的事（练练篮球/学新技能/朋友聚聚）</li>
                            <li>专科函授学历，面试被拒已经是家常便饭并且早已习惯这种感觉，能理解多数公司通过学历更大的几率筛选出更好的人选，毕竟他们以前在学习的时候我在网吧打LOL - hiahiahia</li>
                        </ul>
                    </Col> */}

                    <Col className="title">
                        <strong>
                            关于touchfish.cn
                        </strong>
                        <ul>
                            <li>该网站使用技术栈 - 前端：React+Nextjs+Typescript 后端：Node+Mongodb</li>
                            <li>之前有实现Hexo搭建过Blog，目前已不再维护了，希望通过自己动手实现一个自己编写的Blog。</li>
                            <li>touchfish.cn会持续的优化、更新新功能和新文章，感谢亲们的阅读. (*^▽^*)</li>
                        </ul>
                    </Col>
                    <Col className="title">
                        <strong>
                            互相关注
                        </strong>
                        {/* <ul>
                            <li>TouchFish-Blog：http://touchfish.cn</li>
                            <li>QQ：1580607864</li>
                            <li>Email：josen_lii@126.com</li>
                            <li>Github：https://github.com/SmallFish-1997?tab=repositories</li>
                            <li>Segmentfault：https://segmentfault.com/u/lijonsen</li>
                            <li>掘金：https://juejin.im/user/5b122516f265da6e0b6ff258</li>
                        </ul> */}
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
                    </Col>
                    {/* <Col className="title">
                        <strong>
                            我的Vlog
                        </strong>
                        <ul className="vlog-list">
                            {
                                this.state.videoList.map((item,index)=>{
                                    return (
                                        <li key={index}>
                                            <video src={item.src} controls={true}>>
                                                您的浏览器不支持 video 标签。
                                            </video>
                                            <p>录制日期：{item.date}</p>
                                        </li>
                                    );
                                })
                            }
                            
                        </ul>
                    </Col> */}
                </Row>
            </section>
        );
    }
}