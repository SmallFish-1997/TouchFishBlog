import { PureComponent, ReactNode } from 'react';
import RequestUtils from '@utils/request';
import { toast } from 'react-toastify';
import { IArticleRes, NormalRes } from '@public/Interfase';
import { Icon, Row, Col } from 'antd';

// import 'highlight.js/styles/github-gist.css';
import '@assets/ArticleDetail.less';

interface PropsAttr {
    // 文章列表
    Article: IArticleRes,
    PrveNext: NormalRes
}
interface StateAttr {
}



export default class ArticleDetail extends PureComponent<PropsAttr, StateAttr> {
    // getInitialProps运行在服务端 - 只会在pages目录下最终export的组件才会执行
    static async getInitialProps(context: any) {
        let { id } = context.query;
        const Article = await RequestUtils.sendPost({
            url: `/Article/Detail`,
            body: { id }
        })
        const PrveNext = await RequestUtils.sendPost({
            url: `/Article/PrveNext`,
            body: { id }
        })
        let pageTitle = '';
        if(Article.code===0){
            pageTitle = Article.detail.title + "-TouchFish";
        }else{
            pageTitle = '文章详情-TouchFish';

        }
        return { Article, PrveNext,pageTitle };
    }
    state: StateAttr = {
    }
    constructor(props: PropsAttr) {
        super(props);
    }
    componentDidMount() {
        if (this.props.Article.code !== 0) {
            toast(() => <div>⚠️该文章已经不存在啦！</div>);
            setTimeout(() => {
                window.location.href = '/';
            }, 3000)
        }
    }
    private renderCategorys(categorys: any[]): ReactNode | null {
        if (Array.isArray(categorys) && categorys.length > 0) {
            return categorys.join('/');
        }
        return null;
    }
    private linkArticleDetail = (message: any) => {
        if (message && message._id) {
            window.location.href = `/ArticleDetail?id=${message._id}`;
            return;
        }
    }
    public render(): ReactNode {
        // console.log(this.props);

        const { detail } = this.props.Article;
        let PrveNext: any;
        if (this.props.PrveNext.code === 0) {
            PrveNext = this.props.PrveNext.data;
        }

        return (<section className="detail-container public-container">
            <div className="top-box">
                <h3>{detail.title}</h3>

                <Row >
                    <Col className="type-col" xs={{ span: 24 }} sm={{ span: 8 }}>
                        {/* <img src="/static/date-icon.png" alt="" /> */}
                        <Icon type="calendar" />
                        <span> 
                            {/* Date:  */}
                        {detail.CreateDate}
                        </span>
                    </Col>
                    <Col className="type-col" xs={{ span: 24 }} sm={{ span: 8 }}>
                        {/* <img src="/static/category-icon.png" alt="" /> */}
                        <Icon type="appstore" />
                        <span>
                            {/* Category:  */}
                            
                            {this.renderCategorys(detail.categorys)}
                        </span>
                    </Col>
                    <Col className="type-col" xs={{ span: 24 }} sm={{ span: 8 }}>
                        <Icon type="eye" />
                        <span>
                            {/* Views:  */}
                            {detail.views}
                        </span>
                    </Col>
                </Row>
            </div>
            <div className={`${detail.coverImage ? '' : 'hide-dom'} cover-row`}>
                <img src={detail.coverImage} />
            </div>
            <div className="article-content preview" dangerouslySetInnerHTML={{ __html: detail.content }}>
            </div>

            <ul className="prve-next-box">
                <li onClick={() => this.linkArticleDetail(PrveNext.prve)}>
                    <p><Icon type="backward" /> 上一篇</p>
                    <p>{PrveNext.prve ? PrveNext.prve.title : '已经是最新的文字了，等待鱼儿更新'}</p>
                </li>
                <li onClick={() => this.linkArticleDetail(PrveNext.next)}>
                    <p>下一篇 <Icon type="forward" /></p>
                    <p>{PrveNext.next ? PrveNext.next.title : '已经是最后一篇文章啦！'}</p>
                </li>
            </ul>
        </section>);
    }
}