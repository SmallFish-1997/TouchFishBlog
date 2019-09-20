import { PureComponent, ReactNode } from 'react';
import RequestUtil from '@utils/request';
import '@assets/category.less';
import { NormalRes } from '@public/Interfase'
interface IChilds {
    title: string,
    _id: string
}
interface ICategoryList {
    articleList: IChilds[],
    category: string
}
interface P {
    ArticleList: NormalRes
}

export default class Category extends PureComponent<P>{
    static async getInitialProps() {

        const ArticleList: any = await RequestUtil.sendGet({
            url: `/Category/ArticleList`
        })
        // console.log(ArticleList,'-ArticleList');
        
        return { ArticleList,pageTitle:'文章类目-TouchFish' };
    }
    renderArticleList(childs: IChilds[]): ReactNode {
        if (Array.isArray(childs) && childs.length > 0) {
            return (
                <ul className="article-list">
                    {
                        childs.map((item:IChilds, index) => {
                            return (<li key={index} onClick={()=>{
                                window.location.href = `/ArticleDetail?id=${item._id}`;
                            }}>
                                <span>{item.title}</span>
                            </li>)
                        })
                    }
                </ul>
            );
        }
        return (<p className="no-article">暂无文章</p>);
    }
    renderCategoryList(): ReactNode {
        const { list = [] } = this.props.ArticleList;
        if (Array.isArray(list) && list.length > 0) {
            return (
                <ul className="category-list">
                    {
                        list.map((item: ICategoryList, index) => {
                            return (<li key={index}>
                                <img src="/static/swiper-img/b-icon.png" alt=""/>
                                <span> {item.category} </span>
                                <span className="gray-color">({item.articleList.length})</span>
                                {this.renderArticleList(item.articleList)}
                            </li>)
                        })
                    }
                </ul>
            );
        }
        return null;
    }
    render(): ReactNode {
        const { list = [] } = this.props.ArticleList;
        // console.log(this.props.ArticleList);

        return (
            <section className="category-container public-container">
                <h3>
                    Category Page
                </h3>
                <p>目前共计 {list.length} 个分类</p>
                {this.renderCategoryList()}
            </section>
        );
    }
}