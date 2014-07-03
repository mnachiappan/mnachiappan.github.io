/**
 * Created by Meyyappan on 6/24/2014.
 */

function changeMenuClass(){
    var open = "opened-nav";
    var close = "closed-nav"

    var openscreen = "show-smoke-screen";
    var hidescreen = "hide-smoke-screen"


    // toggle the side bar
    var menu = document.getElementById("navigation-menu");
    var className = menu.className;
    if(className === open){
        menu.className = close;
    }else if(className === close){
        menu.className = open;
    }

    // toggle the smoke screen aka the black screen


    var screen = document.getElementById("smoke-screen");
    var className = screen.className;
    if(className === openscreen){
        console.log("hidingscreen");
        screen.className = hidescreen;
    }else if(className === hidescreen){
        console.log("Opening screen");
        screen.className = openscreen;
    }

    // move entire scree

    var closure = document.getElementById("closure");
    var closureClassName = closure.className;
    if(closureClassName === "move-right"){
        console.log("moving-left");
        closure.className = "regular-screen";
    }else{
        closure.className = "move-right";
        console.log("moving-right");
    }
}

$(document).ready(function(){

    var toggleMenuIds = ["#menu-toggle", "#smoke-screen"];
    for (var id in toggleMenuIds) {
        console.log(id);
        $(toggleMenuIds[id]).click(
            function(){
                changeMenuClass();
            }
        );
    }

    $(function() {
        $('a[href*=#]:not([href=#])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                if (target.length) {
                    $("html, body").animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });
    });




});