define(['plugins/dialog', 'knockout'], function (dialog, ko) {
    var attendee = function() {
     
    };
    
    attendee.prototype.cancel = function() {
           
        dialog.close(this);              
    };
    attendee.prototype.ok = function() {
    
        // var that=this;
        // var barcode=$("#barcode").val();
        // dialog.close(that,barcode);
        
    };
    attendee.prototype.attached=function(){
       
        //  $("#barcode").focus(function(){
        //          $("#barcode").css("background-color","#FFFFCC");
        //              });
        //  $(document).keydown(function(event){ 
        //     if(event.keyCode==13){ 
        //         $("#confirm").click(); 
        //     } 
        //     }); 


    };
       
     attendee.prototype.compositionComplete=function(view){
        // setTimeout(function(){
           
            
        //       $("#barcode").focus();

        // },500);
        
       // alert('focus');

     }
    attendee.prototype.canDeactivate = function () {
        return true;
        
    };

    attendee.show = function(){
       
        return dialog.show(new attendee());
    };
    
  
           
       
    return attendee;
});