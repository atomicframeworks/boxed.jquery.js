/*!
                        
       ##    #####      Copyright (c) - Kevin McGinty
     # _ #  ###        
    #   #  #            AtomicFrameworks
    
*/
/*global $, jQuery, setInterval, setTimeout, clearInterval*/

$(function () {
    "use strict";
    (function ($) {
        $.fn.boxed = function (options) {
            // Extend default settings with provided options
            var settings = $.extend(true, {}, $.fn.boxed.defaults, options);
            // If containerClose enabled add extra style for container element
            if (settings.containerClose && (settings.styles.container.cursor === null || settings.styles.container.cursor === undefined)) {
                settings.styles.container.cursor = 'pointer';
            }
            // Bind clicks
            this.on('click.boxed', function (e) {
                e.preventDefault();
                // Construct boxed element
                var $boxed = $('<div class="boxed-container ' + settings['class'] + '">' +
                    '               <div class="boxed-modal">' +
                    '                   <div class="boxed-content"></div>' +
                    '                   <span class="boxed-close">' + settings.closeText + '</span>' +
                    '               </div>' +
                    '           </div>'),
                    // Boxed elements
                    $boxedContainer,
                    $boxedModal,
                    $boxedContent,
                    $boxedClose,
                    $spinner,
                    $clone,
                    url,
                    // Interval and angle for spinner
                    angle = 0,
                    rotateInterval;
                // Add the boxed element
                $('body').append($boxed);
                // Apply the container styles
                $boxedContainer = $('.boxed-container').css(settings.styles.container);
                // Apply the modal styles
                $boxedModal = $boxedContainer.find('.boxed-modal').css(settings.styles.modal);
                // Apply the content styles
                $boxedContent = $boxedContainer.find('.boxed-content').css(settings.styles.content);
                // Apply the close button styles
                $boxedClose = $boxedContainer.find('.boxed-close').css(settings.styles.close);
                // REPLACE THIS
                url = $(this).attr('href');
                // Close button binds
                $boxedClose.on('click.boxed', function () {
                    $.fn.boxed.close();
                }).on('mouseenter.boxed', function () {
                    // Apply the mouse enter styles
                    $(this).css(settings.styles.closeMouseEnter);
                }).on('mouseleave.boxed', function () {
                    // Apply the mouse leave styles
                    $(this).css(settings.styles.closeMouseLeave);
                });
                // If containerClose is true allow clicking the main container to close the boxed
                if (settings.containerClose) {
                    $boxedContainer.on('click', function (e) {
                        // If outer container
                        if ($(e.target).is(this)) {
                            $.fn.boxed.close();
                        }
                    });
                }
                // Add spinner element
                $spinner = $('<span class="spinner">Loading...</span>').appendTo($boxedContent);
                // Style the new spinner
                $spinner.css(settings.styles.spinner);
                // Repeating rotate function
                rotateInterval = setInterval(function () {
                    angle += 40;
                    $('.spinner').css({
                        '-webkit-transform': 'rotate(' + angle + 'deg)',
                        '-moz-transform': 'rotate(' + angle + 'deg)',
                        '-ms-transform': 'rotate(' + angle + 'deg)',
                        'transform': 'rotate(' + angle + 'deg)'
                    });
                }, 100);
                // Center and show the new spinner
                $.fn.boxed.center(0, $boxedModal);
                $boxedContainer.fadeIn();
                // Create a clone of boxed to hold the loaded content temporarily
                $clone = $boxedContainer.clone();
                $clone.css('visibility', 'hidden').appendTo($('body'));
                // Load the URL to the boxed content
                $clone.find('.boxed-content').load(url, function () {
                    var $cloneContent = $(this),
                        width = $cloneContent.width(),
                        height = $cloneContent.height(),
                        // Get the clone modal element
                        $cloneModal = $clone.find('.boxed-modal'),
                        // Vertical - half outer height (height + padding)
                        top = ($cloneModal.outerHeight() / 2),
                        // Horizontal - half outer width (width + padding)            
                        left = ($cloneModal.outerWidth() / 2);
                    // Remove the spinner
                    $boxedContent.html('');
                    // Stop the spinner interval
                    clearInterval(rotateInterval);
                    // Animate the width of the content
                    $boxedContainer.find('.boxed-content').animate({
                        width: width,
                        height: height
                    }, 1000);
                    // Animate to the center for modal
                    $boxedModal.animate({
                        // Adjust to center
                        'margin-left': -left,
                        'margin-top': -top
                    }, 1000, function () {
                        // After centering show fade in the new content
                        $boxedContent.css({
                            visibility: 'hidden'
                        });
                        // Append the loaded content
                        $boxedContent.html($clone.find('.boxed-content').html());
                        $boxedContent.css('visibility', 'visible').hide().fadeIn(333);
                        // Remove the clone
                        $clone.remove();
                    });
                });
            });
            // Return this for chaining
            return this;
        };
        // Method to center the boxed element
        $.fn.boxed.center = function (time, $boxedModal) {
            if (!time) {
                time = 0;
            }
            if (!$boxedModal) {
                // Grab the modal if none passed
                $boxedModal = $('.boxed-container .boxed-modal');
            }
            if ($boxedModal.length) {
                // Vertical - half outer height (height + padding)
                var top = ($boxedModal.outerHeight() / 2),
                    // Horizontal - half outer width (width + padding)            
                    left = ($boxedModal.outerWidth() / 2);
                // Reset to 50%
                $boxedModal.css({
                    top: '50%',
                    left: '50%',
                    'margin-left': '0',
                    'margin-top': '0'
                }).animate({
                    // Adjust to center
                    'margin-left': '-=' + left,
                    'margin-top': '-=' + top
                }, time);
            }
        };
        // Method to close the boxed element
        $.fn.boxed.close = function () {
            $('.boxed-container').fadeOut(100, function () {
                $(this).remove();
            });
        };
        // Default settings that will be extended with options
        $.fn.boxed.defaults = {
            // These are the defaults.
            'class': '',
            // If containerClose is true clicking the main container will close the boxed
            containerClose: false,
            // Text in the .boxed-close element
            closeText: 'X',
            // Styles to apply
            styles: {
                // Styles for .boxed-container
                container: {
                    position: 'fixed',
                    display: 'none',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    'background-color': 'rgba(0, 0, 0, .80)',
                    'z-index': 999
                },
                // Styles for .boxed-modal
                modal: {
                    overflow: 'visible',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '0 auto',
                    padding: '30px',
                    'background-color': '#fff',
                    cursor: 'default',
                    '-webkit-transition': 'height 1s ease, width 1s ease',
                    '-moz-transition': 'height 1s ease, width 1s ease',
                    '-ms-transition': 'height 1s ease, width 1s ease',
                    '-o-transition': 'height 1s ease, width 1s ease',
                    'transition': 'height 1s ease, width 1s ease'
                },
                // Styles for .boxed-content
                content: {
                    overflow: 'hidden'
                },
                // Styles for .boxed-close
                close: {
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '10px',
                    height: '10px',
                    'font-size': '16px',
                    'font-weight': 'bold',
                    'text-decoration': 'none',
                    color: '#00aaef',
                    cursor: 'pointer'
                },
                // Styles for .boxed-close:hover
                closeMouseEnter: {
                    color: '#00c3ff'
                },
                // Styles to reset .boxed-close:hover
                closeMouseLeave: {
                    color: '#00aaef'
                },
                // Styles for spinner
                spinner: {
                    'display': 'inline-block',
                    'width': '20px',
                    'height': '20px',
                    'border-width': '7px',
                    'border-style': 'solid',
                    'border-color': 'rgba(0, 0, 0, .7)',
                    'border-top-color': 'rgba(125, 175, 200, .8)',
                    'color': 'transparent',
                    '-webkit-border-radius': '100%',
                    '-moz-border-radius': '100%',
                    'border-radius': '100%'
                }
            }
        };
    }(jQuery));
});
