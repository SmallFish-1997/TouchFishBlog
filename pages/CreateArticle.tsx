import { PureComponent, ReactNode, ChangeEvent, Fragment } from 'react';
import '@assets/CreateArticle.less';
import Marked from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-gist.css';
import { toast } from 'react-toastify';
import RequestUtil from '@utils/request';
import { Select, Upload } from 'antd';
import { NormalRes, IArticleRes } from '@public/Interfase'
import * as qiniu from 'qiniu-js';
import md5 from 'crypto-js/md5';
import CommonFn from '@utils/common';
Marked.setOptions({
    highlight(code) {
        return hljs.highlightAuto(code).value
    }
})
interface PropsAttr {
    Category: NormalRes,
    QN_Token: string,
    Article: IArticleRes
}
interface StateAttr {
    title: string, //文章标题
    previewContent: string, //文章内容 - 转HTML
    content: string, //文章内容 - 未转HTML
    summaryInfo: string, //摘要信息
    categorys: string[], //分类
    btnType:string, //按钮文字
    coverImage?: string, //封面图片
    account?:string,
    
}

export default class CreateArticle extends PureComponent<PropsAttr, StateAttr> {
    static async getInitialProps(context: any) {
        let { id } = context.query;
        let Article;
        if (id) {
            Article = await RequestUtil.sendPost({
                url: `/Article/Detail`,
                body: { id }
            })
        }
        const Category: any = await RequestUtil.sendGet({
            url: `/Category/List`
        })
        const TokenRes: any = await RequestUtil.sendGet({
            url: `/qiniu/getToken`
        })

        let Params: any = {
            Category,
            pageTitle:'文章新增/编辑-TouchFish' ,
            QN_Token: TokenRes.token
        }
        if (Article) {
            Params.Article = Article;
        }
        return Params;
    }
    state: StateAttr = {
        title: '',
        previewContent: '',
        content: '',
        summaryInfo: '',
        categorys: [],
        btnType:'publish',
        account:'',
    }
    private qiniu_url: string = 'http://www.touchfish.cn.qiniudns.com'
    /**
     * @name 七牛云上传回调
     * @param  isCover 是否上传封面图片
     * */
    private subObject(isCover: boolean) {
        return {
            next: () => { },
            error: () => {
                toast(() => <div>⚠️上传失败！ </div>);
            },
            // 接收上传完成后的后端返回信息
            complete: (res: any) => {
                toast(() => <div>🚀上传成功！ </div>);
                if (isCover) {
                    this.setState({
                        coverImage: `${this.qiniu_url}/${res.key}`
                    })
                    return;
                }
                let html_str:string = `![](${this.qiniu_url}/${res.key})`;
                this.updateArticleText(html_str,true);
            }
        }
    }
    static RequestUtil = new RequestUtil();

