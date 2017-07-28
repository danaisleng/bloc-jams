var sellingPoints = document.getElementById('sellingPoints');
function offset(elt) {
    var rect = elt.getBoundingClientRect(), bodyElt = document.body;

    return {
      top: rect.top + bodyElt .scrollTop,
      left: rect.left + bodyElt .scrollLeft
    }
};

var offset = offset(sellingPoints);

window.onscroll = function() {
    if (window.pageYOffset > (offset.top - 350)) {
        revealPoint('point');
    };
}



function revealPoint(points){
    var points = document.getElementsByClassName(points);

    for(var i = 0; i < points.length; i++){
        points[i].style.opacity = 1;
        points[i].style.transform = 'scaleX(1) translateY(0)';
        points[i].style.msTransform = 'scaleX(1) translateY(0)';
        points[i].style.WebkitTransform = 'scaleX(1) translateY(0)';
    }
};