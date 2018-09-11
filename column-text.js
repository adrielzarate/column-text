$.fn.columnText = function(options) {

    var settings = $.extend({
        lineHeight: 10,
        diameter: 400,
        rotateX: 0,
        rotateY: 0,
        speed: 0.1,
        rotationDirection: 'left',
        verticalDirection: 'top'
    }, options);

    var lineHeight = settings.lineHeight;
    var diameterMax = settings.diameter;

    var maxElWidth = 0,
        maxElHeight = 0,
        currentDeg = 0,
        circleWidthSection = 0,
        marginTop = 0,
        currentMarginTop = 0,
        wordsPerCircle = 0,
        longCirc = 0,
        radioCircle = 0,
        diameter = 0;

    var textColumn = this;
    var originalContent = textColumn.text();
    var arrayContent = originalContent.split('');
    var columnTextContent = '';

    textColumn.html('');

    columnTextContent = '';
    for (var i = 0; i < arrayContent.length; i++) {
        columnTextContent += '<div class="coltext-item">' + arrayContent[i] + '</div>'
    }
    textColumn.html(columnTextContent);

    var children = textColumn.find('.coltext-item');
    var elLength = children.length;

    textColumn.css({
        position: 'absolute',
        transformStyle: 'preserve-3d',
        top: '50%',
        left: '50%',
        // perspective: '800px',
        transform: 'rotateX(' + settings.rotateX + 'deg) rotateY(' + settings.rotateY + 'deg)'
    });

    children.css({
        position: 'absolute',
        transformStyle: 'preserve-3d',
        transformOrigin: '0 0',
        textAlign: 'center'
        // backfaceVisibility: 'hidden'
    });

    children.each(function() {
        var elW = $(this).width();
        if (elW > maxElWidth) maxElWidth = elW;
    });

    longCirc = maxElWidth * elLength;
    radioCircle = longCirc / ( Math.PI * 2 );
    diameter = radioCircle * 2;

    if ( diameter > diameterMax ) {

        radioCircle = diameterMax / 2;
        longCirc = Math.PI * diameterMax;
        wordsPerCircle = Math.floor(longCirc / maxElWidth);
        circleWidthSection = 360 / wordsPerCircle;

        children.each(function() {
            var elH = $(this).height();
            if (elH > maxElHeight) maxElHeight = elH;
        });

        children.height(maxElHeight);

        marginTop = (lineHeight + maxElHeight) / wordsPerCircle;

        children.each(function() {
            $(this).css({transform: 'rotateY(' + currentDeg + 'deg) translate3D(-50%, ' + currentMarginTop + 'px,' + radioCircle + 'px)'});
            currentDeg += circleWidthSection;
            currentMarginTop += marginTop;
        });

    } else {

        circleWidthSection = 360 / elLength;
        radioCircle = settings.diameter / 2;

        longCirc = Math.PI * settings.diameter;
        children.width(longCirc / elLength);

        children.each(function() {
            $(this).css({transform: 'rotateY(' + currentDeg + 'deg) translate3D(-50%, 0,' + radioCircle + 'px)'});
            currentDeg += circleWidthSection;
        });
    }

    var startRotateX = settings.rotateX;
    var startRotateY = settings.rotateY;
    var rotationDirection;
    var verticalDirection;

    switch (settings.rotationDirection) {
    case 'left':
        rotationDirection = -1;
        break;
    case 'right':
        rotationDirection = 1;
        break;
    default:
        rotationDirection = 0;
    }

    switch (settings.verticalDirection) {
    case 'top':
        verticalDirection = -1;
        break;
    case 'bottom':
        verticalDirection = 1;
        break;
    default:
        verticalDirection = 0
    }

    function animation(timestamp) {
        if (!startRotateY) startRotateY = timestamp;
        var progressRotateY = timestamp - startRotateY;
        textColumn.css({
            transform: 'rotateX(' + startRotateX + 'deg) rotateY(' + progressRotateY * settings.speed * rotationDirection + 'deg)  translateY('+ progressRotateY * settings.speed * verticalDirection +'px)'
        });
        window.requestAnimationFrame(animation);
    }

    window.requestAnimationFrame(animation);

};