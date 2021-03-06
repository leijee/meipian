/**
 * Created by leijie on 2018/5/12.
 */
(function () {

	wx.config({
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: _appId, // 必填，公众号的唯一标识
		timestamp: _timestamp, // 必填，生成签名的时间戳
		nonceStr: _nonceStr, // 必填，生成签名的随机串
		signature: _signature,// 必填，签名，见附录1
		jsApiList: ["chooseImage", "uploadImage"]
// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	wx.error(function (res) {
		alert(res.errMsg);
	});

	var hostUrl = location.protocol+'//www.lvman.net';//文件上传后的地址

	/*************store************/
	var state = {
		list: '',
		t_default_ref: '',//添加文字内容ref
		editValue: '',//编辑内容
		index: '',//imgArr下标
		title: '',//点击设置标题
		t_index: 0,//插入文本下标
	};
	var mutations = {
		ADDIMGARR: function (store, data) {
			store.list = data;
			if (typeof data == 'object') {
				localStorage.setItem('imgArr', JSON.stringify(data));
			}
		},
		TDEFAULTREF: function (store, data) {
			store.t_default_ref = data;
			localStorage.setItem('t_default_ref', data);
		},
		EDITVALUE: function (store, data) {
			store.editValue = data;
			localStorage.setItem('editValue', data);
		},
		CURRENTINDEX: function (store, data) {
			store.index = data;
			localStorage.setItem('index', data);
		},
		SETTITLE: function (store, data) {
			store.title = data;
			localStorage.setItem('title', data);
		},
		SETTINDEX: function (store, data) {
			localStorage.setItem('t_index', parseInt(data));
		}
	};
	var getters = {
		imgArrList: function (state) {
			return state.list || JSON.parse(localStorage.getItem('imgArr'));
		},
		t_default_ref: function (state) {
			return state.t_default_ref || localStorage.getItem('t_default_ref');
		},
		editValue: function (state) {
			return state.editValue || localStorage.getItem('editValue');
		},
		index: function (state) {
			if (state.index != '') {
				return state.index;
			} else {
				return localStorage.getItem('index');
			}
		},
		title: function (state) {
			return state.title || localStorage.getItem('title');
		},
		t_index: function (state) {
			return localStorage.getItem('t_index');
		}
	}
	var actions = {
		addItem: function (dis, item) {
			dis.commit('ADDIMGARR', item);
		}
	}
	var _storeObj = new Vuex.Store({
		"state": state,
		"mutations": mutations,
		"getters": getters,
		"actions": actions
	});
	//首页
	var HomePage = {
		template: '<div class="index-home" v-if="activePage">\n' +
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
		'            <div class="home-footer" v-if="hideFooter">\n' +
		'                <div class="footer-item">发现</div>\n' +
		'                <div class="footer-item">\n' +
		'                    <p class="btn-add">+</p>\n' +
		'                    <p>开始制作</p>\n' +
		'                </div>\n' +
		'                <div class="footer-item">我的</div>\n' +
		'            </div>\n' +
		'        </div>',
		data: function () {
			return {
				activePage: true,
				imgArr: [],
				hideFooter:false
			}
		},
		created: function () {
			this.$store.commit("ADDIMGARR", []);
			this.$store.commit('SETTITLE', '');
			this.$store.commit('CURRENTINDEX', '');
			localStorage.setItem('img_index', 0);
			localStorage.setItem('v_index', 0);
			localStorage.setItem('t_index', 0);
		},
		mounted: function () {

		},
		methods: {
			changeImg: function (e) {
				var files = e.target.files;
				this.imgArr = [];
				for (var i = 0, len = files.length; i < len; i++) {
					var imgSrc = getImgURL(files[i],this);
					this.imgArr.push({
						imgUrl: imgSrc,
						c_text: '',//文本内容
						ref: 'item' + i,
						c_ref: 'c_item' + i,
						t_ref: 't_item' + i,
						type: 1//1图片2文本3视频
					})
				}
				console.log(this.imgArr);
				this.$store.commit('ADDIMGARR', this.imgArr);
				this.$store.commit('SETTITLE', '');
				this.activePage = false;
				this.activeSecond = true;
				this.$router.push({
					path: 'second'
				});
			}
		}
	};
	var d_img_len = 10;
	//第二页
	var SecondPage = {
		template: '<div class="index-second" @click="hideAddFlag">\n' +
		'            <div class="tab-bgImg" v-show="selectBgImg">\n' +
		'               <div class="bg-item" v-for="(item,b) in bgImgArr" :key="b"  @click="selectBgImgFun(b,item.imgUrl)">\n' +
		'                   <i :class="(b_img==b)?\'selected\':\'\'"></i>\n' +
		'                   <img :src="item.imgUrl">\n' +
		'               </div>\n' +
		'            </div>' +
		'            <div v-show="isShowHead" class="second-header">\n' +
		'                <img class="bg_header" :src="headBgImg" alt="">\n' +
		'                <div class="header-content">\n' +
		'                    <textarea placeholder="点击设置标题" :value="title" class="content-title" @click.stop="addContent(\'contentTitle\',$event)"></textarea>\n' +
		'                    <div class="content-bottom">\n' +
		'                        <div class="bottom-item item-addMusic"><span @click.stop="addMusicFun">添加音乐</span></div>\n' +
		'                        <div class="bottom-item item-setBg"><span @click="tabBgImgFun">更换封面</span></div>\n' +
		'                    </div>\n' +
		'                </div>\n' +
		'            </div>\n' +
		'            <div class="second-body">\n' +
		'                <div class="body-item" v-for="(item,i) in imgArr">\n' +
		'                    <div class="first-item" v-if="i == 0">\n' +
		'                        <div class="addItem topItem" @click.stop="addTopFlag=false" v-show="addTopFlag">+</div>\n' +
		'                        <div class="add-content" v-show="!addTopFlag">\n' +
		'                        <input type="file" class="selectImg" accept="image/*" multiple="multiple" @change.stop="addImgFun(-1,$event)">\n' +
		'                        <input type="file" class="selectVideo" accept="video/*" multiple="multiple" @change.stop="addVideoFun(-1,$event)">\n' +
		'                        <span class="icon-text" @click.stop="addTextFun(-1)"></span>\n' +
		'                        <span class="icon-img"></span>\n' +
		'                        <span class="icon-video"></span>\n' +
		'                        </div>\n' +
		'                    </div>\n' +
		'                    <div class="item-content">\n' +
		'						 <i v-if="i!=0" class="icon-arrow-top" @click.stop="changeImgIndex(i,0,imgArr.length)"></i>\n'+
		'						 <i v-if="i!=imgArr.length-1" class="icon-arrow-bottom" @click.stop="changeImgIndex(i,1,imgArr.length)"></i>\n'+
		'                        <i class="close" @click="removeCurrentFun(i,item.type)"></i>\n' +
		'                        <div class="item-left">\n' +
		'                            <img class="left-item" v-if="item.type!=3" :src="item.imgUrl" alt="">\n' +
		'                            <input type="file" class="left-item left-input-img" accept="image/*" @change.stop="tabImgFun(i,$event)">\n' +
		'                            <video class="left-item" v-if="item.type==3" :src="item.imgUrl"></video>\n' +
		'                            <img class="left-item left-video" v-if="item.type==3" src="../imgs/bg_video.png">\n' +
		'                            <input type="file" class="left-item left-input-video" v-if="item.type==3" accept="video/*" @change.stop="tabImgFun(i,$event)">\n' +
		'                        </div>\n' +
		'                        <div class="item-right">\n' +
		'                            <textarea placeholder="点击添加文字" :value="item.c_text" class="right-item" @click="addContent(i,$event)" :ref="item.t_ref">\n' +
		'\n' +
		'                            </textarea>\n' +
		'                        </div>\n' +
		'                    </div>\n' +
		'                    <div class="addItem" :ref="item.c_ref" @click.stop="hideAddBottom(item.ref,item.c_ref,$event)" v-if="addBottomFlag+\'i\'">+</div>\n' +
		'                    <div class="add-content" :ref="item.ref">\n' +
		'                        <input type="file" class="selectImg" accept="image/*" multiple="multiple" @change.stop="addImgFun(i,$event)">\n' +
		'                        <input type="file" class="selectVideo" accept="video/*" multiple="multiple" @change.stop="addVideoFun(i,$event)">\n' +
		'                        <span class="icon-text" @click.stop="addTextFun(i)"></span>\n' +
		'                        <span class="icon-img"></span>\n' +
		'                        <span class="icon-video"></span>\n' +
		'                    </div>\n' +
		'                </div>\n' +
		'            </div>\n' +
		'            <div class="second-footer" @click.stop="submitContent">\n' +
		'                <p class="s-footer-text">完成</p>\n' +
		'            </div>\n' +
		'        </div>',
		data: function () {
			return {
				activeSecond: true,
				imgArr: [],
				b_img:0,
                isShowHead:false,//是否显示头部
				addTopFlag: true,
				addBottomFlag: true,
				default_ref: '',
				c_default_ref: '',
				t_default_ref: '',
				title: '',//标题
				fromIndex: '',//来源
				headBgImg: './imgs/bg_header1.jpg',//显示默认背景
				selectBgImg:false,//选择图片
				bgImgArr:[]
			}
		},
		beforeRouteEnter: function (to, from, next) {
			console.log(from.path, '/', from.path == '/')
			if (from.path == '/') {//首页进入
				this.fromIndex = '/';
			} else {
				this.fromIndex = '';
			}
			if (from.path == '/') {//首页进入
				this.fromIndex = '/';
			} else {
				this.fromIndex = '';
			}
			next();
		},
		beforeRouteLeave: function (to, from, next) {
			this.fromIndex = '';
			next();
		},
		created: function () {
			this.t_default_ref = this.$store.getters.t_default_ref || '';
			if (localStorage.getItem('t_index') && localStorage.getItem('t_index') != 'NaN') {
				this.t_index = parseInt(localStorage.getItem('t_index'));
			} else {
				this.t_index = 0;
			}
		},
		mounted: function () {
			console.log('this.fromIndex', this.fromIndex);
			this.imgArr = this.$store.getters.imgArrList;
			this.headBgImg = this.imgArr[0].imgUrl;
			this.title = this.$store.getters.title || '';
			console.log(this.title);
			var _this = this;
			this.$nextTick(function () {
				console.log(_this.fromIndex);
				if (_this.fromIndex == '/') {
					setTimeout(function () {
						alert('最多可以添加' + d_img_len + '张图噢');
					}, 300)
				}
			});
		},
		methods: {
			changeImgIndex:function(i,type,len){
				console.log(i,type,len);
				var temp1 = null;
				var temp2 = null;
				console.log(1111,this.imgArr);
				var _this = this;
				
				var newArr = this.imgArr;
				
				setTimeout(function(){
					if(len>1){
						if(type == 0){//下标往前移动
							 swapItems(_this.imgArr, i, i - 1);
						}else{//下标往后移动
							 swapItems(_this.imgArr, i, i + 1);
						}
						_this.$store.commit('ADDIMGARR', newArr);
					}
				},100);
			},
			//更换封面
			tabBgImgFun:function () {
				var _this = this;
				this.bgImgArr = [];
				this.imgArr.forEach(function(item){
					if(item.type == 1){
						_this.bgImgArr.push(item);
					}
				})
				setTimeout(function(){
					_this.selectBgImg = true;
				},50)
			},
			//选择背景图片
			selectBgImgFun:function (b_img,imgUrl) {
				this.b_img = b_img;
				this.headBgImg = imgUrl;
				this.selectBgImg = false;
			},
			hideAddFlag: function () {
				this.addTopFlag = true;
				if (this.default_ref != '') {
					this.$refs[this.default_ref][0].style.display = 'none';
				}
				console.log(this.c_default_ref);
				if (this.c_default_ref != '') {
					this.$refs[this.c_default_ref][0].style.display = 'block';
				}
			},
			hideAddBottom: function (ref, c_ref, e) {
				console.log(ref,c_ref);
				this.default_ref = ref;
				this.c_default_ref = c_ref;
				console.log(this.$refs,this.c_default_ref);
				if (this.default_ref != '') {
					this.$refs[this.default_ref][0].style.display = 'none';
				}
				if (this.c_default_ref != '') {
					this.$refs[this.c_default_ref][0].style.display = 'block';
				}
				this.addTopFlag = true;
				e.target.style.display = 'none';
				this.$refs[ref][0].style.display = 'block'
			},
			//添加文本
			addTextFun: function (i) {
				this.$store.commit('EDITVALUE', '');
				var new_index = (this.t_index) + 1;
				localStorage.setItem('t_index', new_index);

				console.log(this.$router);

				this.$router.push({
					path: '/edit',
					query: {
						insert: i
					}
				});
			},
			//切换图片url，视频url
			tabImgFun: function (i, e) {
				var file = e.target.files[0];
				var imgSrc = getImgURL(file,this);
				this.imgArr[i].imgUrl = imgSrc;
				var _this = this;
				this.imgArr.forEach(function(item){
					if(item.type == 1){
						_this.bgImgArr.push(item);
					}
				});
				this.headBgImg = this.bgImgArr[0].imgUrl;
				this.$store.commit('ADDIMGARR', this.imgArr);
			},
			//添加图片
			addImgFun: function (i_index, e) {
				var files = e.target.files;
				var old_index = localStorage.getItem('img_index') || 0;
				var new_index = parseInt(old_index);
				localStorage.setItem('img_index', new_index + 1);
				var imgLen = 0;
				this.imgArr.forEach(function (item, i) {
					if (item.type == 1) {
						imgLen += 1;
					}
				});
				var _this = this;
				chooseImage(6,_this,function(imgList){
					for (var i = 0, len = imgList.length; i < len; i++) {
						var imgSrc = imgList.ids;
						var imgObj = {
							imgUrl: imgSrc,
							c_text: '',//文本内容
							ref: 'img' + new_index + i,
							c_ref: 'c_img' + new_index + i,
							t_ref: 't_img' + new_index + i,
							type: 1//1图片2文本3视频
						};
						imgLen++;
						if(imgLen>d_img_len){
							alert('图片张数不能超过' + d_img_len + '张');
							break;
						}else{
							arrayInsert(newArr, i_index, imgObj);
						}
					}
					_this.$store.commit('ADDIMGARR', newArr);
				})
				// for (var i = 0, len = files.length; i < len; i++) {
				// 	var imgSrc = getImgURL(files[i],this);
				// 	var imgObj = {
				// 		imgUrl: imgSrc,
				// 		c_text: '',//文本内容
				// 		ref: 'img' + new_index + i,
				// 		c_ref: 'c_img' + new_index + i,
				// 		t_ref: 't_img' + new_index + i,
				// 		type: 1//1图片2文本3视频
				// 	};
				// 	imgLen++;
				// 	if(imgLen>d_img_len){
				// 		alert('图片张数不能超过' + d_img_len + '张');
				// 		break;
				// 	}else{
				// 		arrayInsert(this.imgArr, i_index, imgObj);
				// 	}
				// }
				// this.$store.commit('ADDIMGARR', this.imgArr);
			},
			//选择视频
			addVideoFun: function (v_index, e) {
				console.log('添加视频', v_index, e);
				var files = e.target.files;
				var old_index = localStorage.getItem('v_index') || 0;
				var new_index = parseInt(old_index);
				console.log(files);
				localStorage.setItem('v_index', new_index + 1);
				var _this = this;
				for (var i = 0, len = files.length; i < len; i++) {
					getVideoURL(files[i],_this,function(imgSrc){
						var imgObj = {
							imgUrl: imgSrc,
							c_text: '',//文本内容
							ref: 'video' + new_index + i,
							c_ref: 'c_video' + new_index + i,
							t_ref: 't_video' + new_index + i,
							type: 3//1图片2文本3视频
						};
						_this.imgArr.splice(v_index + 1, 0, imgObj);
						_this.$store.commit('ADDIMGARR', _this.imgArr);
					});
				}
			},
			//添加内容
			addContent: function (index, e) {
				this.$store.commit('CURRENTINDEX', index);
				// this.t_default_ref = t_ref;
				this.$router.push({
					path: '/edit'
				});
				var value = '';
				if (e) {
					value = e.target.value;
				}
				console.log();
				this.$store.commit('EDITVALUE', value);
			},
			//移除当前
			removeCurrentFun: function (i, _type) {
				var len = 0;
				this.imgArr.forEach(function (item) {
					if (_type == 1 && item.type == 1) {
						len = len + 1;
					}
				});
				var _this = this;
				this.imgArr.forEach(function(item){
					if(item.type == 1){
						_this.bgImgArr.push(item);
					}
				});
				this.headBgImg = this.bgImgArr[0].imgUrl;
				if (len == 1) {
					alert('至少要保留一张照片');
				} else {
					this.imgArr.splice(i, 1);
					this.$store.commit('ADDIMGARR', this.imgArr);
				}

			},
			//添加音乐
			addMusicFun: function () {
				this.$router.push({
					path: '/music'
				})
			},
			//点击完成，预览
			submitContent: function () {
				if (this.title == '') {
					alert('标题不能为空');
					this.addContent('contentTitle', '');
				} else {
					var jsonStr = JSON.stringify(this.imgArr);
                    
                    this.commitJSONHtml(jsonStr,this.imgArr);//提交html片段和json数据
                    
					this.$router.push({
						path: '/review'
					});
				}
			},
            commitJSONHtml:function(jsonStr,imgArr){

				var listStr = '';
				for(var i=0,len=imgArr.length;i<len;i++){
					listStr+='<div class="review-item">' +
								'<p class="item-text">'+imgArr[i].c_text+'</p>' +
								'<img class="item-img" src="'+imgArr[i].imgSrc+'">' +
							'</div>';
				}
				var htmlStr = '<div class="review-list">+listStr+</div>';//提交html片段
				var jsonObj = jsonStr;//提交的json字符串

				//点击完成，提交数据
				this.$http.post(hostUrl,{htmlStr:htmlStr,jsonObj:jsonObj}).then(function(res){
					console.log('html片段和json提交成功',res);
				});
            }
		}
	};
	//文本编辑
	var EdiPage = {
		template: '<div class="index-edit">\n' +
		'            <textarea class="edit-content"  @focus="focusFun" @blur.passive="blurFun" v-model="editValue"  ref="editObj" @input="editFun">\n' +
		'\n' +
		'            </textarea>\n' +
		'            <div class="edit-num">{{textNum}}/{{maxNum}}</div>\n' +
		'            <div class="edit-btn" v-if="showSubmit">\n' +
		'                <span class="btn-submit" @click.stop="submitEdit">完成</span>\n' +
		'            </div>\n' +
		'        </div>',
		data: function () {
			return {
				editValue: '',
				showSubmit: true,
				t_default_ref: '',
				textNum: 0,//文本输入字数
				maxNum: 5000,//字数长度最大值
				imgArr: '',//获取imgArr
				index: '',//当前编辑文本下标
				t_index: 0,//插入文本下标
				isInsert: {
					flag: false,
					index: null
				},//是否是插入文本
			}
		},
		created: function () {
			this.editValue = this.$store.getters.editValue || '';
			this.textNum = this.editValue.length;
			this.t_default_ref = this.$store.getters.t_default_ref || '';
			this.imgArr = this.$store.getters.imgArrList;
			console.log(this.$store.getters.index);
			this.index = this.$store.getters.index;
			if (this.index == 'contentTitle') {
				this.maxNum = 50;
			}
			if (this.$route.query.insert != null || this.$route.query.insert != undefined) {
				this.isInsert.flag = true;
				this.isInsert.index = this.$route.query.insert;
				console.log('localStorage.t_index=' + this.$store.getters.t_index);
				this.t_index = parseInt(localStorage.getItem('t_index'));
			}
		},
		methods: {
			//点击编辑
			editFun: function () {
				if (this.editValue.length > this.maxNum) {
					this.editValue = this.editValue.substr(0, this.maxNum);
				}
				this.textNum = this.editValue.length;
			},
			//光标失去时
			blurFun: function () {
				this.showSubmit = false;
			},
			//光标聚焦
			focusFun: function () {
				this.showSubmit = true;
			},
			//点击完成，提交内容
			submitEdit: function () {
				var value = this.editValue;
				var i = this.index;
				console.log('this.index' + this.index);
				var imgArr = this.imgArr;
				if (this.isInsert.flag == true) {//当前是插入文本
					var newObj = {
						imgUrl: './imgs/bg_text.png',
						c_text: value,//文本内容
						ref: 'text' + this.t_index,
						c_ref: 'c_text' + this.t_index,
						t_ref: 't_text' + this.t_index,
						type: 2//1图片2文本3视频
					};
					console.log('i=' + i);
					arrayInsert(this.imgArr, this.isInsert.index, newObj);
					this.$store.commit('SETTINDEX', this.t_index);
					this.$store.commit('ADDIMGARR', this.imgArr);
				} else {//编辑文本
					if (i == 'contentTitle') {//设置标题，编辑文本内容
						this.$store.commit('SETTITLE', value);
					} else {//设置文本内容
						this.imgArr[i].c_text = value;
						console.log(this.imgArr);
						this.$store.commit('ADDIMGARR', this.imgArr);
					}
				}
            
				var _this = this;
				setTimeout(function () {
					_this.$router.push({
						path: '/second'
					})
				}, 100);
			}
		}
	};
     function swapItems(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    };
	//选择音乐
	var MusicPage = {
		template: '<div class="index-music">\n' +
		'            <div class="tab-list">\n' +
		'                <div class="tab-item" @click="selectFun(1)" :class="isActive?\'active\':\'\'">\n' +
		'                    <span>选择音乐</span>\n' +
		'                </div>\n' +
		'                <div class="tab-item" @click="selectFun(0)" :class="isActive?\'\':\'active\'">\n' +
		'                    <span>搜索音乐</span>\n' +
		'                </div>\n' +
		'            </div>\n' +
		'           <div class="music-select" v-show="isActive">\n' +
		'               <div class="music-no music-item" :class="\'no\'==d_index?\'selected\':\'\'" @click="selectType(\'no\')">\n' +
		'                   <p class="item-title">无背景音乐</p>\n' +
		'               </div>\n' +
		'               <li class="music-list music-item"  v-for="(item,j) in musicTypeList" :key="j" >\n' +
		'                   <div class="top-content" :class="d_index==j&&!typeSelected?\'hasSelected\':\'\'" @click="selectType(j)">\n' +
		'                       <div>\n' +
		'                           <p class="item-title">{{item.typeName}}</p>\n' +
		'                           <p class="item-text">包含{{item.musicNum}}首歌曲</p>\n' +
		'                       </div>\n' +
		'                   </div>\n' +
		'                   <div v-if="d_index==j">\n' +
		'                       <div v-show="typeSelected">\n' +
		'                           <ul class="b-content-list">\n' +
		'                               <li class="b-content-item" v-for="(item,m) in musicList"  :key="m" @click="selectMusic(m,item.musicId)" :class="m_index == m?\'selected\':\'\'">{{item.musicName}}</li>\n' +
		'                           </ul>\n' +
		'                       </div>\n' +
		'                   </div>\n' +
		'\n' +
		'               </li>\n' +
		'               <div class="empty">\n' +
		'\n' +
		'               </div>\n' +
		'               <div class="music-footer" @click="submitSelect(1)">\n' +
		'                   <p class="s-footer-text">完成</p>\n' +
		'               </div>\n' +
		'           </div>\n' +
		'            <div class="music-search" v-show="!isActive">\n' +
		'                <div class="search-content">\n' +
		'                    <i class="icon-search"></i>\n' +
		'                    <input type="text" placeholder="搜索在线音乐">\n' +
		'                </div>\n' +
		'\n' +
		'                <div class="music-footer" @click="submitSelect(0)">\n' +
		'                    <p class="s-footer-text">完成</p>\n' +
		'                </div>\n' +
		'            </div>\n' +
		'        </div>',
		data: function () {
			return {
				isActive: true,
				musicTypeList: [
					{typeName: '圣诞', musicNum: 8, TypeId: 123, musicSrc: ''},
					{typeName: '欢快', musicNum: 10, TypeId: 124, musicSrc: ''},
					{typeName: '优美', musicNum: 13, TypeId: 125, musicSrc: ''},
					{typeName: '浪漫', musicNum: 9, TypeId: 126, musicSrc: ''},
					{typeName: '激情', musicNum: 9, TypeId: 127, musicSrc: ''},
					{typeName: '激情1', musicNum: 9, TypeId: 128, musicSrc: ''},
					{typeName: '激情2', musicNum: 9, TypeId: 129, musicSrc: ''},
					{typeName: '激情3', musicNum: 9, TypeId: 130, musicSrc: ''}
				],
				selectMusicId: '',
				musicList: [
					{
						TypeId: 123,
						musicId: 11,
						musicName: '那个人',
						musicAuthor: '周延英',
						musicUrl: 'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',
						picture: ''
					},
					{
						TypeId: 123,
						musicId: 12,
						musicName: '那个人',
						musicAuthor: '周延英',
						musicUrl: 'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',
						picture: ''
					},
					{
						TypeId: 123,
						musicId: 13,
						musicName: '那个人',
						musicAuthor: '周延英',
						musicUrl: 'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',
						picture: ''
					},
					{
						TypeId: 123,
						musicId: 14,
						musicName: '那个人',
						musicAuthor: '周延英',
						musicUrl: 'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',
						picture: ''
					},
					{
						TypeId: 123,
						musicId: 15,
						musicName: '那个人',
						musicAuthor: '周延英',
						musicUrl: 'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',
						picture: ''
					},
					{
						TypeId: 123,
						musicId: 16,
						musicName: '那个人',
						musicAuthor: '周延英',
						musicUrl: 'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',
						picture: ''
					},
					{
						TypeId: 123,
						musicId: 17,
						musicName: '那个人',
						musicAuthor: '周延英',
						musicUrl: 'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',
						picture: ''
					},
					{
						TypeId: 123,
						musicId: 18,
						musicName: '那个人',
						musicAuthor: '周延英',
						musicUrl: 'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',
						picture: ''
					},
					{
						TypeId: 123,
						musicId: 19,
						musicName: '那个人',
						musicAuthor: '周延英',
						musicUrl: 'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',
						picture: ''
					},
					{
						TypeId: 123,
						musicId: 20,
						musicName: '那个人',
						musicAuthor: '周延英',
						musicUrl: 'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3',
						picture: ''
					},
				],
				d_index: null,
				c_index: null,//当前选中下标
				m_index: 0,//音乐下标
				musicId: '',//当前选中的音乐
				typeSelected: false
			}
		},
		created: function () {
			console.log(this.d_index);
		},
		mounted: function () {
			console.log(123);
		},
		methods: {
			//选择音乐tab切换
			selectFun: function (flag) {
				this.isActive = flag ? true : false;
			},
			//选择音乐类型
			selectType: function (val) {
				this.typeSelected = !this.typeSelected;
				if (val == 'no') {
					this.musicId = '';
				}
				this.d_index = val;
				if (this.c_index != val) {
					this.m_index = 0;//默认选中为第一个
				}
				this.c_index = val;
				console.log(this.d_index == val && !this.typeSelected);
			},
			//选择音乐
			selectMusic: function (val, id) {
				console.log(val);
				this.m_index = val;
				this.musicId = id;
			},
			//确认选择音乐，提交
			submitSelect: function (musicId) {
				console.log('this.musicId=', this.musicId);

				this.$router.push({
					path: '/second'
				})

			},
		}
	}
	//预览页
	var ReviewPage = {
		template: '<div class="index-review">\n' +
		'            <div class="review-header">\n' +
		'                <i class="head-item icon-home" @click="toBackHome"></i>\n' +
		'                <span class="head-item head-back-home" @click="toBackHome">回到首页</span>\n' +
		'                <span class="head-item head-edit" @click="editPage">编辑</span>\n' +
		'            </div>\n' +
		'            <div class="review-content">\n' +
		'                <h3 class="review-title">设置标题</h3>\n' +
		'                <div class="review-userInfo">\n' +
		'                    <span class="info-date">{{userInfoObj.date}}</span><span class="info-name">{{userInfoObj.name}}</span><span class="info-text">阅读 {{userInfoObj.num}}</span>\n' +
		'                </div>\n' +
		'\n' +
		'                <div class="review-list">\n' +
		'                    <div class="review-item" v-for="(item,r) in imgArr" :key="r">\n' +
		'                        <p class="item-text">{{item.c_text}}</p>\n' +
		'                        <img v-if="item.type == 1" class="item-img" :src="item.imgUrl">\n' +
		'                        <video v-if="item.type == 3" controls class="item-video" :src="item.imgUrl"></video>\n' +
		'                    </div>\n' +
		'                </div>\n' +
		'            </div>\n' +
		'        </div>',
		created: function () {
			this.imgArr = this.$store.getters.imgArrList;//获取编辑后的图片，视频，文本
			this.title = this.$store.getters.title;
		},
		data: function () {
			return {
				userInfoObj: {
					date: '2018-05-15',
					name: 'username123',
					num: 0
				},
				title: '',
				imgArr: '',
				musicId: '',
				musicUrl: ''
			}
		},
		methods: {
			//返回首页
			toBackHome: function () {
				this.$router.push({
					path: '/'
				})
			},
			//编辑页面
			editPage: function () {

				this.$store.commit('ADDIMGARR',this.imgArr);
				this.$store.commit('SETTITLE',this.title);

				this.$router.push({
					path: '/second'
				});
			}
		}
	}


	//路由设置
	var routerObj = [
		{path: '/', component: HomePage},
		{path: '/second', component: SecondPage},
		{path: '/edit', component: EdiPage},
		{path: '/music', component: MusicPage},
		{path: '/review', component: ReviewPage},
	];

	var router = new VueRouter({
		routes: routerObj,
		// mode: 'history'
	})

	//自动安装了vuex和vue-route
	var app = new Vue({
		router: router,
		store: _storeObj,
		el: "#app",
		data: {
			imgArr: [123]
		},
		mounted: function () {

		},
		methods: {}
	});


	//获取图片的url
	function getImgURL(file,_this,callback) {
		var _this = _this;
		var url = null;
		// 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
		if (window.createObjectURL != undefined) { // basic
			url = window.createObjectURL(file);
		} else if (window.URL != undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file);
		} else if (window.webkitURL != undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file);
		}
		return url;
	}
	function chooseImage(count, callback) {
		wx.chooseImage({
			count: count, // 默认6
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
				syncUpload(localIds, callback);
			}
		});
	}
	var _wxImg = [];
	/**
	 * 上传图片并保存本地服务器
	 * @param localIds 数量
	 * @param resultCallBack 回调方法
	 */
	function syncUpload(localIds, resultCallBack) {
		var localId = localIds.pop();

		wx.uploadImage({
			localId: localId,
			isShowProgressTips: 1,
			success: function (res) {
				var serverId = res.serverId; // 返回图片的服务器端ID
				_wxImg.push(saveImg(serverId));
				//其他对serverId做处理的代码
				if (localIds.length > 0) {
					syncUpload(localIds, resultCallBack);
				}else{
					resultCallBack(_wxImg);
					_wxImg = [];
				}
			}
		});
	};



	//上传视频
	function getVideoURL(file,_this,callback){
		var _this = _this;
		var url = null;
		if(_this){
			var fileData = new FormData();
			fileData.append('file', file);
			console.log('fileData=',file,fileData);
			_this.$http.post(hostUrl+'/upload/kindeditorJson?rename=1',fileData).then(function(res){
				url = hostUrl+res.body.path;
				console.log(res);
				console.log(url);
				if(callback){
					callback(url);
				}
			});
		}
	}
	/**
	 * 数组指定位置插入数据
	 * @param arr 当前数组
	 * @param i 插入下标
	 * @param item 插入值
	 * return 返回一个新的数组
	 */
	function arrayInsert(arr, i, item) {
		if (i == -1) {
			arr.unshift(item);//插入数组第一个前面
		} else {
			arr.splice(i + 1, 0, item);//插入数组下标为i的后面
		}
	}

})();