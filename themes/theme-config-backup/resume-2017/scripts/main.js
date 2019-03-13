/**
 * Created by ypl on 16-10-28.
 */
$(document).ready(function () {

        var hideorshow = $(".hide-show"),
            sidebar = $("#side-bar");
        var flag = false ;
        var returntop = $("#return-top");
        hideorshow.click(function(event) {
          if(flag){
                  flag = false;
                  sidebar.css({left:"0px"});
                 hideorshow.css("right","0px");
          }else{
               flag = true;
               sidebar.css("left","-200px");
               hideorshow.css("right","-30px");
          }

        });
        $(window).on("scroll",function(){
        if($(window).scrollTop() >$(".header").height()+$(".sub-heading").height()) {
            sidebar.fadeIn();
            returntop.show("slow");
        }
        else {
            sidebar.fadeOut();
            returntop.hide("slow");
        }
    });
        returntop.click(function(){
        $("html,body").animate(
            {scrollTop:0}
        );
    });
        var li1 = $("#item1");
    var li2 = $("#item2");
    var li3 = $("#item3");
    var li4 = $("#item4");
    var li5 = $("#item5");
    var high1=$(".header").height()+$(".sub-heading").height()+100;
    var high2=high1+$(".base-data").height();
    var high3 = high2+$(".education-level").height();
    var high4= high3+$(".project-detail").height();
    var high5=high4+$(".mytechnology").height();
    li1.click(function(){
        $("html,body").animate(
            {scrollTop:high1}
        );
    });
    li2.click(function(){
        $("html,body").animate(
            {scrollTop:high2}
        );
    });
    li3.click(function(){
        $("html,body").animate(
            {scrollTop:high3}
        );
    });
    li4.click(function(){
        $("html,body").animate(
            {scrollTop:high4}
        );
    });
    li5.click(function(){
        $("html,body").animate(
            {scrollTop:high5}
        );
    });
    }
);
