$(function(){
    $('form').submit(function(){
        
        if(validateUsername() && validatePassword()){

            $.post('libs/auth.php',$('form').serialize(),function(response){
                if(response == 'true'){
                    showSucess('You will be redirected shortly')
                }
                else {
                    showError(response);
                }
            });
        }

        function validateUsername(){
            if($('#usernname').val().length == 0){
                showError('Username cannot be empty');
                return false;
            }
            else{return true;}
        }        
        
        function validatePassword(){
            if($('#password').val().length == 0){
                showError('Password cannot be empty');
                return false
            }
            else{return true;}
        }
    
        

        function showSuccess(message){
            $('<div class="ui-loader ui-overlay-shadow ui_body_success ui-corner-all"><h1>'+message+'</h1></div>').css({"display": "block", "opacity": 0.96, top: $(window).scrollTop() + 100})
                .appendTo( $.mobile.pageContainer)
                .delay( 2000 )
                .fadeOut( 400, function() {
                    $(this).remove();
                });
        }
        function showError(message){
            $('<div class="ui-loader ui-overlay-shadow ui_body_error ui-corner-all"><h1>'+message+'</h1></div>').css({"display": "block", "opacity": 0.96, top: $(window).scrollTop() + 100})
                .appendTo( $.mobile.pageContainer)
                .delay( 2000 )
                .fadeOut( 400, function() {
                    $(this).remove();
                });
        }

        
        return false;
    })
})