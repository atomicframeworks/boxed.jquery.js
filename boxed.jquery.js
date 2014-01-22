$(function(){
    (function ( $ ) {
     
        $.fn.boxed = function( options ) {
            
            function center(){
                // Grab the modal
                var $boxedModal = $('.boxed-modal');
                        
                // Vertical - half outer height (height + padding)
                var top = ($boxedModal.outerHeight() / 2);
            
                // Horizontal - half outer width (width + padding)            
                var left = ($boxedModal.outerWidth() / 2);
            
                // Reset to 50%
                $boxedModal.css({
                    top: '50%',
                    left: '50%',
                    'margin-left': '0',
                    'margin-top': '0'
                }).css({
                    // Adjust to center
                    'margin-left': '-=' + left,
                    'margin-top': '-=' + top
                });
            
            }
            
            function close(){
                $('.boxed-container').fadeOut(100, function(){
                    $(this).remove();
                });  
            }
            
            // This is the easiest way to have default options.
            var settings = $.extend(true, {
                // These are the defaults.
                'class': '',
                // If containerClose is true clicking the main container will close the boxed
                containerClose: false,
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
                        'z-index': 9999
                    },
                    // Styles for .boxed-modal
                    modal: {
                        overflow: 'hidden',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        padding: '30px',
                        margin: '0 auto',
                        'background-color': '#fff'
                    },
                    // Styles for .boxed-close
                    close: {
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '10px',
                        height: '10px',
                        float: 'right',
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
                    }
                }
            }, options );
        
            this.on('click.boxed', function(e){
                e.preventDefault();
                console.log(1);
                // Construct boxed element
                var $boxed = $(
                    '<div class="boxed-container ' + settings.class + '">' +
                    '    <div class="boxed-modal">' +
                    '        <div class="boxed-content"></div>' +
                    '        <span class="boxed-close">X</span>' +
                    '    </div>' +
                    '</div>'
                );
                                
                $('body').append($boxed);
              
                // Apply the container styles
                var $boxedContainer = $('.boxed-container').css( settings.styles.container );
                
                // Apply the modal styles
                var $boxedModal = $boxedContainer.find('.boxed-modal').css( settings.styles.modal );
                
                // Apply the close button styles
                var $boxedClose = $boxedContainer.find('.boxed-close').css( settings.styles.close );
                
                // REPLACE THIS
                var url = $(this).attr('href');
                
                // Close button binds
                $boxedClose.on('click.boxed', function() {
                    close();
                }).on('mouseenter.boxed', function() {
                    // Apply the mouse enter styles
                    $(this).css(settings.styles.closeMouseEnter);
                }).on('mouseleave.boxed', function() {
                    // Apply the mouse leave styles
                    $(this).css(settings.styles.closeMouseLeave);                
                });
                
                // If containerClose is true allow clicking the main container to close the boxed
                if (settings.containerClose) {
                    $boxedContainer.on('click', function(e){
                        // If outer container
                        if($(e.target).is(this)){
                            close();
                        }
                    });
                }
                
                $boxedContainer.find('.boxed-content').load(url, function (){
                    $boxedContainer.fadeIn();
                    center();
                });
                
                //center();    
                
            });
            
            // Greenify the collection based on the settings variable.
            return this;
        };
 
    }( jQuery ));
    
    $('.one a').boxed();
    
});