    constructor(props: PropsAttr) {
        super(props);
    }
    componentDidMount() {
        (async ()=>{
            const UserMsg = await CommonFn.CheckAccount();
            if(UserMsg){
                this.setState({
                    account:UserMsg.account
                })
            }
        })();
        
        this.isEditArticle();
    }
    // 编写文章
    // 一般 change 事件我们可以使用 React.ChangeEvent<HTMLButtonElement>，click 事件可以使用 React.MouseEvent<HTMLButtonElement>
    private WriteArticle = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        this.updateArticleText(e.target.value);
    }
    // 更新预览内容
    private updateArticleText(value_str: string,addImg:boolean=false) {
        let html_str: string = '';
        let content_str:string = value_str;
        if(addImg){
            const textObj:any = this.refs.articleText;
            if (textObj.setSelectionRange) {
                let rangeStart = textObj.selectionStart;
                let rangeEnd = textObj.selectionEnd;
                let tempStr1 = textObj.value.substring(
                0, rangeStart);
                let tempStr2 = textObj.value.substring(rangeEnd);
                content_str = tempStr1 + content_str + tempStr2;
                textObj.focus();
                let len = content_str.length;
                textObj.setSelectionRange(
                rangeStart + len, rangeStart + len);
                textObj.blur()
            } else {
                textObj.value += content_str
            }
        }
      
        try {
            html_str = Marked(content_str, { breaks: true });
        } catch (err) { }
        let article_info: string[] = [''];
        // 截取文章摘要
        if (/\n/.test(content_str)) {
            article_info = html_str.match(/(.*)(?=\n)/) || [''];
        }

        this.setState({
            previewContent: html_str,
            content: content_str,
            summaryInfo: article_info[0]
        })
    }
    // 提交文章
    private SubmitArticle = async () => {
        if (this.CheckArticleData()) {
            this.CheckCategorys();
            let req_url:string = this.state.btnType === 'edit'?'Update':'Create';

            let params:any = {
                account:this.state.account,
                title: this.state.title,
                content: this.state.previewContent,
                articleText: this.state.content,
                summaryInfo: this.state.summaryInfo,
                categorys: this.state.categorys,
                coverImage: this.state.coverImage
            }
            if(this.state.btnType === 'edit') params._id = this.props.Article.detail._id;
            const Result = await RequestUtil.sendPost({
                url: `/Article/${req_url}`,
                body: params
            })
            if (Result.code === 0) {
                toast(() => <div>😎{Result.msg}</div>);
                window.location.href = '/';
                return;
            }

            toast(() => <div>😲{Result.msg}</div>);


        }
    }
    // 校验是否存在新的分类
    private CheckCategorys(): void {

        const { list = [] } = this.props.Category;
        // 获取新的分类
        let newCategorys: string[] = [];
        for (let i of this.state.categorys) {
            if (list.findIndex(item => item.name === i) === -1) {
                newCategorys.push(i);
            }
        }

        if (newCategorys.length > 0) {
            RequestUtil.sendPost({
                url: '/Category/Add',
                body: {
                    categorys: newCategorys
                }
            })
        }

    }
    // 校验文章数据
    private CheckArticleData(): Boolean {
        if (!this.state.title) {
            toast(() => <div>😲请填写文章标题 </div>);
            return false;
        }
        if (!this.state.content) {
            toast(() => <div>😲请填写文章内容 </div>);
            return false;
        }

        if (this.state.categorys.length <= 0) {
            toast(() => <div>😲请选择/输入文章分类 </div>);
            return false;
        }

        return true;
    }
    private SelectChange = (value: string[]): void => {
        this.setState({
            categorys: value
        })
    }
    private RenderSelect(): ReactNode {
        const { Option } = Select;
        const children = [];
        const { list = [] } = this.props.Category;
        if (Array.isArray(list) && list.length > 0) {
            for (let i of list) {
                children.push(<Option key={i.name}>{i.name}</Option>);
            }
        }
        return (
            <Select
                className="category-menu"
                mode="tags"
                showSearch
                placeholder="请选择文章分类"
                optionFilterProp="children"
                value={this.state.categorys}
                onChange={this.SelectChange}
            >
                {children}
            </Select>
        )
    }
    /**
     * @name 发送请求-上传七牛云
     * @param fileMsg 上传文件对象
     * @param isCover 是否上传封面图片
     *  */
    private ImgCustomRequest = (fileMsg: any, isCover: boolean): void => {
        let { name } = fileMsg.file;
        let img_type: string = '.jpg';
        if (name.indexOf('.') > -1) {
            img_type = name.substr(name.lastIndexOf('.'), name.length);
        }
        let timer: string = '' + new Date().getTime();
        let fileName: string = `image/test/${md5(timer).toString()}${img_type}`;
        // let domain = result.domain;
        let config = {
            useCdnDomain: true,
            region: qiniu.region.z2
        };
        let putExtra = {
            fname: "",
            params: {},
            mimeType: ["image/png", "image/jpeg", "image/jpg", "image/gif"]
        };
        let observable = qiniu.upload(
            fileMsg.file,
            fileName,
            this.props.QN_Token,
            putExtra,
            config
        );
        observable.subscribe(this.subObject(isCover));
    }
    // 上传前格式校验 - 返回false取消上传
    private beforeUpload = (file: any) => {
        let isJPG = false;
        switch (file.type) {
            case "image/jpeg":
            case "image/png":
            case "image/jpeg":
                isJPG = true;
                break;
        }
        if (!isJPG) {
            toast(() => <div>😲You can only upload JPG|JPEG|PNG file! </div>);
        }
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
            toast(() => <div>😲Image must smaller than 5MB! </div>);
        }
        return isJPG && isLt2M;
    }
    // 渲染上传组件  
    private renderUploadImage(): ReactNode {
        return (<Fragment>

            {/* 上传图片 */}
            <Upload
                className="upload-container"
                name="file"
                showUploadList={false}
                supportServerRender={true}
                action={this.qiniu_url}
                customRequest={(file) => { this.ImgCustomRequest(file, false) }}
                beforeUpload={(file) => this.beforeUpload(file)}>
                <img className="upload-img" src="/static/image-icon.png" />
            </Upload>
            {/* 上传封面 */}
            <Upload
                className="upload-cover-container"
                name="uploadCover"
                showUploadList={false}
                supportServerRender={true}
                action={this.qiniu_url}
                customRequest={(file) => { this.ImgCustomRequest(file, true) }}
                beforeUpload={(file) => this.beforeUpload(file)}>
                <img
                    className="upload-img"
                    src={`/static/cc-discover${this.state.coverImage ? "-active" : ""}.png`}
                />
            </Upload>
        </Fragment>);
    }
    private isEditArticle(): void {
        const { Article } = this.props;
        if (Article && Article.code === 0) {

            const { detail } = Article;
            this.updateArticleText(detail.articleText);
            this.setState({
                btnType:'edit',
                title: detail.title,
                categorys: detail.categorys,
                coverImage: detail.coverImage
            })
        }
    }
    public render(): ReactNode {
        return (<section className="create-article-container public-container">


            {this.renderUploadImage()}
            {/* 头部标题 */}
            <div className="head">
                <input type="text" placeholder="请输入文章标题..." value={this.state.title} onChange={(e) => {
                    this.setState({
                        title: e.target.value
                    })
                }} />

                <div className="submit-box">
                    {this.RenderSelect()}
                    <button className="primary-button" onClick={this.SubmitArticle}>{this.state.btnType==='publish'?'发布文章':'更新文章'}</button>

                </div>
            </div>


            <div className="content-box">
                {/* Markdown编译器 */}

                <div className="md-translater ">

                    <textarea className={`content-area webkit-scroll`} value={this.state.content} spellCheck={false} onChange={this.WriteArticle} ref="articleText">

                    </textarea>
                </div>
                {/* 文章内容及时预览 */}
                <div className="preview webkit-scroll" dangerouslySetInnerHTML={{ __html: this.state.previewContent }}>
                </div>
            </div>
        </section>
        );
    }
}