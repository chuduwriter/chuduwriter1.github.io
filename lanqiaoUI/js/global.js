/**
 * 工具类
 *
 * @Author zbq
 * @Date 2016-10-26
 */
! function($) {

    window.Util = window.Util || {};

    var win = window,
        doc = win.document;

    /**
     * 获取Cookie
     */
    Util.getCookie = function(name) {
        var m = document.cookie
            .match('(?:^|;)\\s*' + name + '=([^;]*)');
        return(m && m[1]) ? decodeURIComponent(m[1]) : '';
    };

    /**
     * 设置Cookie
     */
    Util.setCookie = function(name, val, expires, domain, path, secure) {
        var text = String(encodeURIComponent(val));
        // 有效期
        if(this.isNumber(expires)) {
            var date = new Date();
            date
                .setTime(date.getTime() + expires * 24 * 60 * 60 *
                    1000);
            text += '; expires=' + date.toUTCString();
        }
        // 访问域,访问路径,加密
        text += this.isString(domain) ? '; domain=' + domain : '';
        text += this.isString(path) ? '; path=' + path : '';
        text += secure ? '; secure' : '';

        doc.cookie = name + '=' + text;
    };

    /**
     * 清除Cookie
     */
    Util.deleteCookie = function(name) {
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        doc.cookie = name + "=a; expires=" + date.toGMTString();
    };

    /**
     * 获取手机卡运营商
     */
    Util.getMobileType = function() {
        if(!__GetZoneResult_) {
            return -1;
        }

        var cat = __GetZoneResult_['catName'];
        if(!cat) {
            return -1;
        }

        if(cat == '中国移动') {
            return 1;
        } else if(cat == '中国联通') {
            return 2;
        } else if(cat == '中国电信') {
            return 3;
        } else {
            return 4;
        }

    };

    /**
     * 使用逗号拼接checkbox的value
     */
    Util.appendCbVal = function(cbs) {
        if(!cbs.length) {
            return "";
        }

		var arr = [];

		$.each(cbs, function(i, cb){
			arr.push(cb.val());
		});

		return arr.join(",");

    };

    /**
     * Form转JSON
     */
    $.fn.json = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if(o[this.name]) {
                if(!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

}(jQuery);

/**
 * 全局插件
 *
 * @Author zbq
 * @Date 2016-09-19
 */
! function() {

    window.Global = window.Global || {};
    var G = Global = {};

    /**
     * 开关组件
     */
    G.GLB_Selector = {};

    /**
     * 组
     */
    G.GLB_Group = {};

    /**
     * 输入框
     */
    G.GLB_Inputs = {};

    /**
     * 上传图片
     */
    G.GLB_UploadFile = {};

    /**
     * 索引页导航
     */
    G.GLB_IndexNav = {};

}();

/**
 * 选择组件
 * 使用方法: 页面加载完成后调用Global.GLB_Selector.init()即可.
 */
! function(G, $) {

    var GLB_Selector = G.GLB_Selector;

    /**
     * 初始化
     */
    GLB_Selector.init = function(wrapper) {

        (wrapper || $("body")).find(".glb-selector").each(function() {

            new Selector($(this));

        });

    };

    /**
     * 选择组件对象
     */
    var Selector = function(selector) {

        /**
         * 当前对象 区分事件内this对象
         */
        var t = this;

        // 选择器
        t.selector = selector;

        // 选中项
        t.selected = t.selector.find("dt .form-hidden");

        // 最大可选项, 未设置为1
        t.max = t.selector.data("max") || 1;

        // 最小必选项, 未设置为1
        t.min = t.selector.data("min") == undefined ? 1 : t.selector.data("min");

        // 项(只有选项为a标签的进行处理)
        t.options = t.selector.find("a.option");

        /**
         * 初始化
         */
        this.init();

        /**
         * 点击选项
         */
        t.options.click(function() {
            var op = $(this);
            window.setTimeout(function() {
                t.onclick(op);
            }, 20);

        });

        /**
         * 模拟点击选项
         */
        t.options.on("select", function() {

            t.onclick($(this));

        });

    };

    // 选择器原型
    Selector.prototype = {

        /**
         * 初始化被选中项值
         */
        init: function() {

            // 设置默认选中项的CHECKBOX为选中
            this.selector.find(".on").each(function() {

                $(this).find(".form-cb").prop("checked", true);

            });

            // 设置已选中值
            this.setSelected();

        },

        /**
         * 点击处理
         */
        onclick: function(op) {

            var dd = op.parent(),
                total = this.selector.find(".on").length;

            // 设置最大可选数量时,当选中某项后所选项数量大于最大数量时
            // 切换首个被选中项为未选中
            if(!dd.hasClass("on") && total >= this.max) {
                dd.siblings("dd.on:first").find(".form-cb").removeProp("checked");
                dd.siblings("dd.on:first").removeClass("on");
            }

            // 设置最小选项数量时,当取消某项后所选数量小于最小数量时
            // 不进行取消选项操作
            if(dd.hasClass("on") && total <= this.min) {
                return;
            }

            // 切换当前点击项
            dd.toggleClass("on");
            dd.find(".form-cb").prop("checked", dd.hasClass("on")).trigger("check");

            // 设置已选中值
            this.setSelected();

        },

        /**
         * 设置选中植
         */
        setSelected: function() {

            var t = this,
                a = [];

            t.selected && t.selected.val(function() {
                t.selector.find(".on .form-cb").each(function() {
                    a.push($(this).val());
                });
                return a.join(",");
            }).change();

        }

    };

}(Global, jQuery);

/**
 * 分组插件(手风琴)
 *
 * 使用方法: 引用global.js即可, 默认展开所有组. 可以通过在组的外围容器中设置下列样式实现相应配置:
 * > glb-group-exclusive: 展开某一组时关闭其他组
 * 如需让滚动条显示到某一组时,在URL后增加相应组ID的描点, 例a.html#here,滚动条默认到id为hereItem的组
 *
 * 插件需要的DOM结构: 插件会按以下结构进行组的设置, 其中***为组的任意内容
 * 折叠时: 隐藏glb-group-bd内容,只显示glb-group-hd内容
 * ----------------------------------------------------------------
 * <div class="glb-group glb-group-exclusive">
 *     <div class="glb-group-item">
 *         <div class="glb-group-hd">*********</div>
 *         <div class="glb-group-bd">*********</div>
 *     </div>
 * </div>
 * ----------------------------------------------------------------
 * 如需默认不显示某一组
 * 1. 在glb-group-bd中添加display:none;
 * 2. 在glb-group-item标签添加glb-group-folded样式
 * ----------------------------------------------------------------
 * <div class="glb-group">
 *     <div class="glb-group-item glb-group-folded">
 *         <div class="glb-group-hd">*********</div>
 *         <div class="glb-group-bd" style="display:none;">*********</div>
 *     </div>
 * </div>
 * ----------------------------------------------------------------
 *
 * @Author zbq
 * @Date 2016-09-19
 */
! function(G, $) {

    var GLB_Group = G.GLB_Group;

    /**
     * 初始化
     */
    GLB_Group.init = function(configs) {

        ((configs && configs.wrapper) || $("body")).find(".glb-group").each(function() {

            new Grouper($(this), configs);

        });

    };

    /**
     * 组
     *
     * @param group 当前组
     * @param options 配置
     */
    var Grouper = function(group, options) {

        var t = this;

        /**
         * 合并内外部参数
         */
        t.configs = $.extend({}, options);

        /**
         * 当前组
         */
        t.group = group;

        /**
         * 展开某组是是否关闭其他组
         */
        t.singleton;

        /**
         * 页面滑动至ID对应的组
         */
        t.fowardId;

        /**
         * 初始化
         */
        t.init();

    };

    /**
     * 组对象方法
     */
    Grouper.prototype = {

        init: function() {

            var t = this;

            //展开某组是是否关闭其他组
            t.singleton = t.group.hasClass("glb-group-exclusive");

            //页面滑动至ID对应的组
            t.fowardId = location.hash && location.hash.substring(1);;

            // 页面滑动至某组
            t.slideToItem();

            // 绑定组,添加折叠展开按钮
            t.group.find(".glb-group-item").each(function() {

                t.onClickItem($(this));

            });

        },

        /**
         * 点击组内item时
         */
        onClickItem: function(item) {

            var t = this,
                btn = $(Grouper.Elms['groupBtn']);

            // 添加展开折叠按钮
            item.find(".glb-group-hd").append(btn);

            // 绑定展开折叠事件
            btn.on("click", function() {

                t.showGroup(item);

            });

        },

        /**
         * 将屏幕滚动到特定的组中
         * 根据链接后的描点中的字符,如果为某个对象的ID,则滚动至该对象所在位置
         * 例: <div id="box">, 链接为:a.html#box则屏幕滚动至#box位置
         */
        slideToItem: function() {

            var foward = $('#' + this.fowardId + 'Item');

            if(foward.length) {

                $("html, body").animate({
                    scrollTop: foward.offset().top - 54
                });

            }

        },

        /**
         * 展开某一组
         */
        showGroup: function(item) {

            var bd = item.find(".glb-group-bd");

            if(bd.is(":hidden")) {

                item.removeClass("glb-group-folded");
                bd.stop().slideDown();

                if(this.singleton) {
                    this.hideGroup(item.siblings());
                }

            } else {

                this.hideGroup(item, bd);

            }

        },

        /**
         * 折叠某一组
         *
         * @param 组DOM对象
         */
        hideGroup: function(item, bd) {

            item.addClass("glb-group-folded");
            (bd || item.find(".glb-group-bd")).stop().slideUp();

        }

    };

    // DOM
    Grouper.Elms = {

        // 展开折叠按钮
        groupBtn: [
            '<a class="group-btn" href="javascript:;">',
            '	<span class="iconfont icon-fold"></span>',
            '</a>'
        ].join("")

    };

}(Global, jQuery);

/**
 * 格式化组件
 * 使用方法: 页面加载完成后调用Global.GLB_Inputs.init()即可.
 */
! function(G, $) {

    var GLB_Inputs = G.GLB_Inputs;

    /**
     * 初始化
     */
    GLB_Inputs.init = function() {

        new MoneyInputs();

    };

    /**
     * 金钱输入框对象
     */
    var MoneyInputs = function() {

        $("input.form-ipt-money").focus(function() {
            $(this).css("ime-mode", "disabled");
        }).keypress(function(e) {
            var k = e.which;
            return k == 46 || (k >= 48 && k <= 57) || k == 8;
        }).keyup(function() {
            var m = $(this).val().match(/\d+\.?\d{0,2}/);
            if(m) {
                $(this).val(m[0] || '');
            } else {
                $(this).val('');
            }
        }).blur(function() {
            if($.isNumeric($(this).val())) {
                var n = new Number($(this).val())
                $(this).val(n.toFixed(2));
            }
        }).change(function() {
            $(this).keyup();
        }).on("paste", function() {
            $(this).keyup();
        });

    };

}(Global, jQuery);

/**
 * 上传图片
 * 使用方法: 页面加载完成后调用Global.GLB_UploadFile.init()即可.
 */
! function(G, $) {

    var GLB_UploadFile = G.GLB_UploadFile;

    /**
     * 初始化
     */
    GLB_UploadFile.init = function(wrapper) {

        /**
         * 遍历上传按钮
         */
        (wrapper || $("body")).find(".btn-image-upload").each(function(i, btn) {

            new FileUploader($(this), {
                index: i
            });

        });

    };

    /**
     * 选择组件对象
     */
    var FileUploader = function(btn, options) {

        /**
         * 合并内外部参数
         */
        this.configs = $.extend({

            // 文件序号(同一个页面中多个文件通过此序号区分)
            index: 0,

            // 提交时校验成功
            // 调用此函数处理
            onSuccess: ''

        }, options);

        //上传按钮
        this.uploadBtn = btn;

        // 关闭按钮
        this.closeBtn = $(FileUploader.Elms['closeBtn']);;

        //文件ID, ajaxFileUpload需要制定文件按钮ID
        this.fileBtnId = 'file-btn-' + this.pk + '-' + (this.configs.index + 1);

        // 标识,每个对象一个固定标识
        this.pk;

        // 文件类型
        this.fileType;

        // 上传文件服务器路径
        this.uploadUrl;

        // 显示图片时服务器地址
        this.serverUrl;

        // 上传文件路径隐藏表单
        this.formValue;

        // 图片预览
        this.preview;

        /**
         * 初始化
         */
        this.init();

        /**
         * 绑定点击上传按钮
         */
        this.bindUploadBtnClick();

        /**
         * 绑定点击文件选中按钮
         */
        //this.bindFileBtnClick();

    };

    // 选择器原型
    FileUploader.prototype = {

        /**
         * 初始化上传组件
         */
        init: function() {

            this.uploadBtn.after($(FileUploader.Elms['fileBtn']).attr("id", this.fileBtnId));

            this.pk = Math.floor(Math.random() * 100000);
            this.fileType = this.uploadBtn.data("type") || "img";
            this.uploadUrl = this.uploadBtn.data("action");
            this.serverUrl = this.uploadBtn.data("server");
            this.formValue = this.uploadBtn.siblings(".form-hidden");
            this.preview = this.uploadBtn.siblings(".glb-preview");

        },

        /**
         * 点击上传按钮处理
         */
        bindUploadBtnClick: function() {

            var t = this;

            // 点击上传按钮
            t.uploadBtn.click(function() {

                // 触发点击选择文件按钮,弹出文件选择框
                // 当文件变化(选中新文件)时提交文件
                $('#' + t.fileBtnId).click().off().on("change", function() {

                    $.ajaxFileUpload({

                        url: t.uploadUrl,
                        fileElementId: t.fileBtnId,
                        dataType: "json",
                        success: function(rs, status) {

                            var path = rs.message;

                            // 表单校验
                            t.formValue.val(path).prop("checked", true);
                            t.formValue.trigger("check");

                            // 如果是图片添加预览图片并绑定关闭
                            t.isImage() && t.onImageUploadSuccess(path);

                            // 执行自定义函数
                            t.configs.onSuccess && t.configs.onSuccess(path);

                        }

                    });

                });

            });

        },

        /**
         * 图片类型上传成功后处理
         */
        onImageUploadSuccess: function(path) {

            var t = this;

            // 添加预览
            t.preview.empty().append('<img src="' + t.serverUrl + path + '" />');

            // 绑定删除图片按钮
            window.setTimeout(function() {
                t.bindClose();
            }, 100);

        },

        /**
         * 绑定图片关闭
         */
        bindClose: function() {

            var t = this;

            t.closeBtn.appendTo(t.preview).show();
            t.closeBtn.one("click", function(e) {
                t.preview.empty();
                t.formValue.val("").prop("checked", false);
                t.formValue.trigger("check");
            });

        },

        /**
         * 文件类型是否是图片
         */
        isImage: function() {
            return this.fileType == 'img';
        }

    };

    // 图片上传DOM
    FileUploader.Elms = {

        // 文件按钮
        fileBtn: [
            '<input type="file" class="form-hide btn-virtual-file" name="file" value="" />'
        ].join(""),

        // 预览关闭按钮
        closeBtn: [
            '<a class="priview-close" href="javascript:;">X</a>'
        ].join("")

    };

}(Global, jQuery);

/**
 * 索引导航
 * 使用方法: 页面加载完成后调用Global.GLB_IndexNav.init()即可.
 */
! function(G, $) {

    var GLB_IndexNav = G.GLB_IndexNav;

    /**
     * 初始化
     */
    GLB_IndexNav.init = function(wrapper) {

        /**
         * 遍历上传按钮
         */
        (wrapper || $("body")).find(".glb-index").each(function(i, index) {

            new IndexNav($(this));

        });

    };

    /**
     * 选择组件对象
     */
    var IndexNav = function(index, options) {

        /**
         * 合并内外部参数
         */
        this.configs = $.extend({}, options);

        // 上传按钮
        this.index = index;

        // 导航
        this.nav;

        // 内容
        this.main;

        // 当前页
        this.page;

        // 是否自动索引
        this.autoIndex;

        /**
         * 初始化
         */
        this.init();

    };

    // 索引页导航原型
    IndexNav.prototype = {

        /**
         * 初始化索引导航
         */
        init: function() {

            // 初始化导航
            this.nav = this.index.find(".glb-index-nav");

            // 内容
            this.main = $(".glb-index-main");

            // 是否自动索引
            this.autoIndex = !this.index.hasClass("glb-index-manual");

            // 初始化导航布局
            this.nav && this.setLayout();

            // 点击导航定位至对应的位置
            this.autoIndex && this.bindClickNav();

        },

        /**
         * 设置布局
         */
        setLayout: function() {

            if(this.isNavOver()) {

                this.page = this.main;
                this.setMainScroll();

            } else {

                this.page = $(".frame-page");
                this.setNavFixed();

            }

        },

        /**
         * 导航是否超出屏幕
         */
        isNavOver: function() {
            return this.nav.offset().top + this.nav.height() >= $(window).height();
        },

        /**
         * main添加单独导航条
         */
        setMainScroll: function() {

            this.index.addClass("glb-index-over");

        },

        /**
         * 未超出屏幕时,固定导航
         */
        setNavFixed: function() {

            var t = this;

            t.page.scroll(function() {

                if(t.page.scrollTop() > 61) {

                    t.nav.css({
                        position: "fixed",
                        top: 71,
                        left: t.nav.offset().left
                    });

                } else {

                    t.nav.removeAttr("style");

                }

            });

        },

        /**
         * 点击导航项,页面定位至指定位置
         */
        bindClickNav: function() {

            var t = this;

            // 点击导航项
            t.nav.find(".gang-item").click(function() {

                var li = $(this).parent(),
                    item = t.main.children().eq(li.index());

                // 添加选中样式
                li.addClass("gang-active");
                li.siblings().removeClass("gang-active");

                // 页面滑动至对应位置
                t.page.animate({
                    "scrollTop": item.position().top
                });

            });

        }

    };

}(Global, jQuery);

/**
 * 加载全局通用插件
 * 1. Selector
 * 2. Group
 * 3. Inputs
 * 4. Upload image
 * 5. 索引页导航
 */
$(function() {

    Global.GLB_Selector.init();
    Global.GLB_Group.init();
    Global.GLB_Inputs.init();
    Global.GLB_UploadFile.init();
    Global.GLB_IndexNav.init();

});