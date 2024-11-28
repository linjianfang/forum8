function set_common(original, original_started){
  Promise.resolve()
    .then(set_common_html) // 共通HTMLを読み込み
    .then(set_functions) // 関数を登録
    .then(original) // 独自の関数を登録
    .then(set_offset) // 表示位置を調整
    .then(remove_loading) // ローディング表示を解除
    .then(original_started); // 独自の関数をローディング表示解除後に実行
}

function set_common_html(){
  return Promise.all([
    set_header(),
    set_sidebar(),
    set_side_buttons(),
    set_products_list(),
    set_footer()
  ]);
}

function set_header(){
  return new Promise(function (resolve, reject) {
    $("#header").load(root + "../parts/header-cn.html", function(response, status, xhr){
      if(status !== "success") $("#header").html("<p style='text-align:center;'>连接失败</p>");
      if(listen_image_loaded(response)) resolve(status);
    });
  });
}

function set_footer(){
  return new Promise(function (resolve, reject) {
    $("#footer").load(root + "../parts/footer-cn.html", function(response, status, xhr){
      if(status !== "success") $("#footer").html("<p style='text-align:center;'>连接失败</p>");
      if(listen_image_loaded(response)) resolve(status);
    });
  });
}

function set_sidebar(){
  return new Promise(function (resolve, reject) {
    $(".sidebar").load(root + "../parts/sidebar-cn.html", function(response, status, xhr){
      if(status !== "success") $(".sidebar").html("<p style='text-align:center;'>连接失败</p>");
      if(listen_image_loaded(response)) resolve(status);
    });
  });
}

function set_side_buttons(){
  return new Promise(function (resolve, reject) {
    $(".side_buttons_area").load(root + "../parts/side_buttons-cn.html", function(response, status, xhr){
      if(status !== "success") $(".side_buttons_area").html("<p style='text-align:center;'>连接失败</p>");
      resolve(status);
    });
  });
}

function set_products_list(){
  return new Promise(function (resolve, reject) {
    $(".side_navi_area").load(root + "../parts/products_list-cn.html", function(response, status, xhr){
      if(status !== "success") $(".side_navi_area").html("<p style='text-align:center;'>通信に失敗しました</p>");
      resolve(status);
    });
  });
}

function listen_image_loaded(response){
  return new Promise(function (resolve, reject) {
    var img_length = 0, loaded_length = 0;
    $("img", response).each(function(index, value){
      img_length ++;
      $(value).bind("load", function(){
        loaded_length ++;
        if(loaded_length >= img_length) resolve();
      });
    });
  });
}

function set_functions(){
  toggle_sidebar();

  $(".common_sitemap_products dl").each(function(index, value){
    var is_small_device = function(){
      return $(value).find("dd").css("display") === "none";
    }
    var is_active = function(){
      return $(value).hasClass("active");
    }
    var toggle_dl = function(){
      var active = is_active();
      var toggle_icon = function(){
        if(active){
          $(value).find("i").addClass("fa-chevron-down").removeClass("fa-chevron-up");
        }else{
          $(value).find("i").addClass("fa-chevron-up").removeClass("fa-chevron-down");
        }
      }

      toggle_icon();
      $(value).removeClass("active")
      if(!active){
        $(value).addClass("active");
      }
    }

    // デバイスの横幅が413px以下の場合はトグルを機能させる
    if(is_small_device) $(value).on("click", "dt", toggle_dl);
  });

  $(".modal_image").modaal({
    type: "image"
  });

  toggle_go_top();
  $(window).scroll(function(){
    toggle_go_top();
  });
  function toggle_go_top(){
    if($(this).scrollTop() <= 0){
      $("#go_top").fadeOut("fast");
    }else{
      $("#go_top").fadeIn("fast");
    }
  }

  // サイト内検索
  var search_site = function() {
    var query = $("#searchInput").val();
    query = query.replace(/\"/g, "");
    if (query.match("/")) {
      query = "\"" + query + "\"";
    }
    $('#searchQuery').val(query);
    $("#searchForm").get(0).submit();
    return false;
  };
  $("#searchForm").submit(search_site);
  $("i.fa-search").click(search_site);
}

function toggle_sidebar(){
  // ドロワー
  $(".side_button_products, .header_smartphone, .overlay").on("click", toggle_menu);

  // 製品一覧のシリーズ別とソリューション別の表示を切替
  $(".side_navi_tabs a").on("click", function(){
    $(".side_navi_tabs a").removeClass("active");
    $(this).addClass("active");

    $("[data-navi-type]").removeClass("active");
    $("[data-navi-type='" + $(this).find("p").attr("data-show-type") + "']").addClass("active");
  });
}

function toggle_menu(){
  show_drawer(is_drawer_open());
}

function is_drawer_open(){
  return $("body").hasClass("drawer-open");
}

function show_drawer(status){
  if(status !== true) status = false;

  if(status === true){
    const nevative_margin = $("body").css("top");
    $("body").removeClass("drawer-open");
    $("body").css("top", 0);
    $(window).scrollTop(parseInt(nevative_margin) * -1);
  }else{
    const offset_top = $(window).scrollTop();
    $("body").addClass("drawer-open");
    $("body").css("top", "-" + offset_top + "px");
  }
}

function set_offset(){
  window.scrollTo(0,0);
}

function do_scroll(distance){
  $('body, html').animate({
    scrollTop: distance
  }, 500);
  return false;
}

// ウィンドウの横幅を取得
function get_window_width(){
  return window.innerWidth;
}

// ウィンドウの縦幅を取得
function get_window_height(){
  return $(window).height();
}

// 特定した移動先のポジションを取得
function get_position(content){
  return content.offset().top;
}

function get_param(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function show_loading(status){
  if(status !== false) status = true;
  if(status === true){
    $("#loading").addClass("active");
  }else if(status === false){
    $("#loading").removeClass("active");
  }
}

function remove_loading(){
  return new Promise(function (resolve, reject) {
    setTimeout(function(){
      $("#loading").removeClass("active");
      resolve();
    }, 500);
  });
}
