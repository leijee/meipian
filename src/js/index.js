/**
 * Created by Administrator on 2018/5/12.
 */
(function () {

	var HomePage = {
		template:'<div class="index-home" v-if="activePage">\n' +
		'            <div class="home-header">\n' +
		'                <div>\n' +
		'                    <h2 class="header-title">开始创作</h2>\n' +
		'                    <p class="header-text">可以添加100张美图哦</p>\n' +
		'                </div>\n' +
		'            </div>\n' +
		'            <div class="home-body">\n' +
		'                <div class="addPhoto">\n' +
		'                    <input type="file" @change="changeImg($event)" accept="image/*" multiple="multiple" class="addPhoto-btn" id="addPhotoBtn">\n' +
		'                    <p class="btn-add">+</p>\n' +
		'                    <p class="text-add">添加照片</p>\n' +
		'                </div>\n' +
		'            </div>\n' +
		'\n' +
		'            <div class="home-footer">\n' +
		'                <div class="footer-item">发现</div>\n' +
		'                <div class="footer-item">\n' +
		'                    <p class="btn-add">+</p>\n' +
		'                    <p>开始制作</p>\n' +
		'                </div>\n' +
		'                <div class="footer-item">我的</div>\n' +
		'            </div>\n' +
		'        </div>',
		props:['imgArr'],
        data:function(){
	        return {
		        activePage:true
            }
        },
        methods:{
	        changeImg:function(e){
		        var files = e.target.files;
		        console.log(this.$props);
		        this.$props.imgArr = [];
		        for(var i=0,len=files.length;i<len;i++){
			        var imgSrc = getImgURL(files[i]);
			        this.$props.imgArr.push({
				        imgUrl:imgSrc,
				        ref:'item'+i,
				        c_ref:'c_item'+i,
				        t_ref:'t_item'+i,
				        type:1//1图片
			        })
		        }
                console.log(this.$emit('setImgArr',this.$props.imgArr));
		        this.$emit('setImgArr',this.$props.imgArr);
		        this.activePage = false;
		        this.activeSecond = true;
		        this.$router.push({
                    path:'second'
                })
	        }
        }
	};

	var SecondPage = {
	    template:'<div class="index-second" @click="hideAddFlag" v-show="activeSecond">\n' +
	    '            <div class="second-header">\n' +
	    '                <img class="bg_header" src="./imgs/bg_header1.jpg" alt="">\n' +
	    '                <div class="header-content">\n' +
	    '                    <textarea placeholder="点击设置标题"  class="content-title" ref="contentTitle" @click.stop="addContent(\'contentTitle\',$event)"></textarea>\n' +
	    '                    <div class="content-bottom">\n' +
	    '                        <div class="bottom-item item-addMusic"><span @click.stop="addMusicFun">添加音乐</span></div>\n' +
	    '                        <div class="bottom-item item-setBg"><span>更换封面</span></div>\n' +
	    '                    </div>\n' +
	    '                </div>\n' +
	    '            </div>\n' +
	    '            <div class="second-body">\n' +
	    '                <div class="body-item" v-for="(item,i) in imgArrs" :key="i">\n' +
	    '                    <div class="first-item" v-if="i == 0">\n' +
	    '                        <div class="addItem topItem" @click.stop="addTopFlag=false" v-show="addTopFlag">+</div>\n' +
	    '                        <div class="add-content" v-show="!addTopFlag">\n' +
	    '                            <span class="icon-text"></span>\n' +
	    '                            <span class="icon-img"></span>\n' +
	    '                            <span class="icon-video"></span>\n' +
	    '                        </div>\n' +
	    '                    </div>\n' +
	    '                    <div class="item-content">\n' +
	    '                        <i class="close" @click="removeCurrentFun(i,item.type)"></i>\n' +
	    '                        <div class="item-left">\n' +
	    '                            <img class="left-item" :src="item.imgUrl" alt="">\n' +
	    '                        </div>\n' +
	    '                        <div class="item-right">\n' +
	    '                            <textarea placeholder="点击添加文字" class="right-item" @click="addContent(item.t_ref,$event)" :ref="item.t_ref">\n' +
	    '\n' +
	    '                            </textarea>\n' +
	    '                        </div>\n' +
	    '                    </div>\n' +
	    '                    <div class="addItem" :ref="item.c_ref" @click.stop="hideAddBottom(item.ref,item.c_ref,$event)" v-if="addBottomFlag+\'i\'">+</div>\n' +
	    '                    <div class="add-content" :ref="item.ref">\n' +
	    '                        <span class="icon-text" @click.stop="addTextFun"></span>\n' +
	    '                        <span class="icon-img" @click.stop="addImgFun"></span>\n' +
	    '                        <span class="icon-video" @click.stop="addVideoFun"></span>\n' +
	    '                    </div>\n' +
	    '                </div>\n' +
	    '            </div>\n' +
	    '            <div class="second-footer">\n' +
	    '                <p class="s-footer-text">完成</p>\n' +
	    '            </div>\n' +
	    '        </div>',
        props:['imgArr'],
        data:function(){
	        return {
		        activeSecond:true
            }
        },
        computed:{
	        imgArrs:function(){
	            // console.log(this.$props);
	            return this.$props.imgArr;
            }
        },
        methods:{
	        hideAddFlag:function(){
		        this.addTopFlag = true;
		        if(this.default_ref!=''){
			        this.$refs[this.default_ref][0].style.display = 'none';
		        }
		        console.log(this.c_default_ref);
		        if(this.c_default_ref != ''){
			        this.$refs[this.c_default_ref][0].style.display = 'block';
		        }
            },
	        //添加内容
	        addContent:function (t_ref,e) {
		        this.t_default_ref = t_ref;
		        this.activeSecond = false;
		        this.activeEdit = true;
		        this.editValue = e.target.value;
	        },
        }
    };



    var routerObj = [
        {path:'',component:HomePage},
	    {path:'/second',component:SecondPage},
	    // {path:'/edit',component:EdiPage},
	    // {path:'/music',component:MusicPage},
    ];

    var router = new VueRouter({
        routes:routerObj
    })

	//自动安装了vuex和vue-route
	var app = new Vue({
		router,
        data:{
		    imgArr:[]
        },
		methods:{
	        setImgArrFun:function(data){
	            console.log(data);
	            this.imgArr = data;
            }
        }
	}).$mount('#app');


	function getImgURL(file) {
        var url = null ;
        // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
        if (window.createObjectURL!=undefined) { // basic
            url = window.createObjectURL(file) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file) ;
        } else if (window.webkitURL!=undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file) ;
        }
        return url ;
    }

    var imgSrcArr = [];

    // $("#addPhotoBtn").on("change",function (e) {
    //     var files = $(this).get(0).files;
    //     for(var i=0,len=files.length;i<len;i++){
    //         var imgSrc = getImgURL(files[i]);
    //         console.log(imgSrc);
    //     }
    // })

})();