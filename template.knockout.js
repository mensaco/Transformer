ko.bindingHandlers.editableHTML = {
    init: function (element, valueAccessor) {
        //var $element = $(element);
        var initialValue = ko.utils.unwrapObservable(valueAccessor());
        element.textContent = initialValue;
        //element.addEventListener("keyup")
        element.addEventListener('keyup', function () {
            observable = valueAccessor();
            observable(element.textContent);
        });
    }
};

var ViewModel = function () {
    var self = this;

    self.input = ko.observable('');
    self.output = ko.observable('');


}




var model = new ViewModel();



ko.applyBindings(model);

