angular.module('techNodeApp').directive('ctrlEnterBreakLine',function(){
    return function(scope,element,attrs){
        var ctrlDown = false;
        element.bind('keydown',function(evt){
            if(evt.keyCode == 17){
                ctrlDown = true;
                setTimeout(function(){
                    ctrlDown = false;
                },1000);
            }
            if(evt.keyCode == 13){
                if(ctrlDown){
                    element.val(element.val() + '\n')
                }else{
                    scope.$apply(function(){
                       scope.$eval(attrs.ctrlEnterBreakLine);
                    });
                    evt.preventDefault();
                }
            }
        });
    };
});
