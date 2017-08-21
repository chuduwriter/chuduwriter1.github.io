/**
 * 框架
 *
 * @Author zbq
 * @Date 2016-09-19
 */
! function() {

    window.Frame = window.Frame || {};
    var F = Frame = {};

    /**
     * 全局菜单
     */
    F.Frame_Menu = {};

}();

/**
 * 全局菜单
 * 使用方法: 页面加载完成后调用frame.Frame_Menu.init()即可. (注: 全局插件, 只需调用一次).
 */
! function(F, $) {

    var Frame_Menu = F.Frame_Menu;

    /**
     * 初始化全局菜单
     * 1. 绑定点击切换模式开关
     * 2. 绑定点击切换子菜单
     */
    Frame_Menu.init = function() {
        bindToggleMenu();
        bindToggleFold();
        bindToggleSub();
    };

    /**
     * 绑定点击切换模式开关
     */
    var bindToggleMenu = function() {

        $("#toggleMenuBtn").click(function() {
            $(this).toggleClass("icon-3line-x icon-3line-y");
            $("#frameBody").toggleClass("frame-body-full");
        });

    };

    /**
     * 绑定点击切换子菜单
     */
    var bindToggleFold = function() {

        $(".frame-menu-mod a").click(function() {
            $(this).parents(".frame-menu-item").toggleClass("frame-menu-fold");
        });

    };

    /**
     * 绑定点击切换二级菜单
     */
    var bindToggleSub = function() {

        $("#frameMsubToggle").click(function() {
            $("#frameMsub").toggleClass("frame-msub-hide");
        });

    };

}(Frame, jQuery);

/**
 * 全局提示信息
 */
! function(F, $) {

    var TIP_ELE = {

        success: [
            '<div class="frame-tips glb-bg-success">',
            '    <span class="iconfont icon-correct"></span>',
            '</div>'
        ].join(""),

        failed: [
            '<div class="frame-tips glb-bg-warning">',
            '    <span class="iconfont icon-error"></span>',
            '</div>'
        ].join(""),

        waiting: [
            '<div class="frame-tips glb-bg-info">',
            '    <span class="iconfont icon-loading"></span>',
            '</div>'
        ].join(""),

        info: [
            '<div class="frame-tips glb-bg-tip">',
            '    <span class="iconfont icon-info"></span>',
            '</div>'
        ].join("")

    };

    /**
     * 根据返回结果显示对应的提示信息
     *
     * @param rs 返回结果,格式为'{status: "success", message: ""}'
     */
    F.showResult = function(rs, refresh) {
        if(rs.status == 'success'){
			F.showSuccess(rs.message, refresh);
		}
		else {
			F.showError(rs.message);
		}
    };

    /**
     * 显示成功提示信息(无自定义信息时显示"操作成功")
     *
     * @param msg 提示信息,无提示信息时显示"操作成功"
     * @param refresh 为true时自动刷新页面
     */
    F.showSuccess = function(msg, refresh) {
        var tip = $(TIP_ELE['success']).append(msg || '操作成功');
        showTip(tip, refresh);
    };

    /**
     * 显示失败提示信息(无自定义信息时显示"操作失败")
     *
     * @param msg 提示信息,无提示信息时显示"操作失败"
     * @param refresh 为true时自动刷新页面
     */
    F.showError = function(msg, refresh) {
        var tip = $(TIP_ELE['failed']).append(msg || '操作失败');
        showTip(tip, refresh);
    };

    /**
     * 显示等待信息
     *
     * @param msg 提示信息,无提示信息时显示"正在提交,请稍后"
     */
    F.showWaiting = function(msg) {
        var tip = $(TIP_ELE['waiting']).append(msg || '正在提交,请稍后');
        showTip(tip);
    };

    /**
     * 显示提示信息
     */
    F.showInfo = function(msg, refresh) {
        var tip = $(TIP_ELE['info']).append(msg);
        showTip(tip);
    };

    /**
     * 显示提示信息, 3秒后关闭
     */
    var showTip = function(tip, refresh) {

        // 显示提示信息
        removeTip();

        // 添加提示信息并动画显示
        tip.appendTo($("body")).show().addClass("frame-tips-show");

        // 3秒后关闭
        window.setTimeout(function() {
            removeTip(tip);
        }, 3000);

        // 刷新页面
        refresh && window.setTimeout(function() {
            location.reload();
        }, 1200);

    };

    /**
     * 删除提示信息
     */
    var removeTip = function(tip) {

        tip = tip || $(".frame-tips");

        // 隐藏
        tip.addClass("frame-tips-hide");
        // 隐藏动画效果完成后删除
        window.setTimeout(function() {
            tip.remove();
        }, 100);

    };

}(Frame, jQuery);

/**
 * 加载全局通用插件
 * 1. Menu
 */
$(function() {
    Frame.Frame_Menu.init();
});