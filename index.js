var ViewModel = function () {

    var self = this;

    self.patterns = ko.observableArray([]);


    self.getInput = function () {
        var i = localStorage.getItem("input");
        if (i) {
            self.input(i);
        }
    }
    self.setInput = function () {
        localStorage.setItem("input", self.input());
    }

    self.getPatterns = function () {
        var json = localStorage.getItem("patterns");
        if (!json) {
            json = "[]";
        }
        self.patterns(JSON.parse(json));
    }

    self.setPatterns = function () {
        localStorage.setItem("patterns", JSON.stringify(self.patterns()));
    }

    self.addPattern = function () {
        self.patterns.push(self.pattern());
        self.setPatterns();
    }

    self.downloadPatterns = function () {

        function download(filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }

        // Start file download.
        download("patterns.json", JSON.stringify(self.patterns()));

    }

    self.removePattern = function () {
        function arrayRemove(arr, value) {
            return arr.filter(function (ele) {
                return ele != value;
            });
        }

        var p = self.patterns();
        var v = self.pattern();
        p = arrayRemove(p, v)
        self.patterns(p);
        self.setPatterns()
    }

    self.updatePattern = function () {
        var s = self.selectedPattern();
        var p = self.pattern();
        var t = self.patterns();

        for (let i = 0; i < t.length; i++) {
            if (s == t[i]) {
                t[i] = p;
            }
        }
        self.patterns(t);
        self.selectedPattern(self.pattern());
        self.setPatterns();
    }

    self.patternChanged = function () {
        self.pattern(self.selectedPattern());
    }

    self.input = ko.observable('Id int\nName string\nDoB System.DateTime');
    self.input.subscribe(function () {
        self.setInput();
    });
    self.pattern = ko.observable('');
    self.selectedPattern = ko.observable('');

    self.output = ko.pureComputed(function () {
        if (self.input() != '' && self.pattern() != '') {
            var ol = [];
            var pattern = self.pattern();

            var lines = self.input().split(/\n/g)

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                var parts = line.split(' ');
                var p = pattern;
                for (let j = 0; j < parts.length; j++) {
                    const part = parts[j];
                    var reg = new RegExp("\\{" + j + "\\}", "g");
                    p = p.replace(reg, part);
                }
                ol.push(p);
            }

            return ol.join('');
        }
        else {
            return '...';
        }
    }, self);

}

function getFileText(file) {
    var reader = new FileReader();
    //reader.readAsDataURL(file);
    //reader.readAsArrayBuffer(file);
    reader.readAsText(file, "UTF-8");
    reader.onload = function () {
      localStorage.setItem("patterns",reader.result);
      model.getPatterns();
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

fileChanged = function (e) {
    var files = e.target.files;
    var file = files[0];
    getFileText(file);
}

var model = new ViewModel();
ko.applyBindings(model);
model.getInput();
model.getPatterns();