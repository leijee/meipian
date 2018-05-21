!function(){Vue.component("vAlert",{props:["a_title","a_content","showAlert","sureFun","cancelFun"],template:'<div class="index-alert" v-if="showAlert">\n            <div class="mask"></div>\n            <div class="alert-content">\n                <div class="content-title">{{currentTitle}}</div>\n                <div class="content-text"></div>\n                <div class="content-btn">\n                    <div class="btn-cancel" @click="cancelFun">取消</div>\n                    <div class="btn-sure" @click="sureFun">确定</div>\n                </div>\n            </div>\n        </div>',data:function(){return{}},computed:{currentTitle:function(){return this.$props.a_title},showAlert:function(){return this.$props.showAlert}},watch:{showAlert:function(t,e){console.log(t,e)}},created:function(){},methods:{cancelFun:function(){console.log(this.$props.cancel),"function"==typeof this.$props.cancel?this.$props.cancelFun():this.showAlert=!1},sureFun:function(){"function"==typeof this.$props.sureFun?this.showAlert=this.$props.sureFun():this.showAlert=!1}}});new Vue({el:"#app",data:{activePage:!1,activeSecond:!0,activeEdit:!1,activeMusic:!1,activeReview:!1,contentTitle:"点击设置标题",imgArr:[{imgUrl:"",ref:"item1",c_ref:"c_item1",t_ref:"t_item1"},{imgUrl:"",ref:"item2",c_ref:"c_item2",t_ref:"t_item2"},{imgUrl:"",ref:"item3",c_ref:"c_item3",t_ref:"t_item3"}],default_ref:"",c_default_ref:"",t_default_ref:"",addTopFlag:!0,addBottomFlag:!0,editValue:"",textNum:0,maxNum:5e3,showSubmit:!0,isActive:!0,musicTypeList:[{typeName:"圣诞",musicNum:8,TypeId:123,musicSrc:""},{typeName:"欢快",musicNum:10,TypeId:124,musicSrc:""},{typeName:"优美",musicNum:13,TypeId:125,musicSrc:""},{typeName:"浪漫",musicNum:9,TypeId:126,musicSrc:""},{typeName:"激情",musicNum:9,TypeId:127,musicSrc:""},{typeName:"激情1",musicNum:9,TypeId:128,musicSrc:""},{typeName:"激情2",musicNum:9,TypeId:129,musicSrc:""},{typeName:"激情3",musicNum:9,TypeId:130,musicSrc:""}],musicList:[{TypeId:123,musicId:11,musicName:"那个人",musicAuthor:"周延英",musicUrl:"http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3",picture:""},{TypeId:123,musicId:12,musicName:"那个人",musicAuthor:"周延英",musicUrl:"http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3",picture:""},{TypeId:123,musicId:13,musicName:"那个人",musicAuthor:"周延英",musicUrl:"http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3",picture:""},{TypeId:123,musicId:14,musicName:"那个人",musicAuthor:"周延英",musicUrl:"http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3",picture:""},{TypeId:123,musicId:15,musicName:"那个人",musicAuthor:"周延英",musicUrl:"http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3",picture:""},{TypeId:123,musicId:16,musicName:"那个人",musicAuthor:"周延英",musicUrl:"http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3",picture:""},{TypeId:123,musicId:17,musicName:"那个人",musicAuthor:"周延英",musicUrl:"http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3",picture:""},{TypeId:123,musicId:18,musicName:"那个人",musicAuthor:"周延英",musicUrl:"http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3",picture:""},{TypeId:123,musicId:19,musicName:"那个人",musicAuthor:"周延英",musicUrl:"http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3",picture:""},{TypeId:123,musicId:20,musicName:"那个人",musicAuthor:"周延英",musicUrl:"http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3",picture:""}],d_index:0,c_index:null,m_index:0,musicId:"",typeSelected:!0,a_title:"是否关闭",a_content:"哇哈哈哈",showAlert:!1,sureFun:null,cancelFun:null},created:function(){console.log("test")},mounted:function(){},methods:{changeImg:function(t){var e=t.target.files;this.imgArr=[];for(var i=0,c=e.length;i<c;i++){var s=u(e[i]);this.imgArr.push({imgUrl:s,ref:"item"+i,c_ref:"c_item"+i,t_ref:"t_item"+i,type:1})}console.log(this.imgArr),this.activePage=!1,this.activeSecond=!0},hideAddFlag:function(){this.addTopFlag=!0,""!=this.default_ref&&(this.$refs[this.default_ref][0].style.display="none"),console.log(this.c_default_ref),""!=this.c_default_ref&&(this.$refs[this.c_default_ref][0].style.display="block")},hideAddBottom:function(t,e,i){""!=this.default_ref&&(console.log(this.$refs[this.default_ref][0]),this.$refs[this.default_ref][0].style.display="none"),""!=this.c_default_ref&&(console.log(this.$refs[this.c_default_ref][0]),this.$refs[this.c_default_ref][0].style.display="block"),this.default_ref=t,this.c_default_ref=e,this.addTopFlag=!0,i.target.style.display="none",this.$refs[t][0].style.display="block"},editFun:function(){this.editValue.length>this.maxNum&&(this.editValue=this.editValue.substr(0,this.maxNum)),this.textNum=this.editValue.length},blurFun:function(){this.showSubmit=!1},focusFun:function(){this.showSubmit=!0},submitEdit:function(){var t=this.editValue;this.activeSecond=!0,this.activeEdit=!1,""!=this.t_default_ref&&this.$nextTick(function(){"contentTitle"==this.t_default_ref?this.$refs[this.t_default_ref].value=t:this.$refs[this.t_default_ref][0].value=t})},addContent:function(t,e){this.t_default_ref=t,this.activeSecond=!1,this.activeEdit=!0,this.editValue=e.target.value},selectFun:function(t){this.isActive=!!t},selectType:function(t){this.typeSelected=!this.typeSelected,"no"==t&&(this.musicId=""),this.d_index=t,this.c_index!=t&&(this.m_index=0),this.c_index=t,console.log(this.d_index==t&&!this.typeSelected)},selectMusic:function(t,e){console.log(t),this.m_index=t,this.musicId=e},submitSelect:function(t){console.log("this.musicId=",this.musicId)},addMusicFun:function(){this.activeSecond=!1,this.activeMusic=!0},removeCurrentFun:function(t,e){var i=0;this.imgArr.forEach(function(t){t.type==e&&(i+=1)}),1==i?alert("至少要保留一张照片"):this.imgArr.splice(t,1)},alertTip:function(){console.log("ces"),this.showAlert=!0}},computed:{editValue:function(t,e){console.log(t,e)}}});function u(t){var e=null;return null!=window.createObjectURL?e=window.createObjectURL(t):null!=window.URL?e=window.URL.createObjectURL(t):null!=window.webkitURL&&(e=window.webkitURL.createObjectURL(t)),e}}();