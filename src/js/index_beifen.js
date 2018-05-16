/**
 * Created by Administrator on 2018/5/12.
 */
(function () {


	Vue.component('vAlert',{
		props:['a_title','a_content','showAlert','sureFun','cancelFun'],
		template:'<div class="index-alert" v-if="showAlert">\n' +
		'            <div class="mask"></div>\n' +
		'            <div class="alert-content">\n' +
		'                <div class="content-title">{{currentTitle}}</div>\n' +
		'                <div class="content-text"></div>\n' +
		'                <div class="content-btn">\n' +
		'                    <div class="btn-cancel" @click="cancelFun">取消</div>\n' +
		'                    <div class="btn-sure" @click="sureFun">确定</div>\n' +
		'                </div>\n' +
		'            </div>\n' +
		'        </div>',
		data:function () {
			return {

			}
		},
		computed:{
			currentTitle:function () {
				return this.$props.a_title;
			},
			showAlert:function () {
				return this.$props.showAlert;
			}
		},
        watch:{
	        showAlert:function (oldValaue,newValue) {
                console.log(oldValaue,newValue);
	        }
        },
        created:function () {

        },
		methods:{
			cancelFun:function () {
				console.log(this.$props.cancel);
				if(typeof this.$props.cancel == 'function'){
					this.$props.cancelFun();
				}else{
					this.showAlert = false;
				}
			},
			sureFun:function(){
				if(typeof this.$props.sureFun == 'function'){
					this.showAlert = this.$props.sureFun();
				}else{
					this.showAlert = false;
				}
			}
		}

	});


    //最多可以添加100张图哦
    var vm = new Vue({
        el:'#app',
        data:{
            activePage:false,//首页
            activeSecond:false,//第二页
            activeEdit:false,//编辑
            activeMusic:false,//添加音乐
	        activeReview:false,//预览页
            contentTitle:'点击设置标题',
            imgArr:[
                {imgUrl:'',ref:'item1',c_ref:'c_item1',t_ref:'t_item1'},
                {imgUrl:'',ref:'item2',c_ref:'c_item2',t_ref:'t_item2'},
                {imgUrl:'',ref:'item3',c_ref:'c_item3',t_ref:'t_item3'}
            ],
            default_ref:'',
            c_default_ref:'',
            t_default_ref:'',//添加文字内容ref
            addTopFlag:true,
            addBottomFlag:true,
            editValue:'',
            textNum:0,//默认字数
            maxNum:5000,//字数长度最大值
            showSubmit:true,
            isActive:true,//选择音乐，选中时flag
            musicTypeList:[
                {typeName:'圣诞',musicNum:8,TypeId:123,musicSrc:''},
                {typeName:'欢快',musicNum:10,TypeId:124,musicSrc:''},
                {typeName:'优美',musicNum:13,TypeId:125,musicSrc:''},
                {typeName:'浪漫',musicNum:9,TypeId:126,musicSrc:''},
                {typeName:'激情',musicNum:9,TypeId:127,musicSrc:''},
                {typeName:'激情1',musicNum:9,TypeId:128,musicSrc:''},
                {typeName:'激情2',musicNum:9,TypeId:129,musicSrc:''},
                {typeName:'激情3',musicNum:9,TypeId:130,musicSrc:''}
            ],
            musicList:[
                {TypeId:123,musicId:11,musicName:'那个人',musicAuthor:'周延英',musicUrl:'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',picture:''},
	            {TypeId:123,musicId:12,musicName:'那个人',musicAuthor:'周延英',musicUrl:'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',picture:''},
	            {TypeId:123,musicId:13,musicName:'那个人',musicAuthor:'周延英',musicUrl:'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',picture:''},
	            {TypeId:123,musicId:14,musicName:'那个人',musicAuthor:'周延英',musicUrl:'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',picture:''},
	            {TypeId:123,musicId:15,musicName:'那个人',musicAuthor:'周延英',musicUrl:'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',picture:''},
	            {TypeId:123,musicId:16,musicName:'那个人',musicAuthor:'周延英',musicUrl:'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',picture:''},
	            {TypeId:123,musicId:17,musicName:'那个人',musicAuthor:'周延英',musicUrl:'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',picture:''},
	            {TypeId:123,musicId:18,musicName:'那个人',musicAuthor:'周延英',musicUrl:'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',picture:''},
	            {TypeId:123,musicId:19,musicName:'那个人',musicAuthor:'周延英',musicUrl:'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',picture:''},
	            {TypeId:123,musicId:20,musicName:'那个人',musicAuthor:'周延英',musicUrl:'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',picture:''},
            ],
            d_index:0,
            c_index:null,//当前选中下标
	        m_index:0,//音乐下标
            musicId:'',//当前选中的音乐
	        typeSelected:true,
            a_title:'是否关闭',
            a_content:'哇哈哈哈',
            showAlert:false,
            sureFun:null,
            cancelFun:null
        },
        created:function(){
            console.log('test');

        },
        mounted:function(){

        },
        methods:{
            changeImg:function(e){
                var files = e.target.files;
                this.imgArr = [];
                for(var i=0,len=files.length;i<len;i++){
                    var imgSrc = getImgURL(files[i]);
                    this.imgArr.push({
                        imgUrl:imgSrc,
                        ref:'item'+i,
                        c_ref:'c_item'+i,
                        t_ref:'t_item'+i,
                        type:1//1图片
                    })
                }
                console.log(this.imgArr);
                this.activePage = false;
                this.activeSecond = true;
            },
            hideAddFlag:function () {

                this.addTopFlag = true;

                if(this.default_ref!=''){
                    this.$refs[this.default_ref][0].style.display = 'none';
                }
                console.log(this.c_default_ref);
                if(this.c_default_ref != ''){
                    this.$refs[this.c_default_ref][0].style.display = 'block';
                }
            },
            hideAddBottom:function (ref,c_ref,e) {

                if(this.default_ref!=''){
                    console.log(this.$refs[this.default_ref][0]);
                    this.$refs[this.default_ref][0].style.display = 'none';
                }
                if(this.c_default_ref !=''){
                    console.log(this.$refs[this.c_default_ref][0])
                    this.$refs[this.c_default_ref][0].style.display = 'block';
                }
                this.default_ref = ref;
                this.c_default_ref = c_ref;
                this.addTopFlag = true;
                e.target.style.display = 'none';
                this.$refs[ref][0].style.display = 'block'
            },
            editFun:function () {

                if(this.editValue.length>this.maxNum){
                    this.editValue = this.editValue.substr(0,this.maxNum);
                }
                this.textNum = this.editValue.length;

            },
            blurFun:function () {
                this.showSubmit = false;
            },
            focusFun:function () {
                this.showSubmit = true;
            },
            //点击完成，提交内容
            submitEdit:function () {
                var value = this.editValue;
                this.activeSecond = true;
                this.activeEdit = false;
                if(this.t_default_ref!=''){
                    this.$nextTick(function(){
                        if(this.t_default_ref == 'contentTitle'){//设置标题，编辑文本内容
                            this.$refs[this.t_default_ref].value = value;
                        }else{//设置文本内容
                            this.$refs[this.t_default_ref][0].value = value;
                        }
                    });
                }
            },
            //添加内容
            addContent:function (t_ref,e) {
                this.t_default_ref = t_ref;
                this.activeSecond = false;
                this.activeEdit = true;
                this.editValue = e.target.value;
            },
            //选择音乐tab切换
            selectFun:function(flag){
                this.isActive = flag?true:false;
            },
            //选择音乐类型
            selectType:function (val) {
	            this.typeSelected = !this.typeSelected;
	            if(val == 'no'){
	                this.musicId = '';
                }
	            this.d_index = val;
	            if(this.c_index !=val){
		            this.m_index = 0;//默认选中为第一个
                }
	            this.c_index = val;
	            console.log(this.d_index==val&&!this.typeSelected);
            },
            selectMusic:function(val,id){
                console.log(val);
                this.m_index = val;
                this.musicId = id;
            },
            //确认选择音乐，提交
            submitSelect:function (musicId) {
                console.log('this.musicId=',this.musicId);



            },
            //添加音乐
            addMusicFun:function(){
                this.activeSecond = false;
                this.activeMusic = true;
            },
            //移除当前
            removeCurrentFun:function(i,_type){
                var len = 0;
                this.imgArr.forEach(function(item){
                    if(item.type == _type){
                        len = len+1;
                    }
                });
                if(len == 1){
                    alert('至少要保留一张照片');
                }else{
                    this.imgArr.splice(i,1);
                }
            },
	        alertTip:function () {
	            console.log('ces');
                this.showAlert = true;
	        }
        },
        computed:{
            editValue:function(val,newValue){
                console.log(val,newValue)
            }
        }
    });




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